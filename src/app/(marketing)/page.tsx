import { ButtonLink, Container } from "@/components/ui";

export default function MarketingHomePage() {
  return (
    <Container className="justify-center gap-4 py-24">
      <p className="font-display text-sm tracking-[0.2em] text-accent uppercase">
        NimbleFlow
      </p>
      <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">
        Все необходимое для создания вашего
        SaaS-сервиса или любого другого веб-приложения
      </h1>
      <p className="max-w-xl text-lg text-muted">
        Open-source шаблон на Next.js: вход, кабинет, оплата и AI.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <ButtonLink href="/login" size="lg">
          Войти
        </ButtonLink>
        <ButtonLink href="/profile" variant="secondary" size="lg">
          Кабинет
        </ButtonLink>
      </div>
    </Container>
  );
}
