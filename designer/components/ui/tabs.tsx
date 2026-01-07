"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

// Cast to any to work around React 19 type incompatibility with Radix UI
const TabsRoot = TabsPrimitive.Root as React.ComponentType<any>
const TabsListPrimitive = TabsPrimitive.List as React.ComponentType<any>
const TabsTriggerPrimitive = TabsPrimitive.Trigger as React.ComponentType<any>
const TabsContentPrimitive = TabsPrimitive.Content as React.ComponentType<any>

type TabsProps = Parameters<typeof TabsPrimitive.Root>[0]

function Tabs({ ...props }: TabsProps) {
  return <TabsRoot data-slot="tabs" {...props} />
}

type TabsListProps = Parameters<typeof TabsPrimitive.List>[0] & {
  className?: string
}

function TabsList({ className, ...props }: TabsListProps) {
  return (
    <TabsListPrimitive
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

type TabsTriggerProps = Parameters<typeof TabsPrimitive.Trigger>[0] & {
  className?: string
}

function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  return (
    <TabsTriggerPrimitive
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
        className
      )}
      {...props}
    />
  )
}

type TabsContentProps = Parameters<typeof TabsPrimitive.Content>[0] & {
  className?: string
}

function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <TabsContentPrimitive
      data-slot="tabs-content"
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
