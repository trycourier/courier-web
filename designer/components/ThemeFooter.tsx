'use client';

import { Button } from '@/components/ui/button';
import { useFramework } from './FrameworkContext';
import { ExternalLink } from 'lucide-react';

interface ThemeFooterProps {
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

export function ThemeFooter({ 
  copy = "Customize fonts, colors, spacing, animations, and more through the theme system.",
  primaryButton,
  secondaryButton
}: ThemeFooterProps) {
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

