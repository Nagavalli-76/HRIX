import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, id, className, children, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const hintId = hint ? `${selectId}-hint` : undefined;

    return (
      <div className="w-full">
        <label htmlFor={selectId} className="text-label mb-1.5 block text-muted">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-describedby={hintId}
            className={cn(
              "h-11 w-full appearance-none rounded-md border border-line-strong bg-surface px-3.5 pr-9 text-[0.9375rem] text-ink",
              "transition-colors focus-visible:border-violet",
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
            aria-hidden
          />
        </div>
        {hint ? (
          <p id={hintId} className="mt-1.5 text-sm text-faint">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = "Select";
