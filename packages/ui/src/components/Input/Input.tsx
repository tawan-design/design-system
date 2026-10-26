import * as React from "react";
import { cn } from "../../lib/cn";

/** Input — Figma: "Input" component set (states: Default, Focus, Error, Disabled). */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
    return (
      <div data-ds="Input" className="flex flex-col gap-4">
        {label && (
          <label htmlFor={inputId} className="text-14 font-medium text-fg">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-40 rounded-8 border border-border bg-surface px-12 text-14 text-fg placeholder:text-fg-muted",
            "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-border-focus",
            "disabled:cursor-not-allowed disabled:bg-muted",
            error && "border-border-danger",
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className="text-12 text-fg-danger">{error}</p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-12 text-fg-muted">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";
