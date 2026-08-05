'use client';

import * as React from 'react';
import { CopyFieldButton } from './CopyFieldButton';
import { cn } from '@/lib/utils';

/** Replaces the values `JSON.stringify` refuses to encode, so it can't throw. */
function encodableValue(seen: WeakSet<object>) {
  return (_key: string, value: unknown) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  };
}

/**
 * Pretty-prints a value for display. Payloads from the SDK are plain JSON, but a
 * demo tool shouldn't render `[object Object]` (or throw) for one that isn't.
 */
export function formatJson(value: unknown): string {
  let json: string | undefined;
  try {
    json = JSON.stringify(value, null, 2);
  } catch {
    json = JSON.stringify(value, encodableValue(new WeakSet()), 2);
  }
  // `undefined`, functions and symbols stringify to `undefined`.
  return json ?? String(value);
}

// A quoted string (optionally followed by the `:` that makes it a key), a
// keyword, or a number. Everything else — braces, brackets, commas — is
// punctuation and stays unstyled.
const JSON_TOKEN = /("(?:\\.|[^"\\])*")(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;

const KEY_CLASS = 'text-sky-700 dark:text-sky-300';
const STRING_CLASS = 'text-emerald-700 dark:text-emerald-300';
const KEYWORD_CLASS = 'text-purple-700 dark:text-purple-300';
const NUMBER_CLASS = 'text-amber-700 dark:text-amber-300';

function highlightJson(json: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  for (const match of json.matchAll(JSON_TOKEN)) {
    const [text, quoted, colon] = match;
    const start = match.index ?? 0;

    if (start > cursor) {
      nodes.push(json.slice(cursor, start));
    }
    cursor = start + text.length;

    if (quoted) {
      nodes.push(
        <span key={start} className={colon ? KEY_CLASS : STRING_CLASS}>
          {quoted}
        </span>,
      );
      if (colon) {
        nodes.push(colon);
      }
      continue;
    }

    const isKeyword = text === 'true' || text === 'false' || text === 'null';
    nodes.push(
      <span key={start} className={isKeyword ? KEYWORD_CLASS : NUMBER_CLASS}>
        {text}
      </span>,
    );
  }

  if (cursor < json.length) {
    nodes.push(json.slice(cursor));
  }

  return nodes;
}

export interface JsonBlockProps {
  value: unknown;
  /** Shown above the block, alongside a copy button. */
  label?: string;
  className?: string;
}

/** A read-only, syntax-highlighted JSON view of a value. */
export function JsonBlock({ value, label, className }: JsonBlockProps) {
  const json = React.useMemo(() => formatJson(value), [value]);

  return (
    <div className={cn('min-w-0 space-y-1.5', className)}>
      {label && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <CopyFieldButton value={json} label={`${label} JSON`} />
        </div>
      )}
      <pre className="overflow-x-auto rounded-md border bg-muted/40 p-3 font-mono text-xs leading-relaxed text-muted-foreground">
        <code>{highlightJson(json)}</code>
      </pre>
    </div>
  );
}
