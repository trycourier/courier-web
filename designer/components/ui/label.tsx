"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "../../lib/utils"

type LabelProps = Parameters<typeof LabelPrimitive.Root>[0] & {
  className?: string;
}

function Label({
  className,
  children,
  ...props
}: LabelProps) {
  const Root = LabelPrimitive.Root as any;
  return (
    <Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </Root>
  )
}

export { Label }
export type { LabelProps }
