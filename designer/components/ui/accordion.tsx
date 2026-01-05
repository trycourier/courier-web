"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type AccordionProps = Parameters<typeof AccordionPrimitive.Root>[0]

function Accordion({
  ...props
}: AccordionProps) {
  const Root = AccordionPrimitive.Root as any;
  return <Root data-slot="accordion" {...props} />
}

type AccordionItemProps = Parameters<typeof AccordionPrimitive.Item>[0] & {
  className?: string;
}

function AccordionItem({
  className,
  ...props
}: AccordionItemProps) {
  const Item = AccordionPrimitive.Item as any;
  return (
    <Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  )
}

type AccordionTriggerProps = Parameters<typeof AccordionPrimitive.Trigger>[0] & {
  className?: string;
  children?: React.ReactNode;
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  const Header = AccordionPrimitive.Header as any;
  const Trigger = AccordionPrimitive.Trigger as any;
  const Icon = ChevronDownIcon as any;
  return (
    <Header className="flex w-full">
      <Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <Icon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </Trigger>
    </Header>
  )
}

type AccordionContentProps = Parameters<typeof AccordionPrimitive.Content>[0] & {
  className?: string;
  children?: React.ReactNode;
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  const Content = AccordionPrimitive.Content as any;
  return (
    <Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
