import React,{useEffect,useRef,useState} from "react";
import {BrowserVault,emptyWorkspace} from "./vault";
import {BrowserRuntime,setRuntime} from "./runtime";
export const browserStorage = true;
export function StorageGate({children}:{children:React.ReactNode}) {
  const [exists,setExists]=useState<boolean|null>(null),[password,setPassword]=useState(""),[confirm,setConfirm]=useState(""),[ready,setReady]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(""),[forget,setForget]=useState(false);
  const runtime=useRef<BrowserRuntime|null>(null),release=useRef<(()=>void)|null>(null),locking=useRef(false);
  useEffect(()=>{void BrowserVault.exists().then(setExists).catch(()=>setError("Persistent storage is unavailable. You can use a temporary session."));},[]);
  async function acquire() {
    if(!navigator.locks)throw new Error("This browser needs Web Locks support for safe encrypted storage. Use a temporary session.");
    await new Promise<void>((resolve,reject)=>{
      void navigator.locks.request("birdeye-workspace",{ifAvailable:true},lock=>{
        if(!lock){reject(new Error("This workspace is open in another tab. Lock or close that tab first."));return;}
        return new Promise<void>(done=>{release.current=done;resolve();});
      }).catch(reject);
    });
  }
  async function open(persistent:boolean) {
    setBusy(true);setError("");
    try{
      if(!isSecureContext)throw new Error("Open this demo over HTTPS or localhost before entering API keys.");
      let vault:BrowserVault|null=null,data=emptyWorkspace();
      if(persistent){
        if(!exists && password!==confirm)throw new Error("Passwords do not match.");
        await acquire();vault=new BrowserVault();data=await vault.open(password,!exists);
      }
      runtime.current=new BrowserRuntime(data,vault);setRuntime(runtime.current);
      setPassword("");setConfirm("");setReady(true);setForget(false);
    }catch(e){release.current?.();release.current=null;setError((e as Error).message);}
    finally{setBusy(false);}
  }
  async function lock() {
    if(locking.current)return;locking.current=true;
    setReady(false);setBusy(true);
    try{await runtime.current?.close();}catch{setError("Some data could not be saved before locking.");}
    finally{runtime.current=null;setRuntime(null);release.current?.();release.current=null;setExists(await BrowserVault.exists().catch(()=>false));setBusy(false);locking.current=false;}
  }
  useEffect(()=>{
    if(!ready)return;
    let timer:ReturnType<typeof setTimeout>;
    const reset=()=>{clearTimeout(timer);timer=setTimeout(()=>void lock(),15*60*1000);};
    reset();for(const name of ["pointerdown","keydown"])window.addEventListener(name,reset);
    const hidden=()=>{if(document.hidden){clearTimeout(timer);timer=setTimeout(()=>void lock(),60*1000);}else reset();};
    document.addEventListener("visibilitychange",hidden);
    const unload=()=>{void lock();};
    window.addEventListener("pagehide",unload);
    return ()=>{clearTimeout(timer);for(const name of ["pointerdown","keydown"])window.removeEventListener(name,reset);document.removeEventListener("visibilitychange",hidden);window.removeEventListener("pagehide",unload);};
  },[ready]);
  async function erase() {
    setBusy(true);setError("");
    try{await acquire();await BrowserVault.erase();setExists(false);setForget(false);setPassword("");setConfirm("");}
    catch(e){setError((e as Error).message);}
    finally{release.current?.();release.current=null;setBusy(false);}
  }
  if(ready)return <><div className="browser-storage-bar"><span>{runtime.current?.persistent?"Encrypted browser workspace":"Temporary browser session"} · requests go directly to your providers</span><button type="button" onClick={()=>void lock()}>Lock workspace</button></div>{children}</>;
  return <main className="browser-vault console-app"><section aria-labelledby="vault-title">
    <h1 id="vault-title">Your browser workspace</h1>
    <p>Keep your API keys and research in this browser. This website has no workspace backend.</p>
    <form onSubmit={e=>{e.preventDefault();void open(true);}}>
      <h2>{exists?"Unlock saved workspace":"Create encrypted workspace"}</h2>
      <label htmlFor="vault-password">Workspace password</label>
      <input id="vault-password" type="password" autoComplete={exists?"current-password":"new-password"} value={password} onChange={e=>setPassword(e.target.value)} required minLength={exists?1:12} disabled={busy}/>
      {!exists&&<><label htmlFor="vault-confirm">Confirm password</label><input id="vault-confirm" type="password" autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)} required disabled={busy}/><p className="field-hint">At least 12 characters. There is no password recovery. Clearing site data deletes your workspace.</p></>}
      {error&&<p role="alert" className="notice error">{error}</p>}
      <button className="primary" disabled={busy||exists===null}>{busy?"Please wait…":exists?"Unlock workspace":"Create workspace"}</button>
    </form>
    <button type="button" className="quiet" disabled={busy} onClick={()=>void open(false)}>Use temporary session</button>
    <p className="field-hint">Temporary sessions keep keys and results in memory until you lock, reload or close this tab.</p>
    <p className="field-hint">Encryption protects saved data while locked. It cannot protect unlocked keys from malicious extensions or compromised page scripts. Keys are sent only to the providers you configure.</p>
    {exists&&<button type="button" className="quiet" disabled={busy} onClick={()=>setForget(!forget)}>Forget saved workspace</button>}
    {forget&&<div role="group" aria-label="Confirm workspace deletion"><p>Delete all saved keys, reports and usage from this browser? This cannot be undone.</p><button type="button" disabled={busy} onClick={()=>void erase()}>Delete browser data</button><button type="button" onClick={()=>setForget(false)}>Cancel</button></div>}
  </section></main>;
}
