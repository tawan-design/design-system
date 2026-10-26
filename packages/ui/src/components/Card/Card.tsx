import * as React from "react";
import { cn } from "../../lib/cn";

/** Card — Figma: "Card". Container for grouped content. Compose with CardHeader / CardBody. */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-ds="Card" className={cn("rounded-12 border border-border bg-surface", className)} {...props} />;
}

export function CardHeader({ className, title, description, action, ...props }:
  Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & { title: React.ReactNode; description?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div data-ds="CardHeader" className={cn("flex items-start justify-between gap-16 p-20 pb-0", className)} {...props}>
      <div className="flex flex-col gap-4">
        <h3 className="text-16 font-semibold text-fg">{title}</h3>
        {description && <p className="text-14 text-fg-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-ds="CardBody" className={cn("p-20", className)} {...props} />;
}
