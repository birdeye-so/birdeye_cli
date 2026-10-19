import React, {createContext, useContext, useEffect, useMemo, useRef, useState} from "react";
import {addressParts, copyAddress} from "./address-detection";
import {birdeyeAddressUrl, type AddressKind} from "./birdeye-address";

const ChainContext = createContext("solana");
export function AddressChainProvider({chain, children}: {chain?: string; children: React.ReactNode}) {
  return <ChainContext.Provider value={chain ?? "solana"}>{children}</ChainContext.Provider>;
}

type Notice = {message: string; failed: boolean; value: string} | null;
const CopyContext = createContext<{copy: (value: string) => void; dismiss: () => void; notice: Notice}>({copy: () => {}, dismiss: () => {}, notice: null});

export function AddressCopyProvider({children}: {children: React.ReactNode}) {
  const [notice, setNotice] = useState<Notice>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latest = useRef(0);
  useEffect(() => () => { latest.current++; clearTimeout(timer.current); }, []);
  function dismiss() { latest.current++; clearTimeout(timer.current); setNotice(null); }
  async function copy(value: string) {
    const request = ++latest.current;
    clearTimeout(timer.current);
    setNotice(null);
    let failed = false;
    try { await copyAddress(value); } catch { failed = true; }
    if (request !== latest.current) return;
    setNotice({failed, value, message: failed ? "Could not copy. Select the full address below and copy it manually." : `Copied ${value.slice(0, 6)}…${value.slice(-6)}`});
    if (!failed) timer.current = setTimeout(() => setNotice(null), 3000);
  }
  return <CopyContext.Provider value={{copy, dismiss, notice}}>{children}</CopyContext.Provider>;
}

export function AddressCopyNotice() {
  const {notice, dismiss} = useContext(CopyContext);
  return <div className={`copy-notice${notice ? " visible" : ""}${notice?.failed ? " failed" : ""}`}>
    <div role="status" aria-live="polite" aria-atomic="true">{notice?.message}{notice?.failed && <code className="copy-fallback">{notice.value}</code>}</div>
    {notice?.failed && <button type="button" className="quiet" onClick={dismiss}>Dismiss copy message</button>}
  </div>;
}

export function AddressText({text, compact = false, kind, chain}: {text: string; compact?: boolean; kind?: AddressKind; chain?: string}) {
  const {copy} = useContext(CopyContext);
  const inheritedChain = useContext(ChainContext);
  const parts = useMemo(() => addressParts(text), [text]);
  return <>{parts.map((part, index) => {
    if (!part.encoding) return <React.Fragment key={index}>{part.text}</React.Fragment>;
    const href = kind ? birdeyeAddressUrl(part.text, kind, chain ?? inheritedChain) : undefined;
    return <span key={index} className="address-actions"><button type="button" className="copy-address" data-address={part.text}
        title={`Click to copy ${part.encoding}: ${part.text}`} aria-label={`Copy ${part.encoding} address ${part.text}`}
        onClick={event => { event.stopPropagation(); copy(part.text); }}>{compact ? `${part.text.slice(0, 6)}…${part.text.slice(-6)}` : part.text}</button>{href && <a
          className="address-explore" href={href} target="_blank" rel="noopener noreferrer"
          title={`Open ${kind} on Birdeye (new tab)`} aria-label={`Open ${kind} ${part.text} on Birdeye (new tab)`}
          onClick={event => event.stopPropagation()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3h7v7m0-7L10 14M10 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6"/></svg>
        </a>}</span>;
  })}</>;
}
