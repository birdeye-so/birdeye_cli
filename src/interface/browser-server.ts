import {createServer} from "node:http";
import {readFile} from "node:fs/promises";
import {AppError} from "../shared.js";
import {workflowCatalog} from "../workflows/registry.js";
import {skillForPath} from "../skill-routes.js";
export async function startBrowserInterface(bind="127.0.0.1:3000", publicUrlInput?:string) {
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
    const url=new URL(req.url||"/","http://localhost"),path=url.pathname;
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
