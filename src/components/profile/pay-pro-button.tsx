import { Card, SectionTitle } from "@/components/ui";
import { CheckoutProButton } from "@/components/payments/checkout-pro-button";
import { plans } from "@/config/plans";

type PayProButtonProps = {
  hasPro: boolean;
};

export function PayProButton({ hasPro }: PayProButtonProps) {
  return (
    <Card>
      <SectionTitle
        title="Подписка Pro"
        description={`${plans.pro.priceRub} ₽ / ${plans.pro.periodDays} дней`}
      />
      <CheckoutProButton hasPro={hasPro} size="sm" label="Оплатить Pro" />
    </Card>
  );
}
