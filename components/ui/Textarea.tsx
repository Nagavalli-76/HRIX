import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, id, className, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const hintId = hint ? `${textareaId}-hint` : undefined;

    return (
      <div className="w-full">
        <label htmlFor={textareaId} className="text-label mb-1.5 block text-muted">
          {label}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          aria-describedby={hintId}
          rows={4}
          className={cn(
            "w-full resize-y rounded-md border border-line-strong bg-surface px-3.5 py-2.5 text-[0.9375rem] text-ink placeholder:text-faint",
            "transition-colors focus-visible:border-violet",
            className,
          )}
          {...props}
        />
        {hint ? (
          <p id={hintId} className="mt-1.5 text-sm text-faint">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
