'use client';

import * as React from 'react';
import { useState } from 'react';
import { Copy as CopyBase, Check as CheckBase } from 'lucide-react';
import { useFramework } from './FrameworkContext';

// Cast to any to work around React 19 type incompatibility with lucide-react
const Copy = CopyBase as React.ComponentType<any>;
const Check = CheckBase as React.ComponentType<any>;

export function InstallCommandCopy() {
  const { frameworkType } = useFramework();
  const [copied, setCopied] = useState(false);

  const getInstallCommand = () => {
    return frameworkType === 'react'
      ? 'npm i @trycourier/courier-react'
      : 'npm i @trycourier/courier-ui-inbox';
  };

  const displayCommand = getInstallCommand();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 3500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      title={displayCommand}
      className="flex min-h-9 w-full min-w-0 cursor-pointer items-start gap-2 rounded-md bg-gray-100 px-4 py-2 text-right text-sm transition-colors hover:bg-gray-200/90 dark:bg-muted dark:hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={copied ? 'Copied to clipboard' : 'Copy install command'}
    >
      <code className="min-w-0 flex-1 [overflow-wrap:anywhere] whitespace-pre-wrap break-words text-right font-mono leading-snug">
        {displayCommand}
      </code>
      <span className="flex shrink-0 items-center pt-0.5 text-muted-foreground" aria-hidden>
        {copied ? (
          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </span>
    </button>
  );
}

