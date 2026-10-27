import {createServer} from "node:http";
import {readFile} from "node:fs/promises";
import {AppError} from "../shared.js";
export async function startBrowserInterface(bind="127.0.0.1:3000") {
  const match=/^(127\.0\.0\.1|localhost):([0-9]+)$/.exec(bind);
  if(!match || Number(match[2])>65535)throw new AppError("INVALID_BIND","Browser preview supports localhost or 127.0.0.1. Deploy dist/browser to an HTTPS static host for public access.");
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
    const host=req.headers.host?.split(":")[0];
    if(!["localhost","127.0.0.1"].includes(host||"")){res.writeHead(403);res.end();return;}
    const path=new URL(req.url||"/","http://localhost").pathname,asset=assets[path];
    if(req.method!=="GET"||!asset){res.writeHead(404);res.end("Not found");return;}
    try{
      const body=await readFile(new URL("../browser/"+asset[0],import.meta.url));
      res.writeHead(200,{"Content-Type":asset[1]});res.end(body);
    }catch{res.writeHead(500);res.end("Browser build unavailable. Run npm run build.");}
  });
  await new Promise<void>((resolve,reject)=>{server.once("error",reject);server.listen(Number(match[2]),match[1],()=>resolve());});
  const address=server.address();
  return {url:`http://${match[1]}:${typeof address==="object"&&address?address.port:match[2]}`,close:()=>new Promise<void>(resolve=>{server.close(()=>resolve());server.closeAllConnections();})};
}
