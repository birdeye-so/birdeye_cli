import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {parseArgs} from 'node:util';
import {credentialFindings} from './lib/credential-scan.mjs';
const {values} = parseArgs({options: {history: {type: 'boolean', default: false}}});
const git = args => execFileSync('git', args, {maxBuffer: 128 * 1024 * 1024});
let failures = 0, inspected = 0;
function inspect(label, data) {
  inspected++;
  for (const finding of credentialFindings(data.toString('utf8'))) {
    // Neither literal values nor matching source lines belong in CI logs.
    console.error(`${label}:${finding.line}: ${finding.rule} (value redacted)`);
    failures++;
  }
}
if (values.history) {
  const objects = git(['rev-list', '--objects', '--all', 'HEAD']).toString().trim().split('\n').map(line => line.split(' ')[0]);
  const metadata = execFileSync('git', ['cat-file', '--batch-check=%(objectname) %(objecttype)'], {input: objects.join('\n') + '\n', encoding: 'utf8'});
  for (const line of metadata.trim().split('\n')) {
    const [id, type] = line.split(' ');
    if (type === 'blob') inspect(`blob:${id}`, git(['cat-file', 'blob', id]));
  }
} else {
  for (const path of git(['ls-files', '-z']).toString().split('\0').filter(Boolean)) {
    try {inspect(path, readFileSync(path));}
    catch (error) {if (error.code !== 'ENOENT') throw error;}
  }
}
console.log(`Credential literal check: ${failures} finding(s), ${inspected} ${values.history ? 'historical objects' : 'tracked files'} inspected.`);
process.exitCode = failures ? 1 : 0;
