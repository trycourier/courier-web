'use client';

import { useState, useRef, useEffect } from "react";
import { CourierAuth } from "./components/CourierAuth";
import { Tabs } from "./components/Tabs";
import { SendTestTab } from "./components/SendTestTab";
import { ThemeTab } from "./components/ThemeTab";
import { CurrentUserTab } from "./components/CurrentUserTab";
import { FeedsTab } from "./components/FeedsTab";
import { CourierInboxTab } from "./components/CourierInboxTab";
import { CourierInboxPopupMenuTab } from "./components/CourierInboxPopupMenuTab";
import { CourierInboxHooks } from "./components/CourierInboxHooks";
import { defaultFeeds, type CourierInboxFeed } from '@trycourier/courier-react';
import { themePresets, type ThemePreset } from './components/theme-presets';

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
      <header className="p-4 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Courier Designer
        </h1>
      </header>

      {/* Main Content: Left and Right Panels */}
      <CourierAuth>
        {({ userId, onClearUser }) => (
          <div className="flex flex-1 overflow-hidden">
            {/* Left Panel */}
            <div
              className="border-r border-gray-300 dark:border-gray-700 flex-shrink-0"
              style={{ width: `${leftPanelWidth}px`, minWidth: `${initialWidth}px` }}
            >
              <Tabs
                tabs={[
                  { id: 'send-test', label: 'Send Test' },
                  { id: 'theme', label: 'Theme' },
                  { id: 'feeds', label: 'Feeds' },
                  { id: 'current-user', label: 'User' },
                ]}
                activeTab={activeLeftTab}
                onTabChange={(tabId) => setActiveLeftTab(tabId as LeftTab)}
              >
                {activeLeftTab === 'send-test' && (
                  <SendTestTab userId={userId} />
                )}
                {activeLeftTab === 'theme' && (
                  <ThemeTab selectedTheme={selectedTheme} onThemeChange={setSelectedTheme} />
                )}
                {activeLeftTab === 'current-user' && (
                  <CurrentUserTab userId={userId} onClearUser={onClearUser} />
                )}
                {activeLeftTab === 'feeds' && (
                  <FeedsTab feeds={feeds} onFeedsChange={setFeeds} />
                )}
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
                tabs={[
                  { id: 'courier-inbox', label: 'Inbox' },
                  { id: 'courier-inbox-popup-menu', label: 'Popup' },
                  { id: 'courier-inbox-hooks', label: 'Hooks' },
                ]}
                activeTab={activeRightTab}
                onTabChange={(tabId) => setActiveRightTab(tabId as RightTab)}
              >
                {activeRightTab === 'courier-inbox' && (
                  <CourierInboxTab feeds={feeds} theme={themePresets[selectedTheme]} />
                )}
                {activeRightTab === 'courier-inbox-popup-menu' && (
                  <CourierInboxPopupMenuTab feeds={feeds} theme={themePresets[selectedTheme]} />
                )}
                {activeRightTab === 'courier-inbox-hooks' && (
                  <CourierInboxHooks feeds={feeds} />
                )}
              </Tabs>
            </div>
          </div>
        )}
      </CourierAuth>
    </div>
  );
}
