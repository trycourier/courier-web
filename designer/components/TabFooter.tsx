'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useFramework } from './FrameworkContext';
import { ExternalLink as ExternalLinkBase } from 'lucide-react';

// Cast to any to work around React 19 type incompatibility with lucide-react
const ExternalLink = ExternalLinkBase as React.ComponentType<any>;

interface TabFooterProps {
  copy?: string;
  primaryButton?: {
    label: string;
    url: string;
  };
  secondaryButton?: {
    label: string;
    url: string;
  };
}

export function TabFooter({
  copy = "Customize fonts, colors, spacing, animations, and more through the theme system.",
  primaryButton,
  secondaryButton
}: TabFooterProps) {
  const { frameworkType } = useFramework();

  // Default URLs based on framework type if not provided
  const defaultPrimaryUrl = frameworkType === 'react'
    ? 'https://www.courier.com/docs/sdk-libraries/courier-react-web#authentication'
    : 'https://www.courier.com/docs/sdk-libraries/courier-ui-inbox-web#authentication';

  const defaultPrimaryLabel = frameworkType === 'react' ? 'React Docs' : 'Web Components Docs';

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        <p className="mb-3">
          {copy}
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {primaryButton && (
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a
              href={primaryButton.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              {primaryButton.label}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
        {secondaryButton && (
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a
              href={secondaryButton.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              {secondaryButton.label}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
        {!primaryButton && !secondaryButton && (
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a
              href={defaultPrimaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              {defaultPrimaryLabel}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

