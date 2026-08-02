import type { ReactNode } from "react";
import Link from "next/link";

import { Container } from "@/components/ui";

type LegalShellProps = {
  title: string;
  children: ReactNode;
};

export function LegalShell({ title, children }: LegalShellProps) {
  return (
    <Container className="gap-8 py-16" size="md">
      <div className="flex flex-col gap-2">
        <Link href="/" className="text-sm text-accent">
          На главную
        </Link>
        <h1 className="font-display text-3xl tracking-tight">{title}</h1>
      </div>

      <aside className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted">
        Это <strong className="font-medium text-foreground">шаблон</strong> для
        вашего продукта, а не юридическая консультация. Перед публикацией
        замените плейсхолдеры реквизитами и согласуйте текст с юристом под свою
        модель бизнеса.
      </aside>

      <article className="flex flex-col gap-8 text-sm leading-relaxed text-foreground [&_h2]:font-display [&_h2]:text-xl [&_h2]:tracking-tight [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_p]:text-muted [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </article>

      <nav className="flex flex-wrap gap-4 border-t border-border pt-6 text-sm">
        <Link href="/legal/terms" className="text-accent">
          Соглашение
        </Link>
        <Link href="/legal/offer" className="text-accent">
          Оферта
        </Link>
        <Link href="/legal/privacy" className="text-accent">
          Конфиденциальность
        </Link>
      </nav>
    </Container>
  );
}
