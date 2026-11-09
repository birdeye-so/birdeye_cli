import {createServer,type IncomingMessage} from "node:http";
import {readFile} from "node:fs/promises";
import {AppError} from "../shared.js";
import {workflowCatalog} from "../workflows/registry.js";
import {skillForPath} from "../skill-routes.js";
// Opt-in relay for AI providers whose CORS preflight fails in browsers. Keys pass through
// this process in memory only; they are never logged or stored.
const relayPath=/^\/relay\/([a-z0-9.-]+(?::[0-9]{1,5})?)(\/[A-Za-z0-9._~\/-]*\/(?:chat\/completions|responses))$/;
const relayBodyLimit=4_000_000,relayResponseLimit=4_000_000,relayConcurrency=16;
async function readBody(req:IncomingMessage,limit:number) {
  const chunks:Buffer[]=[];let size=0;
  for await (const chunk of req){size+=chunk.length;if(size>limit)throw new AppError("RELAY_BODY_TOO_LARGE","Request body is too large.");chunks.push(chunk);}
  return Buffer.concat(chunks);
}
export async function startBrowserInterface(bind="127.0.0.1:3000", publicUrlInput?:string, options:{aiRelayHosts?:string[];relayFetch?:typeof fetch}={}) {
  const relayHosts=(options.aiRelayHosts??[]).map(host=>host.trim().toLowerCase()).filter(Boolean);
  for(const host of relayHosts)
    if(!/^[a-z0-9.-]+(?::[0-9]{1,5})?$/.test(host) || ["localhost","127.0.0.1"].includes(host.split(":")[0]))
      throw new AppError("INVALID_AI_RELAY",`AI relay host must be a public hostname such as api.z.ai, without scheme or path: ${host}`);
  let relaying=0;
  const match=/^(127\.0\.0\.1|localhost):([0-9]+)$/.exec(bind);
  if(!match || Number(match[2])>65535)throw new AppError("INVALID_BIND","Browser preview supports localhost or 127.0.0.1. Deploy dist/browser to an HTTPS static host for public access.");
  let publicUrl:URL|undefined;
  if(publicUrlInput){
    try{publicUrl=new URL(publicUrlInput);}catch{throw new AppError("INVALID_PUBLIC_URL","Use an HTTPS origin, for example https://demo.example.com.");}
    if(publicUrl.protocol!=="https:" || publicUrl.username || publicUrl.password || publicUrl.pathname!=="/" || publicUrl.search || publicUrl.hash)
      throw new AppError("INVALID_PUBLIC_URL","Public URL must be an HTTPS origin without credentials, path, query or fragment.");
  }
  const allowedHosts=new Set<string>(),allowedOrigins=new Set<string>();
  if(publicUrl){allowedHosts.add(publicUrl.host);allowedOrigins.add(publicUrl.origin);}
  const assets:Record<string,[string,string]>={
    "/":["index.html","text/html; charset=utf-8"],
    "/index.html":["index.html","text/html; charset=utf-8"],
    "/main.js":["main.js","text/javascript; charset=utf-8"],
    "/main.css":["main.css","text/css; charset=utf-8"],
  };
  // Fail at startup if the browser build is missing.
  await readFile(new URL("../browser/index.html",import.meta.url));
  const server=createServer(async(req,res)=>{
    res.setHeader("X-Content-Type-Options","nosniff");
    res.setHeader("Referrer-Policy","no-referrer");
    res.setHeader("X-Frame-Options","DENY");
    res.setHeader("Cache-Control","no-store");
    if(!allowedHosts.has(req.headers.host||"") || (req.headers.origin && !allowedOrigins.has(req.headers.origin))){
      res.writeHead(403);res.end("Origin is not allowed");return;
    }
    let url: URL;
    try {
      const target=req.url || "/";
      if (!target.startsWith("/") || target.startsWith("//")) throw new Error("Invalid request target");
      url=new URL(target,"http://localhost");
    } catch {
      res.writeHead(400);res.end("Invalid request URL");return;
    }
    const path=url.pathname;
    if(req.method==="GET" && path==="/relay-hosts.json"){
      res.writeHead(200,{"Content-Type":"application/json; charset=utf-8"});res.end(JSON.stringify({hosts:relayHosts}));return;
    }
    const relay=relayPath.exec(path);
    if(relay && req.method==="POST" && relayHosts.includes(relay[1])){
      if(relaying>=relayConcurrency){res.writeHead(429,{"Content-Type":"application/json"});res.end(JSON.stringify({error:{message:"AI relay is busy. Retry shortly."}}));return;}
      relaying++;
      const controller=new AbortController();
      res.once("close",()=>controller.abort());
      try{
        const body=await readBody(req,relayBodyLimit);
        // Forward only what the provider needs; never cookies, browser hints or client addresses.
        const headers:Record<string,string>={"Content-Type":"application/json"};
        if(typeof req.headers.authorization==="string")headers.Authorization=req.headers.authorization;
        const upstream=await (options.relayFetch??fetch)(`https://${relay[1]}${relay[2]}`,{method:"POST",headers,body,redirect:"error",signal:AbortSignal.any([controller.signal,AbortSignal.timeout(120000)])});
        const reply=Buffer.from(await upstream.arrayBuffer());
        if(reply.length>relayResponseLimit)throw new AppError("RELAY_RESPONSE_TOO_LARGE","AI provider response is too large.");
        res.writeHead(upstream.status,{"Content-Type":upstream.headers.get("content-type")||"application/json"});res.end(reply);
      }catch(error){
        if(res.headersSent||controller.signal.aborted&&res.destroyed)return;
        const tooLarge=error instanceof AppError && error.code==="RELAY_BODY_TOO_LARGE";
        res.writeHead(tooLarge?413:502,{"Content-Type":"application/json"});
        res.end(JSON.stringify({error:{message:tooLarge?error.message:"AI relay could not reach the provider."}}));
      }finally{relaying--;}
      return;
    }
    const skill=skillForPath(path,workflowCatalog());
    if(req.method==="GET" && skill && path!==`/${skill.kind}`){
      res.writeHead(302,{Location:`/${skill.kind}${url.search}`});res.end();return;
    }
    const asset=assets[path] ?? (skill ? assets["/"] : undefined);
    if(req.method!=="GET"||!asset){res.writeHead(404);res.end("Not found");return;}
    try{
      const body=await readFile(new URL("../browser/"+asset[0],import.meta.url));
      res.writeHead(200,{"Content-Type":asset[1]});res.end(body);
    }catch{res.writeHead(500);res.end("Browser build unavailable. Run npm run build.");}
  });
  try {
    await new Promise<void>((resolve,reject)=>{server.once("error",reject);server.listen(Number(match[2]),match[1],()=>resolve());});
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "EADDRINUSE") {
      throw new AppError("ADDRESS_IN_USE", `Preview address ${bind} is already in use. Stop the existing preview or choose another port with --bind.`);
    }
    throw error;
  }
  const address=server.address();
  const port=typeof address==="object"&&address?address.port:Number(match[2]);
  const listenUrl=`http://${match[1]}:${port}`;
  for(const host of ["localhost","127.0.0.1"]){
    allowedHosts.add(`${host}:${port}`);allowedOrigins.add(`http://${host}:${port}`);
  }
  return {url:publicUrl?.origin??listenUrl,listenUrl,close:()=>new Promise<void>(resolve=>{server.close(()=>resolve());server.closeAllConnections();})};
}
