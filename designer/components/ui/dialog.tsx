"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Cast to any to work around React 19 type incompatibility with Radix UI
const DialogRoot = DialogPrimitive.Root as React.ComponentType<any>
const DialogTriggerPrimitive = DialogPrimitive.Trigger as React.ComponentType<any>
const DialogPortalPrimitive = DialogPrimitive.Portal as React.ComponentType<any>
const DialogClosePrimitive = DialogPrimitive.Close as React.ComponentType<any>
const DialogOverlayPrimitive = DialogPrimitive.Overlay as React.ComponentType<any>
const DialogContentPrimitive = DialogPrimitive.Content as React.ComponentType<any>
const DialogTitlePrimitive = DialogPrimitive.Title as React.ComponentType<any>
const DialogDescriptionPrimitive = DialogPrimitive.Description as React.ComponentType<any>

// The inbox popup menu and the toast render at z-index 1000/999, so the dialog
// has to sit above them to be visible when a message in either is clicked.
const DIALOG_Z_INDEX = "z-[10000]"

type DialogProps = Parameters<typeof DialogPrimitive.Root>[0]

function Dialog({ ...props }: DialogProps) {
  return <DialogRoot data-slot="dialog" {...props} />
}

type DialogTriggerProps = Parameters<typeof DialogPrimitive.Trigger>[0]

function DialogTrigger({ ...props }: DialogTriggerProps) {
  return <DialogTriggerPrimitive data-slot="dialog-trigger" {...props} />
}

type DialogCloseProps = Parameters<typeof DialogPrimitive.Close>[0]

function DialogClose({ ...props }: DialogCloseProps) {
  return <DialogClosePrimitive data-slot="dialog-close" {...props} />
}

type DialogOverlayProps = Parameters<typeof DialogPrimitive.Overlay>[0] & {
  className?: string
}

function DialogOverlay({ className, ...props }: DialogOverlayProps) {
  return (
    <DialogOverlayPrimitive
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 bg-black/50",
        DIALOG_Z_INDEX,
        className
      )}
      {...props}
    />
  )
}

type DialogContentProps = Parameters<typeof DialogPrimitive.Content>[0] & {
  className?: string
  children?: React.ReactNode
  /** Hides the built-in close button when the content supplies its own. */
  showCloseButton?: boolean
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortalPrimitive>
      <DialogOverlay />
      <DialogContentPrimitive
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 flex w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg",
          DIALOG_Z_INDEX,
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogClosePrimitive
            data-slot="dialog-close"
            className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
          >
            {React.createElement(XIcon as any)}
            <span className="sr-only">Close</span>
          </DialogClosePrimitive>
        )}
      </DialogContentPrimitive>
    </DialogPortalPrimitive>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5 pr-8", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

type DialogTitleProps = Parameters<typeof DialogPrimitive.Title>[0] & {
  className?: string
}

function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <DialogTitlePrimitive
      data-slot="dialog-title"
      className={cn("text-base leading-none font-semibold", className)}
      {...props}
    />
  )
}

type DialogDescriptionProps = Parameters<typeof DialogPrimitive.Description>[0] & {
  className?: string
}

function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <DialogDescriptionPrimitive
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
}
