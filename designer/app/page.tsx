'use client';

import React, { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { CourierAuth } from "@/components/CourierAuth";
import { FrameworkProvider, useFramework } from "@/components/FrameworkContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SendTestTab } from "@/components/SendTestTab";
import { ThemeTab, type ColorMode } from "@/components/ThemeTab";
import { CurrentUserTab } from "@/components/CurrentUserTab";
import { FeedsTab } from "@/components/FeedsTab";
import { AdvancedTab, type ApiUrls, DEFAULT_API_URLS } from "@/components/AdvancedTab";
import { CourierInboxTab } from "@/components/CourierInboxTab";
import { CourierInboxPopupMenuTab } from "@/components/CourierInboxPopupMenuTab";
import { CourierInboxHooks } from "@/components/CourierInboxHooks";
import { InstallCommandCopy } from "@/components/InstallCommandCopy";
import { Button } from "@/components/ui/button";
import { defaultFeeds, type CourierInboxFeed } from '@trycourier/courier-react';
import { themePresets, type ThemePreset } from '@/components/theme-presets';
import { ExternalLink as ExternalLinkBase } from 'lucide-react';

// Cast to any to work around React 19 type incompatibility with lucide-react
const ExternalLink = ExternalLinkBase as React.ComponentType<any>;

type LeftTab = 'send-test' | 'theme' | 'current-user' | 'feeds' | 'advanced';
type RightTab = 'courier-inbox' | 'courier-inbox-popup-menu' | 'courier-inbox-hooks';

const VALID_LEFT_TABS: LeftTab[] = ['send-test', 'theme', 'current-user', 'feeds', 'advanced'];
const VALID_RIGHT_TABS: RightTab[] = ['courier-inbox', 'courier-inbox-popup-menu', 'courier-inbox-hooks'];
const DEFAULT_LEFT_TAB: LeftTab = 'send-test';
const DEFAULT_RIGHT_TAB: RightTab = 'courier-inbox';

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize tabs from URL or defaults
  const getInitialLeftTab = useCallback((): LeftTab => {
    const param = searchParams.get('tab');
    if (param && VALID_LEFT_TABS.includes(param as LeftTab)) {
      return param as LeftTab;
    }
    return DEFAULT_LEFT_TAB;
  }, [searchParams]);

  const getInitialRightTab = useCallback((): RightTab => {
    const param = searchParams.get('layout');
    if (param && VALID_RIGHT_TABS.includes(param as RightTab)) {
      return param as RightTab;
    }
    return DEFAULT_RIGHT_TAB;
  }, [searchParams]);

  const [activeLeftTab, setActiveLeftTabState] = useState<LeftTab>(getInitialLeftTab);
  const [activeRightTab, setActiveRightTabState] = useState<RightTab>(getInitialRightTab);
  const [feeds, setFeeds] = useState<CourierInboxFeed[]>(defaultFeeds());
  const [selectedTheme, setSelectedTheme] = useState<ThemePreset>('default');
  const [colorMode, setColorMode] = useState<ColorMode>('system');
  const { frameworkType, setFrameworkType } = useFramework();

  // Sync colorMode state from localStorage after hydration
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      setColorMode('dark');
    } else if (stored === 'light') {
      setColorMode('light');
    }
    // If no stored preference, keep 'system' default
  }, []);

  // Check if advanced mode is enabled
  const isAdvancedMode = searchParams.get('advanced') === 'true';

  // Get API URLs from query params
  const apiUrls: ApiUrls = {
    courier: {
      rest: searchParams.get('courierRest') || DEFAULT_API_URLS.courier.rest,
      graphql: searchParams.get('courierGraphql') || DEFAULT_API_URLS.courier.graphql,
    },
    inbox: {
      graphql: searchParams.get('inboxGraphql') || DEFAULT_API_URLS.inbox.graphql,
      webSocket: searchParams.get('inboxWebSocket') || DEFAULT_API_URLS.inbox.webSocket,
    },
  };

  // Check if any custom API URLs are set
  const hasCustomApiUrls =
    apiUrls.courier.rest !== DEFAULT_API_URLS.courier.rest ||
    apiUrls.courier.graphql !== DEFAULT_API_URLS.courier.graphql ||
    apiUrls.inbox.graphql !== DEFAULT_API_URLS.inbox.graphql ||
    apiUrls.inbox.webSocket !== DEFAULT_API_URLS.inbox.webSocket;

  // Get userId override from query params
  const overrideUserId = searchParams.get('userId') || undefined;

  // Get apiKey override from query params
  const overrideApiKey = searchParams.get('apiKey') || undefined;

  // Helper to update URL params
  const updateUrlParams = useCallback((key: string, value: string, defaultValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === defaultValue) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [searchParams, pathname, router]);

  // Wrapper functions that update both state and URL
  const setActiveLeftTab = useCallback((tab: LeftTab) => {
    setActiveLeftTabState(tab);
    updateUrlParams('tab', tab, DEFAULT_LEFT_TAB);
  }, [updateUrlParams]);

  const setActiveRightTab = useCallback((tab: RightTab) => {
    setActiveRightTabState(tab);
    updateUrlParams('layout', tab, DEFAULT_RIGHT_TAB);
  }, [updateUrlParams]);

  // Apply color mode to the page
  useEffect(() => {
    function applyColorMode(mode: ColorMode) {
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else if (mode === 'light') {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        // system mode - remove stored preference and check system
        localStorage.removeItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }

    applyColorMode(colorMode);

    // Listen for system theme changes when in system mode
    if (colorMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [colorMode]);
  const [leftPanelWidth, setLeftPanelWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const initialWidth = 400; // Initial panel width

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      const minWidth = initialWidth;
      const maxWidth = window.innerWidth - 200; // Leave some space for right panel

      setLeftPanelWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="p-4 border-b border-border flex items-center justify-between px-4 gap-4">
        <a
          href="https://www.courier.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center hover:opacity-80 transition-opacity"
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
        <div className="flex items-center gap-2 ml-auto">
          <InstallCommandCopy />
          <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
            <button
              onClick={() => setFrameworkType('react')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${frameworkType === 'react'
                ? 'bg-background text-foreground shadow'
                : ''
                }`}
            >
              React
            </button>
            <button
              onClick={() => setFrameworkType('web-components')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${frameworkType === 'web-components'
                ? 'bg-background text-foreground shadow'
                : ''
                }`}
            >
              Web Components
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a
              href={frameworkType === 'react'
                ? 'https://www.courier.com/docs/sdk-libraries/courier-react-web'
                : 'https://www.courier.com/docs/sdk-libraries/courier-ui-inbox-web'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Docs
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </header>

      {/* Main Content: Left and Right Panels */}
      <CourierAuth apiUrls={hasCustomApiUrls ? apiUrls : undefined} overrideUserId={overrideUserId} apiKey={overrideApiKey}>
        {({ userId, onClearUser, isUrlOverride }) => (
          <div className="flex flex-1 overflow-hidden">
            {/* Left Panel */}
            <div
              className="border-r border-border flex-shrink-0 bg-background"
              style={{ width: `${leftPanelWidth}px`, minWidth: `${initialWidth}px` }}
            >
              <Tabs
                value={activeLeftTab}
                onValueChange={(tabId: string) => setActiveLeftTab(tabId as LeftTab)}
                className="flex flex-col h-full"
              >
                <div className="flex items-center justify-center p-4 border-b border-border h-[73px] flex-shrink-0">
                  <TabsList>
                    <TabsTrigger value="send-test">Test</TabsTrigger>
                    <TabsTrigger value="theme">Theme</TabsTrigger>
                    <TabsTrigger value="feeds">Feeds</TabsTrigger>
                    <TabsTrigger value="current-user">User</TabsTrigger>
                    {isAdvancedMode && <TabsTrigger value="advanced">Advanced</TabsTrigger>}
                  </TabsList>
                </div>
                <div className="flex-1 flex flex-col min-h-0">
                  <TabsContent value="send-test" className="mt-0 flex-1 min-h-0">
                    <SendTestTab userId={userId} apiKey={overrideApiKey} />
                  </TabsContent>
                  <TabsContent value="theme" className="mt-0 flex-1 min-h-0">
                    <ThemeTab
                      selectedTheme={selectedTheme}
                      onThemeChange={setSelectedTheme}
                      colorMode={colorMode}
                      onColorModeChange={setColorMode}
                    />
                  </TabsContent>
                  <TabsContent value="feeds" className="mt-0 flex-1 min-h-0">
                    <FeedsTab feeds={feeds} onFeedsChange={setFeeds} />
                  </TabsContent>
                  <TabsContent value="current-user" className="mt-0 flex-1 min-h-0">
                    <CurrentUserTab userId={userId} onClearUser={onClearUser} isUrlOverride={isUrlOverride} />
                  </TabsContent>
                  {isAdvancedMode && (
                    <TabsContent value="advanced" className="mt-0 flex-1 min-h-0">
                      <AdvancedTab apiUrls={apiUrls} />
                    </TabsContent>
                  )}
                </div>
              </Tabs>
            </div>

            {/* Resize Handle */}
            <div
              ref={resizeRef}
              onMouseDown={handleMouseDown}
              className={`w-1 bg-gray-300 dark:bg-gray-700 cursor-col-resize hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors flex-shrink-0 ${isResizing ? 'bg-gray-400 dark:bg-gray-600' : ''
                }`}
            />

            {/* Right Panel */}
            <div className="flex-1 overflow-hidden bg-background">
              <Tabs
                value={activeRightTab}
                onValueChange={(tabId: string) => setActiveRightTab(tabId as RightTab)}
                className="flex flex-col h-full"
              >
                <div className="flex items-center justify-center p-4 border-b border-border h-[73px]">
                  <TabsList>
                    <TabsTrigger value="courier-inbox">Inbox</TabsTrigger>
                    <TabsTrigger value="courier-inbox-popup-menu">Popup</TabsTrigger>
                    <TabsTrigger value="courier-inbox-hooks">Hooks</TabsTrigger>
                  </TabsList>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="courier-inbox" className="h-full mt-0">
                    <CourierInboxTab
                      feeds={feeds}
                      lightTheme={themePresets[selectedTheme].light}
                      darkTheme={themePresets[selectedTheme].dark}
                      colorMode={colorMode}
                    />
                  </TabsContent>
                  <TabsContent value="courier-inbox-popup-menu" className="h-full mt-0">
                    <CourierInboxPopupMenuTab
                      feeds={feeds}
                      lightTheme={themePresets[selectedTheme].light}
                      darkTheme={themePresets[selectedTheme].dark}
                      colorMode={colorMode}
                    />
                  </TabsContent>
                  <TabsContent value="courier-inbox-hooks" className="h-full mt-0">
                    <CourierInboxHooks feeds={feeds} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        )}
      </CourierAuth>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">Loading...</div>}>
      <FrameworkProvider>
        <HomeContent />
      </FrameworkProvider>
    </Suspense>
  );
}
