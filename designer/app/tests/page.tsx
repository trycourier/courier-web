'use client';

import { Suspense, useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CourierAuth, COURIER_TESTS_USER_ID_STORAGE_KEY } from '@/components/CourierAuth';
import {
  buildTestsPageQuery,
  canonicalTestsQueryString,
  parseTestsPageQuery,
} from '@/app/lib/tests-page-url';
import {
  CourierTestsTab,
  TEST_ENV_LABELS,
  type TestApiEnvironment,
  type TestsSharedFieldValues,
} from '@/components/CourierTestsTab';
import { getPresetApiUrls } from '@/app/lib/api-urls';
import {
  ArrowLeft as ArrowLeftBase,
  Loader2 as Loader2Base,
  Menu as MenuBase,
  Play as PlayBase,
  X as XBase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ArrowLeft = ArrowLeftBase as React.ComponentType<any>;
const Loader2 = Loader2Base as React.ComponentType<any>;
const Menu = MenuBase as React.ComponentType<any>;
const Play = PlayBase as React.ComponentType<any>;
const X = XBase as React.ComponentType<any>;

/** Matches inbox-demo left panel initial width; not resizable on this page. */
const TESTS_LEFT_PANEL_WIDTH_PX = 400;

function SessionFormBootstrap({
  authUserId,
  setSessionForm,
}: {
  authUserId: string;
  setSessionForm: React.Dispatch<React.SetStateAction<TestsSharedFieldValues>>;
}) {
  const synced = useRef(false);
  useEffect(() => {
    if (!authUserId || synced.current) return;
    setSessionForm((prev) => {
      if (prev.userId.trim()) {
        synced.current = true;
        return prev;
      }
      synced.current = true;
      return { ...prev, userId: authUserId };
    });
  }, [authUserId, setSessionForm]);
  return null;
}

type TestsSessionFieldsProps = {
  sessionForm: TestsSharedFieldValues;
  updateSessionField: <K extends keyof TestsSharedFieldValues>(key: K, value: TestsSharedFieldValues[K]) => void;
  onSaveSession: () => void;
  testEnv: TestApiEnvironment;
  onTestEnvChange: (env: TestApiEnvironment) => void;
};

function TestsSessionFields({
  sessionForm,
  updateSessionField,
  onSaveSession,
  testEnv,
  onTestEnvChange,
}: TestsSessionFieldsProps) {
  const uid = useId();
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor={`${uid}-api-environment`} className="text-xs text-muted-foreground">
              API environment
            </Label>
            <Select value={testEnv} onValueChange={(v) => onTestEnvChange(v as TestApiEnvironment)}>
              <SelectTrigger id={`${uid}-api-environment`} className="w-full font-mono text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(TEST_ENV_LABELS) as TestApiEnvironment[]).map((env) => (
                  <SelectItem key={env} value={env} className="text-sm">
                    {TEST_ENV_LABELS[env]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${uid}-api-key`} className="text-xs text-muted-foreground">
              API key
            </Label>
            <Input
              id={`${uid}-api-key`}
              className="font-mono text-sm"
              placeholder="Backend default if empty"
              value={sessionForm.apiKey}
              onChange={(e) => updateSessionField('apiKey', e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${uid}-user-id`} className="text-xs text-muted-foreground">
              User ID
            </Label>
            <Input
              id={`${uid}-user-id`}
              className="font-mono text-sm"
              value={sessionForm.userId}
              onChange={(e) => updateSessionField('userId', e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${uid}-brand`} className="text-xs text-muted-foreground">
              Brand ID
            </Label>
            <Input
              id={`${uid}-brand`}
              className="font-mono text-sm"
              value={sessionForm.brandId}
              onChange={(e) => updateSessionField('brandId', e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${uid}-topic`} className="text-xs text-muted-foreground">
              Topic ID
            </Label>
            <Input
              id={`${uid}-topic`}
              className="font-mono text-sm"
              value={sessionForm.topicId}
              onChange={(e) => updateSessionField('topicId', e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${uid}-client-key`} className="text-xs text-muted-foreground">
              Client key
            </Label>
            <Input
              id={`${uid}-client-key`}
              className="font-mono text-sm"
              value={sessionForm.clientKey}
              onChange={(e) => updateSessionField('clientKey', e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${uid}-expires`} className="text-xs text-muted-foreground">
              JWT expires in
            </Label>
            <Input
              id={`${uid}-expires`}
              className="font-mono text-sm"
              placeholder="7d"
              value={sessionForm.expiresIn}
              onChange={(e) => updateSessionField('expiresIn', e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${uid}-list`} className="text-xs text-muted-foreground">
              List ID
            </Label>
            <Input
              id={`${uid}-list`}
              className="font-mono text-sm"
              value={sessionForm.listId}
              onChange={(e) => updateSessionField('listId', e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${uid}-pagination`} className="text-xs text-muted-foreground">
              Pagination limit
            </Label>
            <Input
              id={`${uid}-pagination`}
              type="number"
              min={1}
              className="font-mono text-sm"
              value={Number.isFinite(sessionForm.paginationLimit) ? sessionForm.paginationLimit : 10}
              onChange={(e) => {
                const n = Number(e.target.value);
                updateSessionField('paginationLimit', Number.isFinite(n) ? n : 10);
              }}
            />
          </div>
        </div>
      </div>
      <div className="shrink-0 border-t border-border bg-background p-3">
        <Button type="button" variant="secondary" size="sm" className="w-full" onClick={onSaveSession}>
          Save to session and inputs
        </Button>
      </div>
    </div>
  );
}

function TestsPageContent() {
  const backHref = '/';
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialParsedRef = useRef<ReturnType<typeof parseTestsPageQuery> | null>(null);
  if (initialParsedRef.current === null) {
    initialParsedRef.current = parseTestsPageQuery(new URLSearchParams(searchParams.toString()));
  }

  const lastWrittenQueryRef = useRef<string | null>(null);

  const runAllRef = useRef<(() => Promise<void>) | null>(null);
  const applySharedRef = useRef<((values: TestsSharedFieldValues) => void) | null>(null);
  const [controlsReady, setControlsReady] = useState(false);
  const [batchRunning, setBatchRunning] = useState(false);
  const [testEnv, setTestEnv] = useState<TestApiEnvironment>(() => initialParsedRef.current!.env);
  const [sessionForm, setSessionForm] = useState<TestsSharedFieldValues>(() => initialParsedRef.current!.form);
  const [sessionCommitted, setSessionCommitted] = useState<TestsSharedFieldValues>(() => ({
    ...initialParsedRef.current!.form,
  }));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const urlCanon = canonicalTestsQueryString(searchParams);

    if (lastWrittenQueryRef.current === null) {
      lastWrittenQueryRef.current = urlCanon;
      return;
    }

    if (urlCanon === lastWrittenQueryRef.current) {
      return;
    }

    const parsed = parseTestsPageQuery(searchParams);
    setSessionForm(parsed.form);
    setTestEnv(parsed.env);
    setSessionCommitted(parsed.form);
    lastWrittenQueryRef.current = urlCanon;
  }, [searchParams]);

  useEffect(() => {
    const built = buildTestsPageQuery(sessionForm, testEnv);
    const builtCanon = canonicalTestsQueryString(built);
    const urlCanon = canonicalTestsQueryString(searchParams);

    if (builtCanon === urlCanon) {
      lastWrittenQueryRef.current = builtCanon;
      return;
    }

    lastWrittenQueryRef.current = builtCanon;
    const qs = built.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [sessionForm, testEnv, pathname, router, searchParams]);

  const handleRunControlsReady = useCallback((controls: { runAllTests: () => Promise<void> }) => {
    runAllRef.current = controls.runAllTests;
    setControlsReady(true);
  }, []);

  const handleRegisterApplyShared = useCallback((fn: (values: TestsSharedFieldValues) => void) => {
    applySharedRef.current = fn;
  }, []);

  const handleRunAll = useCallback(() => {
    runAllRef.current?.();
  }, []);

  const handleSaveSession = useCallback(() => {
    setSessionCommitted({ ...sessionForm });
    applySharedRef.current?.(sessionForm);
    setIsMobileMenuOpen(false);
  }, [sessionForm]);

  const updateSessionField = useCallback(<K extends keyof TestsSharedFieldValues>(key: K, value: TestsSharedFieldValues[K]) => {
    setSessionForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const sessionFieldsProps: TestsSessionFieldsProps = {
    sessionForm,
    updateSessionField,
    onSaveSession: handleSaveSession,
    testEnv,
    onTestEnvChange: setTestEnv,
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-background text-foreground">
      <header className="flex h-[73px] shrink-0 items-center justify-between gap-4 border-b border-border px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href={backHref}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <a
            href="https://www.courier.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center hover:opacity-80 transition-opacity"
            aria-label="Courier Home"
          >
            <svg
              width="90"
              height="22"
              viewBox="0 0 90 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#7B2668] dark:text-foreground"
            >
              <path
                d="M18.9841 9.07718C19.0254 9.01314 19.0481 8.93888 19.0496 8.8627C18.269 4.39927 14.3255 1.00825 9.60004 1.00825C4.29109 1.00825 -0.0213001 5.30065 7.91505e-05 10.5792C0.0428376 15.7082 4.39868 19.9999 9.55659 19.9999C13.9559 20.0206 17.6614 17.1033 18.8103 13.133C18.8538 13.0041 18.7669 12.8537 18.6365 12.7896L18.2469 12.6392C17.4871 12.3731 16.6768 12.2832 15.8772 12.3761C15.0776 12.4691 14.3095 12.7425 13.6311 13.1758C13.0021 13.5834 12.5469 13.9054 12.5469 13.9054C11.7676 14.4206 10.8138 14.742 9.81659 14.742C7.10763 14.742 5.22212 12.5537 4.91868 9.89235L4.70351 8.43442C4.63868 7.98339 4.33523 7.61857 3.90144 7.44684L3.36006 7.23236C3.27317 7.1896 3.22972 7.08202 3.29524 6.9965C5.61385 3.92755 8.45245 4.59306 8.45245 4.59306C8.91209 4.63792 9.35243 4.80038 9.73107 5.06478C10.2304 5.41465 10.621 5.8982 10.858 6.45995C11.3018 7.46309 12.0277 8.31559 12.9472 8.91371C13.8667 9.51183 14.9403 9.82979 16.0372 9.8289C16.0372 9.8289 18.2476 9.91511 18.9841 9.07718Z"
                fill="currentColor"
              />
              <path
                d="M5.8945 6.78135C5.96819 6.78171 6.04123 6.76754 6.10944 6.73966C6.17765 6.71177 6.23969 6.67072 6.29202 6.61884C6.34435 6.56695 6.38594 6.50527 6.41441 6.4373C6.44288 6.36933 6.45768 6.29642 6.45795 6.22273C6.45703 6.07415 6.39718 5.932 6.29153 5.82752C6.18589 5.72303 6.04309 5.66476 5.8945 5.66549C5.82087 5.66513 5.74789 5.67927 5.67972 5.70711C5.61156 5.73496 5.54955 5.77595 5.49723 5.82776C5.4449 5.87957 5.4033 5.94118 5.37479 6.00906C5.34628 6.07695 5.33142 6.14979 5.33105 6.22342C5.33105 6.531 5.58347 6.78135 5.8945 6.78135ZM33.8723 13.0468C33.8723 16.9096 30.9034 19.8068 27.0241 19.8068C23.1455 19.8068 20.1979 16.931 20.1979 13.0468C20.1979 9.11996 23.1455 6.22342 27.0241 6.22342C30.9254 6.22342 33.8723 9.14134 33.8723 13.0468ZM24.4241 13.0468C24.4241 14.5917 25.551 15.7296 27.0461 15.7296C28.5634 15.7296 29.6903 14.5917 29.6903 13.0468C29.6903 11.4593 28.5634 10.3006 27.0461 10.3006C25.551 10.3006 24.4241 11.4593 24.4241 13.0468ZM47.9805 13.6268C47.9805 17.3392 45.3805 19.8061 41.6957 19.8061C37.9902 19.8061 35.3247 17.1889 35.3247 13.4765V6.48066H39.5937V13.4758C39.5937 14.8489 40.3957 15.7289 41.6743 15.7289C42.9095 15.7289 43.733 14.8489 43.733 13.4758V6.48066H47.9812L47.9805 13.6268ZM58.5563 6.37307V10.2358C58.0798 10.1503 57.6246 10.0855 57.1908 10.0855C55.3922 10.0855 53.9619 11.0082 53.9619 13.4979V19.5275H49.6929V6.48066H53.9619V7.85376C54.7419 6.82411 55.8688 6.2448 57.2998 6.2448C57.6894 6.2448 58.1012 6.30894 58.5563 6.37307ZM64.8846 2.51033C64.8846 3.88412 63.7356 5.04274 62.3487 5.04274C60.9618 5.04274 59.7915 3.88412 59.7915 2.51102C59.7915 1.15862 60.9618 0 62.3487 0C63.7356 0 64.8846 1.15862 64.8846 2.51033ZM64.4508 6.48066V19.5275H60.1818V6.48066H64.4508ZM79.2307 14.0986H69.8252C70.1508 15.4503 71.2776 16.2875 72.7294 16.2875C74.008 16.2875 74.7445 15.751 74.9183 15.0427H79.1224C78.7107 17.9185 76.2404 19.7854 72.8597 19.7854C68.9584 19.7854 65.9032 16.8027 65.9032 12.9613C65.9032 9.14134 68.8935 6.20135 72.7728 6.20135C76.3487 6.20135 79.3176 9.01306 79.3176 12.5751C79.339 12.9399 79.2742 13.6261 79.2307 14.0986ZM74.8535 11.4379C74.7445 10.3862 73.7266 9.65651 72.5776 9.65651C71.4073 9.65651 70.4756 10.1931 70.0204 11.4379H74.8535ZM89.6548 6.37307V10.2358C89.1783 10.1503 88.7231 10.0855 88.2893 10.0855C86.4907 10.0855 85.0603 11.0082 85.0603 13.4979V19.5275H80.7914V6.48066H85.0603V7.85376C85.8403 6.82411 86.9672 6.2448 88.3976 6.2448C88.8093 6.2448 89.2217 6.30894 89.6548 6.37307Z"
                fill="currentColor"
              />
            </svg>
          </a>
          <span className="hidden text-sm font-medium text-muted-foreground sm:inline">/</span>
          <h1 className="hidden truncate text-sm font-semibold sm:block">Tests</h1>
        </div>

        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="mr-1 h-4 w-4" />
            Settings
          </Button>
          {isMobileMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-[9998] bg-black/50 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-hidden
              />
              <div className="fixed inset-0 z-[9999] flex flex-col bg-background lg:hidden">
                <div className="absolute right-0 top-0 z-10 p-4">
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden pt-16">
                  <TestsSessionFields {...sessionFieldsProps} />
                </div>
              </div>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            disabled={!controlsReady || batchRunning}
            onClick={handleRunAll}
            className="shrink-0 gap-1.5"
          >
            {batchRunning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <Play className="h-3.5 w-3.5" aria-hidden />
            )}
            <span className="hidden sm:inline">{batchRunning ? 'Running all…' : 'Run all'}</span>
            <span className="sm:hidden">Run</span>
          </Button>
        </div>
      </header>

      <CourierAuth
        skipJwtInitialization
        userIdStorageKey={COURIER_TESTS_USER_ID_STORAGE_KEY}
        apiUrls={getPresetApiUrls(testEnv)}
        apiKey={sessionCommitted.apiKey.trim() || undefined}
        overrideUserId={sessionCommitted.userId.trim() || undefined}
      >
        {({ userId }) => (
          <div className="flex min-h-0 flex-1 overflow-hidden">
            <SessionFormBootstrap authUserId={userId} setSessionForm={setSessionForm} />

            <div
              className="hidden min-h-0 w-[400px] min-w-[400px] max-w-[400px] flex-shrink-0 flex-col overflow-hidden border-r border-border bg-muted/15 lg:flex"
              style={{
                width: TESTS_LEFT_PANEL_WIDTH_PX,
                minWidth: TESTS_LEFT_PANEL_WIDTH_PX,
                maxWidth: TESTS_LEFT_PANEL_WIDTH_PX,
              }}
            >
              <TestsSessionFields {...sessionFieldsProps} />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="mx-auto max-w-5xl">
                <CourierTestsTab
                  authUserId={userId}
                  sharedFieldValues={sessionCommitted}
                  apiEnvironment={testEnv}
                  onRunControlsReady={handleRunControlsReady}
                  onBatchRunningChange={setBatchRunning}
                  onRegisterApplySharedDefaults={handleRegisterApplyShared}
                />
              </div>
            </div>
          </div>
        )}
      </CourierAuth>
    </div>
  );
}

export default function TestsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
          Loading...
        </div>
      }
    >
      <TestsPageContent />
    </Suspense>
  );
}
