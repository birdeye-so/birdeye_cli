"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { catalogSchema, type Catalog } from "./catalog";
export function useCatalog(
  initial: Catalog | undefined,
  url: string | undefined,
  interval: number,
) {
  const [catalog, setCatalog] = useState(initial);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    initial ? "ready" : "loading",
  );
  const revision = useRef(initial?.revision);
  const active = useRef<AbortController | null>(null);
  const refresh = useCallback(async () => {
    if (!url || active.current) return;
    const controller = new AbortController();
    active.current = controller;
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(url, {
        cache: "no-store",
        signal: controller.signal,
        headers: revision.current
          ? { "If-None-Match": `"${revision.current}"` }
          : {},
      });
      if (response.status !== 304) {
        if (!response.ok) throw new Error("Catalog unavailable");
        const next = catalogSchema.parse(await response.json());
        if (revision.current !== next.revision) {
          setCatalog(next);
          revision.current = next.revision;
        }
      }
      setStatus("ready");
    } catch {
      setStatus("error");
    } finally {
      clearTimeout(timeout);
      active.current = null;
    }
  }, [url]);
  useEffect(() => {
    void refresh();
    const onFocus = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    const timer = setInterval(onFocus, Math.max(1000, interval));
    document.addEventListener("visibilitychange", onFocus);
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(timer);
      active.current?.abort();
      document.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh, interval]);
  return { catalog, status, refresh };
}
