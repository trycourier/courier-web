'use client';

import * as React from 'react';
import { useState, type SVGProps } from 'react';
import { Copy as CopyBase, Check as CheckBase } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Copy = CopyBase as React.ComponentType<SVGProps<SVGSVGElement>>;
const Check = CheckBase as React.ComponentType<SVGProps<SVGSVGElement>>;

interface CopyFieldButtonProps {
  value: string;
  /** Used for `aria-label`, e.g. "API key" → "Copy API key" */
  label: string;
  className?: string;
}

export function CopyFieldButton({ value, label, className }: CopyFieldButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      className={className}
      onClick={handleCopy}
      disabled={!value}
      aria-label={`Copy ${label}`}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}
