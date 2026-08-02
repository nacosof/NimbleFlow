import { Card, SectionTitle } from "@/components/ui";

type AccountSummaryProps = {
  name: string | null;
  email: string | null;
  phone: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
};

export function AccountSummary({
  name,
  email,
  phone,
  emailVerified,
  phoneVerified,
}: AccountSummaryProps) {
  return (
    <Card>
      <SectionTitle
        title="Аккаунт"
        description="Данные профиля и статус подтверждений"
      />
      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <dt className="text-muted">Имя</dt>
          <dd>{name || "—"}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-muted">Email</dt>
          <dd className="break-all">
            {email || "—"}
            {email ? (
              <span className="mt-1 block text-xs text-muted">
                {emailVerified ? "Подтверждён" : "Не подтверждён"}
              </span>
            ) : null}
          </dd>
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <dt className="text-muted">Телефон</dt>
          <dd>
            {phone || "—"}
            {phone ? (
              <span className="mt-1 block text-xs text-muted">
                {phoneVerified ? "Подтверждён" : "Не подтверждён"}
              </span>
            ) : null}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
