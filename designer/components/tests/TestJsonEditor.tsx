'use client';

import { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { EditorView } from '@codemirror/view';
import { cn } from '@/lib/utils';

/** CodeMirror theme using designer globals.css variables — follows light/dark with the rest of the app. */
const courierJsonEditorTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'var(--muted)',
      color: 'var(--foreground)',
    },
    '.cm-scroller': {
      backgroundColor: 'var(--muted)',
      fontFamily: 'var(--font-geist-mono, ui-monospace, monospace)',
    },
    '.cm-content': {
      caretColor: 'var(--foreground)',
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: 'var(--foreground)',
    },
    '.cm-gutters': {
      backgroundColor: 'var(--muted)',
      color: 'var(--muted-foreground)',
      borderRight: '1px solid var(--border)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'var(--cm-selection)',
    },
    '.cm-activeLine': {
      backgroundColor: 'var(--cm-selection)',
    },
    '&.cm-focused .cm-selectionBackground, & .cm-selectionBackground, & .cm-content ::selection': {
      backgroundColor: 'var(--cm-selection) !important',
    },
    '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground': {
      backgroundColor: 'var(--cm-selection) !important',
    },
    '.cm-foldPlaceholder': {
      backgroundColor: 'var(--secondary)',
      border: '1px solid var(--border)',
      color: 'var(--muted-foreground)',
    },
  },
  { dark: false },
);

const courierJsonHighlight = HighlightStyle.define([
  { tag: t.propertyName, color: 'var(--primary)' },
  { tag: t.string, color: 'var(--chart-2)' },
  { tag: t.number, color: 'var(--chart-3)' },
  { tag: t.bool, color: 'var(--chart-4)' },
  { tag: t.null, color: 'var(--muted-foreground)' },
  { tag: t.keyword, color: 'var(--chart-1)' },
  { tag: [t.bracket, t.punctuation], color: 'var(--muted-foreground)' },
]);

export interface TestJsonEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  minHeight?: string;
}

export function TestJsonEditor({
  value,
  onChange,
  readOnly = false,
  disabled = false,
  className,
  minHeight = 'min-h-[200px]',
}: TestJsonEditorProps) {
  const extensions = useMemo(
    () => [json(), courierJsonEditorTheme, syntaxHighlighting(courierJsonHighlight)],
    [],
  );

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[inherit] border border-border bg-muted text-xs font-mono text-foreground',
        minHeight,
        disabled && 'pointer-events-none opacity-60',
        className,
      )}
    >
      <CodeMirror
        value={value}
        height="200px"
        theme="none"
        extensions={extensions}
        editable={!disabled}
        readOnly={readOnly || disabled}
        basicSetup={{ lineNumbers: true, foldGutter: true }}
        onChange={readOnly || disabled ? undefined : onChange}
        className="font-mono text-xs [&_.cm-editor]:min-h-[200px] [&_.cm-scroller]:font-mono"
      />
    </div>
  );
}
