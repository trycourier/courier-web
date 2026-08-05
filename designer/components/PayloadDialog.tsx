'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { JsonBlock } from './JsonBlock';

export interface PayloadSection {
  /** e.g. "Message", "Action" */
  label: string;
  data: unknown;
}

export interface PayloadDialogRequest {
  title: string;
  description?: string;
  sections: PayloadSection[];
}

interface PayloadDialogContextValue {
  showPayload: (request: PayloadDialogRequest) => void;
}

const PayloadDialogContext = React.createContext<PayloadDialogContextValue | undefined>(undefined);

const DEFAULT_DESCRIPTION = 'The payload the SDK passed to the click handler.';

/**
 * Hosts the dialog the previews use to show event payloads. Anything a demo
 * would otherwise `alert()` goes here instead, rendered as formatted JSON.
 */
export function PayloadDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  // Kept when the dialog closes so the exit animation still has content to render.
  const [request, setRequest] = React.useState<PayloadDialogRequest | null>(null);

  const showPayload = React.useCallback((next: PayloadDialogRequest) => {
    setRequest(next);
    setOpen(true);
  }, []);

  const value = React.useMemo(() => ({ showPayload }), [showPayload]);

  return (
    <PayloadDialogContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{request?.title ?? ''}</DialogTitle>
            <DialogDescription>{request?.description ?? DEFAULT_DESCRIPTION}</DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
            {request?.sections.map((section) => (
              <JsonBlock key={section.label} label={section.label} value={section.data} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </PayloadDialogContext.Provider>
  );
}

export function usePayloadDialog() {
  const context = React.useContext(PayloadDialogContext);
  if (context === undefined) {
    throw new Error('usePayloadDialog must be used within a PayloadDialogProvider');
  }
  return context;
}
