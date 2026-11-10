import React, { useEffect, useRef, useState } from "react";
import { shellCommand } from "../src/cli-preview";

export function CliPreview({
  args,
  status,
  note,
  collapsed = false,
}: {
  args: string[] | null;
  status?: string;
  note?: string;
  collapsed?: boolean;
}) {
  const command = args ? shellCommand(args) : "";
  const [copied, setCopied] = useState("");
  const latest = useRef(0);
  useEffect(() => {
    latest.current++;
    setCopied("");
    return () => {
      latest.current++;
    };
  }, [command]);
  async function copy() {
    const request = ++latest.current;
    try {
      await navigator.clipboard.writeText(command);
      if (request === latest.current) setCopied("Copied");
    } catch {
      if (request === latest.current)
        setCopied("Could not copy. Select the command and copy manually.");
    }
  }
  return (
    <details className="source cli-preview" open={!collapsed}>
      <summary>CLI command</summary>
      {command ? (
        <>
          <pre>
            <code>{command}</code>
          </pre>
          <div className="form-actions">
            <button
              type="button"
              className="quiet"
              onClick={() => void copy()}
              aria-label="Copy CLI command"
            >
              Copy
            </button>
            <span role="status">{copied}</span>
          </div>
          {note && <p className="field-hint">{note}</p>}
        </>
      ) : (
        <p className="field-hint" role="status">
          {status || "Complete the inputs to preview the command."}
        </p>
      )}
    </details>
  );
}
