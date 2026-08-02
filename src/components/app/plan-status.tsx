import { CheckoutProButton } from "@/components/payments/checkout-pro-button";
import { ButtonLink, Card, SectionTitle } from "@/components/ui";
import { plans, type PlanId } from "@/config/plans";

type PlanStatusProps = {
  plan: PlanId;
  hasPro: boolean;
  expiresAt: Date | null;
  isDevSession?: boolean;
};

function formatExpiry(date: Date) {
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function PlanStatus({
  plan,
  hasPro,
  expiresAt,
  isDevSession = false,
}: PlanStatusProps) {
  return (
    <Card>
      <SectionTitle
        title="Подписка"
        description={
          hasPro
            ? `${plans.pro.priceRub} ₽ / ${plans.pro.periodDays} дней`
            : "Базовый доступ без оплаты"
        }
        meta={
          <span
            className={
              hasPro
                ? "text-sm font-medium uppercase text-accent"
                : "text-sm font-medium uppercase text-muted"
            }
          >
            {plan}
          </span>
        }
      />

      {hasPro ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-accent">Pro активен</p>
          <p className="text-sm text-muted">
            {expiresAt
              ? `Действует до ${formatExpiry(expiresAt)}.`
              : "Срок окончания не задан."}
          </p>
          <div>
            <ButtonLink href="/pricing" variant="secondary" size="sm">
              К тарифам
            </ButtonLink>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            Сейчас Free. Pro открывает платный контур на{" "}
            {plans.pro.periodDays} дней за {plans.pro.priceRub} ₽.
          </p>
          <CheckoutProButton size="sm" label="Оплатить Pro" />
          <ButtonLink href="/pricing" variant="secondary" size="sm">
            Смотреть тарифы
          </ButtonLink>
        </div>
      )}

      {isDevSession ? (
        <p className="text-sm text-muted">
          Dev-вход без БД: план из сессии, оплата и webhook недоступны.
        </p>
      ) : null}
    </Card>
  );
}
