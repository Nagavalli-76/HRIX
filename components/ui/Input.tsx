import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="w-full">
        <label htmlFor={inputId} className="text-label mb-1.5 block text-muted">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-describedby={cn(hintId, errorId) || undefined}
          aria-invalid={Boolean(error) || undefined}
          className={cn(
            "h-11 w-full rounded-md border bg-surface px-3.5 text-[0.9375rem] text-ink placeholder:text-faint",
            "transition-colors focus-visible:border-violet",
            error ? "border-danger" : "border-line-strong",
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} className="mt-1.5 text-sm text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="mt-1.5 text-sm text-faint">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
