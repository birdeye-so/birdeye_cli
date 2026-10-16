import {readFileSync, existsSync} from "node:fs";
import {join, dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {createHash} from "node:crypto";
import type {Ledger} from "./ledger.js";
import {AppError, integer} from "./shared.js";

type Entry = {id:string;title:string;source:string;sha256:string};
const digest = (value:string) => createHash("sha256").update(value).digest("hex");
function bundledRoot() {
  let dir=dirname(fileURLToPath(import.meta.url));
  for(let i=0;i<4;i++,dir=dirname(dir)) {
    const file=join(dir,"package.json");
    if(existsSync(file) && JSON.parse(readFileSync(file,"utf8")).name==="birdeye-cli")return join(dir,"knowledge/birdeye");
  }
  throw new AppError("KNOWLEDGE_MISSING","Bundled Birdeye knowledge snapshot is missing. Reinstall the CLI package.");
}
export class KnowledgeBase {
  readonly info: {documents:number;sourceCommit:string;generatedAt:string};
  constructor(private ledger:Ledger, root=bundledRoot()) {
    const raw=readFileSync(join(root,"manifest.json"),"utf8");
    const manifest=JSON.parse(raw) as {entries:Entry[];sourceCommit:string;generatedAt:string};
    this.info={documents:manifest.entries.length,sourceCommit:manifest.sourceCommit,generatedAt:manifest.generatedAt};
    ledger.db.exec(`CREATE TABLE IF NOT EXISTS knowledge_meta (key TEXT PRIMARY KEY,value TEXT);
      CREATE TABLE IF NOT EXISTS knowledge_documents (id TEXT PRIMARY KEY,title TEXT,source TEXT,hash TEXT,body TEXT);
      CREATE VIRTUAL TABLE IF NOT EXISTS knowledge_chunks USING fts5(docid UNINDEXED,title,section,body,line UNINDEXED,tokenize='unicode61 remove_diacritics 2');`);
    const fingerprint=digest("chunks-v1:"+raw);
    if(ledger.db.prepare("SELECT value FROM knowledge_meta WHERE key='fingerprint'").get()?.value===fingerprint)return;
    ledger.db.exec("BEGIN IMMEDIATE");
    try {
      ledger.db.exec("DELETE FROM knowledge_documents; DELETE FROM knowledge_chunks;");
      const addDoc=ledger.db.prepare("INSERT INTO knowledge_documents VALUES(?,?,?,?,?)");
      const addChunk=ledger.db.prepare("INSERT INTO knowledge_chunks(docid,title,section,body,line) VALUES(?,?,?,?,?)");
      for(const entry of manifest.entries) {
        if(!/^(docs|cli)\/[\w./ -]+\.md$/.test(entry.id)||entry.id.split("/").includes(".."))throw new Error("Invalid document ID");
        const body=readFileSync(join(root,entry.id),"utf8");
        if(digest(body)!==entry.sha256)throw new Error("Knowledge snapshot hash mismatch");
        addDoc.run(entry.id,entry.title,entry.source,entry.sha256,body);
        let chunk="",section=entry.title,start=1;
        const flush=()=>{if(chunk.trim())addChunk.run(entry.id,entry.title,section,chunk,start);chunk="";};
        for(const [index,line] of body.split("\n").entries()) {
          if(/^#{1,6} /.test(line)) {flush();section=line.replace(/^#+ /,"");start=index+1;}
          if(chunk.length+line.length>3500) {flush();start=index+1;}
          // Long prose/code lines still stay within a bounded search chunk.
          for(let offset=0;offset<line.length;offset+=3500) {
            if(offset){flush();start=index+1;}
            chunk+=line.slice(offset,offset+3500);
          }
          chunk+="\n";
        }
        flush();
      }
      ledger.db.prepare("INSERT INTO knowledge_meta VALUES('fingerprint',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(fingerprint);
      ledger.db.exec("COMMIT");
    }catch(error){ledger.db.exec("ROLLBACK");throw error;}
  }
  search(query:string,limit=5) {
    integer(limit,"limit",1,5);
    if(!query.trim()||query.length>500)throw new AppError("INVALID_INPUT","Docs query must have 1–500 characters.");
    const terms=[...new Set(query.toLowerCase().match(/[\p{L}\p{N}_]+/gu)||[])].slice(0,12);
    if(!terms.length)return [];
    return this.ledger.db.prepare(`SELECT c.docid AS id,d.title,d.source,d.hash,c.line,c.section,
      snippet(knowledge_chunks,3,'','', ' … ',48) AS excerpt
      FROM knowledge_chunks c JOIN knowledge_documents d ON d.id=c.docid
      WHERE knowledge_chunks MATCH ? ORDER BY bm25(knowledge_chunks,0,6,3,1,0) LIMIT ?`)
      .all(terms.map(t=>'"'+t+'"').join(" OR "),limit)
      .map(r=>({id:String(r.id),title:String(r.title),source:String(r.source),hash:String(r.hash),line:Number(r.line),section:String(r.section),citation:`${r.id}:L${r.line}`,excerpt:String(r.excerpt).slice(0,2200)}));
  }
  read(id:string,offset=0) {
    integer(offset,"offset",0,10000000);
    const row=this.ledger.db.prepare("SELECT * FROM knowledge_documents WHERE id=?").get(id);
    if(!row)throw new AppError("DOCUMENT_NOT_FOUND","Choose a document ID returned by search_birdeye_docs.");
    const body=String(row.body),text=body.slice(offset,offset+10000);
    return {id,title:row.title,source:row.source,hash:row.hash,offset,text,nextOffset:offset+text.length<body.length?offset+text.length:null};
  }
}
