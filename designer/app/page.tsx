'use client';

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Copy, Check, ExternalLink } from "lucide-react";
import { CourierAuth } from "@/components/CourierAuth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SendTestTab } from "@/components/SendTestTab";
import { ThemeTab } from "@/components/ThemeTab";
import { CurrentUserTab } from "@/components/CurrentUserTab";
import { FeedsTab } from "@/components/FeedsTab";
import { CourierInboxTab } from "@/components/CourierInboxTab";
import { CourierInboxPopupMenuTab } from "@/components/CourierInboxPopupMenuTab";
import { CourierInboxHooks } from "@/components/CourierInboxHooks";
import { defaultFeeds, type CourierInboxFeed } from '@trycourier/courier-react';
import { themePresets, type ThemePreset } from '@/components/theme-presets';

type LeftTab = 'send-test' | 'theme' | 'current-user' | 'feeds';
type RightTab = 'courier-inbox' | 'courier-inbox-popup-menu' | 'courier-inbox-hooks';
type FrameworkType = 'react' | 'web-components';

export default function Home() {
  const [activeLeftTab, setActiveLeftTab] = useState<LeftTab>('send-test');
  const [activeRightTab, setActiveRightTab] = useState<RightTab>('courier-inbox');
  const [feeds, setFeeds] = useState<CourierInboxFeed[]>(defaultFeeds());
  const [selectedTheme, setSelectedTheme] = useState<ThemePreset>('default');
  const [frameworkType, setFrameworkType] = useState<FrameworkType>('react');
  const [leftPanelWidth, setLeftPanelWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [copied, setCopied] = useState(false);
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
    <div className="flex h-screen w-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="p-4 border-b border-border flex items-center justify-between px-4">
        <Image
          src="/vercel.svg"
          alt="Vercel Logo"
          width={40}
          height={40}
          className="dark:invert"
        />
        <Button
          asChild
          variant="outline"
          size="sm"
        >
          <a
            href="https://www.courier.com/docs/platform/inbox/inbox-overview"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            Courier Inbox Docs
            {React.createElement(ExternalLink as any, { className: "h-4 w-4" })}
          </a>
        </Button>
      </header>

      {/* Main Content: Left and Right Panels */}
      <CourierAuth>
        {({ userId, onClearUser }) => (
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
                <div className="flex items-center justify-center p-4 border-b border-border h-[73px]">
                  <TabsList>
                    <TabsTrigger value="send-test">Test</TabsTrigger>
                    <TabsTrigger value="theme">Theme</TabsTrigger>
                    <TabsTrigger value="feeds">Feeds</TabsTrigger>
                    <TabsTrigger value="current-user">User</TabsTrigger>
                  </TabsList>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="send-test" className="h-full mt-0">
                    <SendTestTab userId={userId} />
                  </TabsContent>
                  <TabsContent value="theme" className="h-full mt-0">
                    <ThemeTab selectedTheme={selectedTheme} onThemeChange={setSelectedTheme} />
                  </TabsContent>
                  <TabsContent value="feeds" className="h-full mt-0">
                    <FeedsTab feeds={feeds} onFeedsChange={setFeeds} />
                  </TabsContent>
                  <TabsContent value="current-user" className="h-full mt-0">
                    <CurrentUserTab userId={userId} onClearUser={onClearUser} />
                  </TabsContent>
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
                <div className="flex items-center justify-between p-4 border-b border-border h-[73px]">
                  <TabsList>
                    <TabsTrigger value="courier-inbox">Inbox</TabsTrigger>
                    <TabsTrigger value="courier-inbox-popup-menu">Popup</TabsTrigger>
                    <TabsTrigger value="courier-inbox-hooks">Hooks</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 border border-border rounded-md">
                      <code className="font-mono">
                        {getInstallCommand()}
                      </code>
                      <button
                        onClick={handleCopy}
                        className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                        aria-label="Copy command"
                      >
                        {copied ? (
                          React.createElement(Check as any, { className: "h-4 w-4 text-green-600 dark:text-green-400" })
                        ) : (
                          React.createElement(Copy as any, { className: "h-4 w-4" })
                        )}
                      </button>
                    </div>
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
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="courier-inbox" className="h-full mt-0">
                    <CourierInboxTab
                      feeds={feeds}
                      lightTheme={themePresets[selectedTheme].light}
                      darkTheme={themePresets[selectedTheme].dark}
                    />
                  </TabsContent>
                  <TabsContent value="courier-inbox-popup-menu" className="h-full mt-0">
                    <CourierInboxPopupMenuTab
                      feeds={feeds}
                      lightTheme={themePresets[selectedTheme].light}
                      darkTheme={themePresets[selectedTheme].dark}
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
