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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getInstallCommand());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex items-center gap-2 pr-1 pl-3 py-1 text-sm bg-gray-100 dark:bg-muted border border-border rounded-md">
      <code className="font-mono">
        {getInstallCommand()}
      </code>
      <button
        onClick={handleCopy}
        className="p-1 hover:bg-gray-200 dark:hover:bg-muted-foreground/20 rounded transition-colors"
        aria-label="Copy command"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

