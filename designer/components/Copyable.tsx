'use client';

import * as React from 'react';
import { Copy as CopyBase, Check as CheckBase } from 'lucide-react';
import { cn } from '@/lib/utils';

const Copy = CopyBase as React.ComponentType<any>;
const Check = CheckBase as React.ComponentType<any>;

export interface CopyableProps {
  /** String written to the clipboard when the control is activated. */
  value: string;
  children?: React.ReactNode;
  className?: string;
  /** Classes for the main text region (padding and icon column are unchanged). */
  contentClassName?: string;
}

export function Copyable({ value, children, className, contentClassName }: CopyableProps) {
  const [copied, setCopied] = React.useState(false);

  const handleClick = async () => {
    if (!value.trim()) {
      return;
    }
    try {
      await navigator.clipboard.writeText(value.trim());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3500);
    } catch (err) {
      console.error('Copyable copy failed:', err);
    }
  };

  const title = value.trim() || undefined;

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={!value.trim()}
      title={title}
      className={cn(
        'flex h-9 w-full min-w-0 flex-1 cursor-pointer items-center rounded-md bg-muted/20 text-left transition-colors',
        'hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
    >
      <span
        className={cn(
          'min-w-0 flex-1 truncate px-4 font-mono text-sm text-foreground',
          contentClassName,
        )}
      >
        {children ?? value}
      </span>
      <span
        className="flex shrink-0 items-center px-3 text-muted-foreground"
        aria-hidden
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </span>
    </button>
  );
}
