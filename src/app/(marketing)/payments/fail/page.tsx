import type { Metadata } from "next";
import Link from "next/link";

import { ButtonLink, Container, SectionHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Оплата не завершена",
  description: "Возврат после отмены или ошибки оплаты.",
};

export default function PaymentFailPage() {
  return (
    <Container size="sm" className="justify-center gap-6 py-20">
      <Link href="/" className="text-sm text-accent">
        NimbleFlow
      </Link>
      <SectionHeader
        title="Оплата не прошла"
        description="Платёж отменён или завершился с ошибкой. Можно попробовать снова — план не изменится, пока webhook не подтвердит оплату."
      />
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/pricing">Попробовать снова</ButtonLink>
        <ButtonLink href="/profile" variant="secondary">
          В кабинет
        </ButtonLink>
      </div>
    </Container>
  );
}
