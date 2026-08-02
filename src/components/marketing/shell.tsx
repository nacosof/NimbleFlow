import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type ShellProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "footer" | "header";
  size?: "md" | "lg";
};

const sizes = {
  md: "max-w-3xl",
  lg: "max-w-5xl",
} as const;

export function MarketingShell({
  as: Component = "div",
  size = "lg",
  className,
  ...props
}: ShellProps) {
  return (
    <Component
      className={cn("mx-auto w-full px-6", sizes[size], className)}
      {...props}
    />
  );
}
