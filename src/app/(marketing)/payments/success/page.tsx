import Link from "next/link";

import { ButtonLink, Container, SectionHeader } from "@/components/ui";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Оплата принята",
  description: "Возврат после успешной оплаты.",
  path: "/payments/success",
  noIndex: true,
});


export default function PaymentSuccessPage() {
  return (
    <Container size="sm" className="justify-center gap-6 py-20">
      <Link href="/" className="text-sm text-accent">
        NimbleFlow
      </Link>
      <SectionHeader
        title="Спасибо"
        description="Вы вернулись с платёжной страницы. Статус Pro обновится после webhook — обычно за несколько секунд."
      />
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/profile?paid=1">Открыть кабинет</ButtonLink>
        <ButtonLink href="/pricing" variant="secondary">
          К тарифам
        </ButtonLink>
      </div>
    </Container>
  );
}
