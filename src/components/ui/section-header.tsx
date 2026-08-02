import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  titleClassName?: string;
};

export function SectionHeader({
  title,
  description,
  action,
  className,
  titleClassName,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-4",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <h1
          className={cn(
            "font-display text-3xl tracking-tight",
            titleClassName,
          )}
        >
          {title}
        </h1>
        {description ? (
          <p className="text-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

type SectionTitleProps = {
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  className?: string;
};

export function SectionTitle({
  title,
  description,
  meta,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline justify-between gap-2",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium">{title}</h2>
        {description ? (
          <p className="text-sm text-muted">{description}</p>
        ) : null}
      </div>
      {meta}
    </div>
  );
}
