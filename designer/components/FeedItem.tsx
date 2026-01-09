'use client';

import * as React from 'react';
import type { CourierInboxFeed } from '@trycourier/courier-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ChevronDownIcon as ChevronDownIconBase } from 'lucide-react';

// Cast to any to work around React 19 type incompatibility with lucide-react
const ChevronDownIcon = ChevronDownIconBase as React.ComponentType<any>;

interface FeedItemProps {
  feed: CourierInboxFeed;
  feedIndex: number;
  onUpdateFeed: (updates: Partial<CourierInboxFeed>) => void;
  onRemoveFeed: () => void;
  onAddTab: () => void;
  onUpdateTab: (tabIndex: number, updates: Partial<CourierInboxFeed['tabs'][0]>) => void;
  onRemoveTab: (tabIndex: number) => void;
}

export function FeedItem({
  feed,
  feedIndex,
  onUpdateFeed,
  onRemoveFeed,
  onAddTab,
  onUpdateTab,
  onRemoveTab,
}: FeedItemProps) {
  return (
    <AccordionItem key={feed.feedId} value={`feed-${feedIndex}`}>
      <div className="flex items-center px-2 hover:bg-gray-50 dark:hover:bg-neutral-900 rounded-md my-1">
        <div className="relative flex-1 self-stretch flex items-stretch w-full overflow-hidden">
          <AccordionTrigger className="flex relative hover:no-underline group [&>svg]:hidden flex-1 items-center w-full">
            <div className="flex flex-1 items-center w-full gap-2">
              <ChevronDownIcon className="text-muted-foreground size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              <span className="font-medium truncate flex-1 text-left min-w-0">{feed.title || feed.feedId}</span>
            </div>
          </AccordionTrigger>
        </div>
        <Button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemoveFeed();
          }}
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive shrink-0 my-2"
        >
          Remove
        </Button>
      </div>
      <AccordionContent>
        <div className="border rounded-md p-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Feed ID</Label>
            <Input
              type="text"
              value={feed.feedId}
              onChange={(e) => onUpdateFeed({ feedId: e.target.value })}
              className="text-sm font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Title</Label>
            <Input
              type="text"
              value={feed.title}
              onChange={(e) => onUpdateFeed({ title: e.target.value })}
              className="text-sm font-mono"
            />
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Tabs</Label>
              <Button
                type="button"
                onClick={onAddTab}
                size="sm"
                variant="outline"
              >
                + Add Tab
              </Button>
            </div>

            <div className="space-y-2">
              {feed.tabs.map((tab, tabIndex) => (
                <div key={tab.datasetId} className="p-3 border rounded-md bg-muted/50 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Dataset ID</Label>
                      <Input
                        type="text"
                        value={tab.datasetId}
                        onChange={(e) => onUpdateTab(tabIndex, { datasetId: e.target.value })}
                        className="text-sm font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Title</Label>
                      <Input
                        type="text"
                        value={tab.title}
                        onChange={(e) => onUpdateTab(tabIndex, { title: e.target.value })}
                        className="text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Tags (comma-separated)</Label>
                    <Input
                      type="text"
                      value={tab.filter?.tags?.join(', ') || ''}
                      onChange={(e) => {
                        const tags = e.target.value
                          .split(',')
                          .map(t => t.trim())
                          .filter(t => t.length > 0);
                        onUpdateTab(tabIndex, {
                          filter: { ...tab.filter, tags: tags.length > 0 ? tags : undefined }
                        });
                      }}
                      className="text-sm font-mono"
                      placeholder="tag1, tag2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Archived</Label>
                      <Select
                        value={tab.filter?.archived === true ? 'true' : tab.filter?.archived === false ? 'false' : 'any'}
                        onValueChange={(value) => {
                          const archived = value === 'true' ? true : value === 'false' ? false : undefined;
                          onUpdateTab(tabIndex, {
                            filter: { ...tab.filter, archived }
                          });
                        }}
                      >
                        <SelectTrigger className="text-sm font-mono">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="true">Archived</SelectItem>
                          <SelectItem value="false">Not Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Status</Label>
                      <Select
                        value={tab.filter?.status || 'any'}
                        onValueChange={(value) => {
                          const status = value === 'any' ? undefined : value as 'read' | 'unread';
                          onUpdateTab(tabIndex, {
                            filter: { ...tab.filter, status }
                          });
                        }}
                      >
                        <SelectTrigger className="text-sm font-mono">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="unread">Unread</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => onRemoveTab(tabIndex)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive text-xs"
                  >
                    Remove Tab
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

