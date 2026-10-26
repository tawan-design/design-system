import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "../../lib/cn";

/**
 * Dialog — Figma: "Dialog".
 * Behavior (focus trap, Esc to close, aria-modal, scroll lock) comes from Radix.
 * Look comes from our tokens.
 */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  title: string;
  description?: string;
  footer?: React.ReactNode;
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, title, description, footer, children, ...props }, ref) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-overlay" />
      <DialogPrimitive.Content
        ref={ref}
        data-ds="DialogContent"
        className={cn(
          "fixed top-1/2 left-1/2 flex w-[calc(100%-32px)] max-w-[440px] -translate-x-1/2 -translate-y-1/2 flex-col gap-16",
          "rounded-12 border border-border bg-surface p-24 text-fg shadow-xl focus:outline-none",
          className,
        )}
        {...props}
      >
        <div className="flex flex-col gap-4">
          <DialogPrimitive.Title className="text-20 font-semibold">{title}</DialogPrimitive.Title>
          {description && (
            <DialogPrimitive.Description className="text-14 text-fg-muted">{description}</DialogPrimitive.Description>
          )}
        </div>
        {children}
        {footer && <div className="flex justify-end gap-8">{footer}</div>}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  ),
);
DialogContent.displayName = "DialogContent";
