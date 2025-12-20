'use client';

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
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

export default function Home() {
  const [activeLeftTab, setActiveLeftTab] = useState<LeftTab>('send-test');
  const [activeRightTab, setActiveRightTab] = useState<RightTab>('courier-inbox');
  const [feeds, setFeeds] = useState<CourierInboxFeed[]>(defaultFeeds());
  const [selectedTheme, setSelectedTheme] = useState<ThemePreset>('default');
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
    <div className="flex h-screen w-screen flex-col bg-white dark:bg-black">
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
          >
            Courier Inbox Docs
          </a>
        </Button>
      </header>

      {/* Main Content: Left and Right Panels */}
      <CourierAuth>
        {({ userId, onClearUser }) => (
          <div className="flex flex-1 overflow-hidden">
            {/* Left Panel */}
            <div
              className="border-r border-border flex-shrink-0"
              style={{ width: `${leftPanelWidth}px`, minWidth: `${initialWidth}px` }}
            >
              <Tabs
                value={activeLeftTab}
                onValueChange={(tabId: string) => setActiveLeftTab(tabId as LeftTab)}
                className="flex flex-col h-full"
              >
                <div className="flex justify-center p-4 border-b border-border">
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
            <div className="flex-1 overflow-hidden">
              <Tabs
                value={activeRightTab}
                onValueChange={(tabId: string) => setActiveRightTab(tabId as RightTab)}
                className="flex flex-col h-full"
              >
                <div className="flex justify-center p-4 border-b border-border">
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
