import type { ButtonHTMLAttributes } from "react";
import Link from "next/link";

import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-accent text-white hover:opacity-90 disabled:opacity-60",
  secondary:
    "border border-border transition hover:bg-white/70 disabled:opacity-60",
  inverse:
    "border-0 bg-white text-accent hover:opacity-90 disabled:opacity-60",
  onDark:
    "border border-white/30 text-white transition hover:bg-white/10 disabled:opacity-60",
} as const;

const sizes = {
  md: "px-4 py-3 text-sm",
  sm: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-sm",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export function buttonClassName(input?: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center rounded-lg font-medium transition",
    variants[input?.variant ?? "primary"],
    sizes[input?.size ?? "md"],
    input?.className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, className })}
      {...props}
    />
  );
}

type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClassName({ variant, size, className })}>
      {children}
    </Link>
  );
}
