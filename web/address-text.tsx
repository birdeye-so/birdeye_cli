import React, {createContext, useContext, useEffect, useMemo, useRef, useState} from "react";
import {addressParts, copyAddress} from "./address-detection";

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

export function AddressText({text, compact = false}: {text: string; compact?: boolean}) {
  const {copy} = useContext(CopyContext);
  const parts = useMemo(() => addressParts(text), [text]);
  return <>{parts.map((part, index) => part.encoding
    ? <button key={index} type="button" className="copy-address" data-address={part.text}
        title={`Click to copy ${part.encoding}: ${part.text}`} aria-label={`Copy ${part.encoding} address ${part.text}`}
        onClick={() => copy(part.text)}>{compact ? `${part.text.slice(0, 6)}…${part.text.slice(-6)}` : part.text}</button>
    : <React.Fragment key={index}>{part.text}</React.Fragment>)}</>;
}
