import React, { useEffect, useRef, useState } from "react";
import { SkillIcon } from "./skill-icon";
import { skillsInCategory } from "./skill-categories";
type Data = Record<string, any>;
function useRailDisclosure(storageKey?: string) {
  const [preference, setPreference] = useState<boolean | null>(() => {
    try {
      const saved = storageKey ? localStorage.getItem(storageKey) : null;
      return saved === "open" ? true : saved === "closed" ? false : null;
    } catch {
      return null;
    }
  });
  const [open, setOpen] = useState(
    () =>
      preference ??
      (typeof window === "undefined" ||
        window.matchMedia("(min-width: 651px)").matches),
  );
  useEffect(() => {
    const query = window.matchMedia("(min-width: 651px)");
    const change = () => {
      if (preference === null) setOpen(query.matches);
    };
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, [preference]);
  return {
    open,
    onToggle: (event: React.SyntheticEvent<HTMLDetailsElement>) => {
      const next = event.currentTarget.open;
      setOpen(next);
      // Native toggle also fires on initial render; only save a user's change.
      if (storageKey && next !== open) {
        setPreference(next);
        try {
          localStorage.setItem(storageKey, next ? "open" : "closed");
        } catch {
          /* Storage can be disabled; toggling still works. */
        }
      }
    },
  };
}
export function SkillList({
  cases,
  group,
  selected,
  choose,
}: {
  cases: Data[];
  group: string;
  selected: string;
  choose: (kind: string) => void;
}) {
  const visible = skillsInCategory(cases, group);
  const disclosure = useRailDisclosure("birdeye.skills.disclosure");
  return (
    <details className="skill-rail" {...disclosure}>
      <summary
        className="skill-toggle"
        aria-label={disclosure.open ? "Collapse skills" : "Expand skills"}
        title={disclosure.open ? "Collapse skills" : "Expand skills"}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m15 6-6 6 6 6" />
        </svg>
        <span className="skill-label">Skills</span>
        <span className="skill-count">{visible.length}</span>
      </summary>
      <nav aria-label="Skills">
        {visible.map((c) => (
          <button
            type="button"
            key={c.kind}
            className={`skill-card ${selected === c.kind ? "selected" : ""}`}
            aria-current={selected === c.kind ? "true" : undefined}
            aria-label={c.title}
            onClick={() => choose(c.kind)}
          >
            <SkillIcon kind={c.kind} />
            <strong>{c.title}</strong>
          </button>
        ))}
      </nav>
    </details>
  );
}

function HistoryDeleteIcon({ all = false }: { all?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {all ? (
        <path d="M3 6h18M3 12h8M3 18h8m5-4 5 6m0-6-5 6" />
      ) : (
        <>
          <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" />
        </>
      )}
    </svg>
  );
}

export function RunHistory({
  runs,
  selected,
  choose,
  clear,
  more,
  loading,
  remove,
  busy,
}: {
  runs: Data[];
  selected?: string;
  choose: (id: string) => void;
  clear: () => void;
  more?: () => void;
  loading?: boolean;
  remove: (id?: string) => Promise<void>;
  busy?: boolean;
}) {
  const disclosure = useRailDisclosure("birdeye.history.disclosure");
  const [pending, setPending] = useState<{ id?: string; title: string } | null>(
      null,
    ),
    [deleting, setDeleting] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const newRun = useRef<HTMLButtonElement>(null),
    trigger = useRef<HTMLButtonElement | null>(null);
  const locked = !!busy || !!loading || deleting;
  function confirm(
    event: React.MouseEvent<HTMLButtonElement>,
    target: { id?: string; title: string },
  ) {
    trigger.current = event.currentTarget;
    setPending(target);
    setError("");
    setMessage("");
  }
  async function erase() {
    if (!pending || locked) return;
    setDeleting(true);
    setError("");
    try {
      await remove(pending.id);
      setMessage(pending.id ? "Run deleted." : "History cleared.");
      setPending(null);
      newRun.current?.focus();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not delete history. Try again.",
      );
    } finally {
      setDeleting(false);
    }
  }
  return (
    <details className="history-rail" aria-label="Run history" {...disclosure}>
      <summary
        className="history-toggle"
        aria-label={disclosure.open ? "Collapse history" : "Expand history"}
        title={disclosure.open ? "Collapse history" : "Expand history"}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m9 6 6 6-6 6" />
        </svg>
        <span className="history-label">History</span>
        <span className="history-count">{runs.length}</span>
      </summary>
      <div className="history-heading">
        <button ref={newRun} type="button" className="quiet" onClick={clear}>
          New run
        </button>
        <button
          type="button"
          className="icon-button history-delete"
          aria-label="Clear history"
          title="Clear history"
          disabled={locked || !runs.length}
          onClick={(e) => confirm(e, { title: "all saved runs" })}
        >
          <HistoryDeleteIcon all />
        </button>
      </div>
      {pending && (
        <div
          className="history-confirm"
          role="group"
          aria-label="Confirm history deletion"
        >
          <p>Delete {pending.title}?</p>
          <p className="field-hint">
            {pending.id
              ? "Removes this saved result and chat turn. Other runs may retain copies of its data."
              : "Removes every saved result and chat turn, including older pages."}{" "}
            Cannot be undone. CU usage and settings are kept.
          </p>
          <div className="history-heading">
            <button
              type="button"
              className="quiet history-delete"
              autoFocus
              disabled={locked}
              onClick={() => void erase()}
            >
              {deleting
                ? "Deleting…"
                : pending.id
                  ? "Delete run"
                  : "Delete all runs"}
            </button>
            <button
              type="button"
              className="quiet"
              disabled={deleting}
              onClick={() => {
                setPending(null);
                setError("");
                trigger.current?.focus();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {error && (
        <p className="notice error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="field-hint" role="status">
          {message}
        </p>
      )}
      {runs.length ? (
        runs.map((r) => (
          <div className="history-row" key={r.id}>
            <button
              type="button"
              className={`history-item ${selected === r.id ? "current" : ""}`}
              aria-current={selected === r.id ? "true" : undefined}
              disabled={deleting}
              onClick={() => choose(r.id)}
            >
              <strong>{r.title}</strong>
              <small>
                {r.status} · {new Date(r.createdAt).toLocaleString()}
              </small>
            </button>
            <button
              type="button"
              className="icon-button history-delete"
              aria-label={`Delete ${r.title}`}
              title={`Delete ${r.title}`}
              disabled={locked}
              onClick={(e) => confirm(e, { id: r.id, title: r.title })}
            >
              <HistoryDeleteIcon />
            </button>
          </div>
        ))
      ) : (
        <p className="history-empty">
          No saved runs. Choose a skill and run research to see its results
          here.
        </p>
      )}
      {more && (
        <button
          type="button"
          className="quiet"
          disabled={loading || deleting}
          onClick={more}
        >
          {loading ? "Loading…" : "Load older runs"}
        </button>
      )}
    </details>
  );
}

export function plainResult(result: Data) {
  const data = result.data || {},
    cu = result.meta?.cu || {};
  return [
    data.kind?.replace(/^skill-/, ""),
    `Status: ${data.status || result.meta?.coverage || "unknown"}`,
    `CU: ${cu.estimated ?? 0} estimated · ${cu.budgetUsed ?? 0} reserved · ${cu.uncertainAttempts ?? 0} uncertain`,
    data.answer,
    ...(data.metrics || []).map((m: Data) =>
      Object.entries(m)
        .filter(([k]) => !["sourceId", "chain", "asOf"].includes(k))
        .map(([k, v]) => `${k}: ${v ?? "unavailable"}`)
        .join(" | "),
    ),
    ...(data.skillAnalysis?.findings || []).map((f: Data) =>
      JSON.stringify(f, null, 2),
    ),
    ...(data.missing || []).map(
      (m: Data) =>
        `Missing: ${m.operation || m.step} — ${m.message || m.reason}`,
    ),
    ...(result.meta?.warnings || []).map((w: string) => `Note: ${w}`),
  ]
    .filter(Boolean)
    .join("\n\n");
}
