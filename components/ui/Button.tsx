import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /** Shows a spinner and disables the button. Buttons only. */
  loading?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const BASE =
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-ink text-canvas hover:bg-white active:bg-ink/90",
  secondary:
    "border border-line-strong bg-surface/60 text-ink backdrop-blur hover:border-faint hover:bg-surface-raised",
  ghost: "text-muted hover:bg-white/5 hover:text-ink",
  danger: "border border-danger/40 text-danger hover:bg-danger/10",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 rounded-md px-3.5 text-sm",
  md: "h-11 rounded-md px-5 text-[0.9375rem]",
  lg: "h-[3.25rem] rounded-md px-7 text-base",
};

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    leadingIcon,
    trailingIcon,
    loading = false,
    className,
    children,
    href,
    ...rest
  } = props;

  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);

  const content = (
    <>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        leadingIcon
      )}
      <span>{children}</span>
      {trailingIcon}
    </>
  );

  if (href !== undefined) {
    return (
      <Link
        href={href}
        className={classes}
        data-cursor={variant === "primary" ? "magnetic" : undefined}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    );
  }

  const { type = "button", disabled, ...buttonRest } =
    rest as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
      data-cursor={variant === "primary" ? "magnetic" : undefined}
      {...buttonRest}
    >
      {content}
    </button>
  );
}
