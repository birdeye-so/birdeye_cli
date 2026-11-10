import React, { useMemo } from "react";
import { marked, type Token, type Tokens } from "marked";
import { decodeHTML } from "entities";
import { AddressText } from "./address-text";

function safeLink(value: string): string | undefined {
  const href = decodeHTML(value).trim();
  try {
    const url = new URL(href);
    if (["https:", "http:", "mailto:"].includes(url.protocol)) return url.href;
  } catch {
    /* Relative paths are not routes in the research interface. */
  }
}

// Render lexer tokens as React elements: model output never becomes raw HTML.
// Link labels and code blocks stay plain text so interactive elements cannot nest.
function renderTokens(tokens: Token[], addresses = true): React.ReactNode {
  return tokens.map((token, index) => {
    const children = () =>
      renderTokens("tokens" in token ? token.tokens || [] : [], addresses);
    let node: React.ReactNode;
    switch (token.type) {
      case "space":
      case "def":
        return null;
      case "heading":
        node = React.createElement(
          `h${Math.min(token.depth + 2, 6)}`,
          null,
          children(),
        );
        break;
      case "paragraph":
        node = <p>{children()}</p>;
        break;
      case "strong":
        node = <strong>{children()}</strong>;
        break;
      case "em":
        node = <em>{children()}</em>;
        break;
      case "del":
        node = <del>{children()}</del>;
        break;
      case "br":
        node = <br />;
        break;
      case "hr":
        node = <hr />;
        break;
      case "blockquote":
        node = <blockquote>{children()}</blockquote>;
        break;
      case "code":
        node = (
          <pre tabIndex={0} aria-label="Code block">
            <code>{token.text}</code>
          </pre>
        );
        break;
      case "codespan":
        node = (
          <code>
            {addresses ? <AddressText text={token.text} /> : token.text}
          </code>
        );
        break;
      case "list": {
        const items = token.items.map((item: Tokens.ListItem, i: number) => (
          <li key={i} className={item.task ? "markdown-task" : undefined}>
            {renderTokens(item.tokens, addresses)}
          </li>
        ));
        node = token.ordered ? (
          <ol start={Number(token.start) || 1}>{items}</ol>
        ) : (
          <ul>{items}</ul>
        );
        break;
      }
      case "checkbox":
        node = (
          <input
            type="checkbox"
            checked={token.checked}
            disabled
            aria-label={token.checked ? "Completed item" : "Incomplete item"}
          />
        );
        break;
      case "table":
        node = (
          <div
            className="markdown-table"
            role="region"
            aria-label="Table in AI response"
            tabIndex={0}
          >
            <table>
              <thead>
                <tr>
                  {token.header.map((cell: Tokens.TableCell, i: number) => (
                    <th
                      key={i}
                      scope="col"
                      style={{ textAlign: cell.align || undefined }}
                    >
                      {renderTokens(cell.tokens, addresses)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {token.rows.map((row: Tokens.TableCell[], i: number) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        style={{ textAlign: cell.align || undefined }}
                      >
                        {renderTokens(cell.tokens, addresses)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        break;
      case "link":
      case "image": {
        const href = safeLink(token.href);
        const label =
          token.type === "image"
            ? decodeHTML(token.text || "Image")
            : renderTokens(token.tokens || [], false);
        node = href ? (
          <a
            href={href}
            title={token.title ? decodeHTML(token.title) : undefined}
            target="_blank"
            rel="noopener noreferrer"
          >
            {label}
          </a>
        ) : (
          label
        );
        break;
      }
      case "html":
        node = token.text;
        break;
      case "text":
      case "escape": {
        const text =
          token.type === "escape" ? token.text : decodeHTML(token.text);
        node =
          "tokens" in token && token.tokens ? (
            children()
          ) : addresses ? (
            <AddressText text={text} />
          ) : (
            text
          );
        break;
      }
      default:
        node = token.raw;
    }
    return <React.Fragment key={index}>{node}</React.Fragment>;
  });
}

export function MarkdownText({ text }: { text: string }) {
  const content = useMemo(() => {
    try {
      return renderTokens(marked.lexer(text, { gfm: true, breaks: true }));
    } catch {
      return (
        <p>
          <AddressText text={text} />
        </p>
      );
    }
  }, [text]);
  return <div className="markdown-body">{content}</div>;
}
