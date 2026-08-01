export default function MarketingHomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-24">
      <p className="font-display text-sm tracking-[0.2em] text-accent uppercase">
        NimbleFlow
      </p>
      <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">
        Все необходимое для создания вашего
        SaaS-сервиса или любого другого веб-приложения
      </h1>
      <p className="max-w-xl text-lg text-muted">
        Open-source шаблон на Next.js под российские сервисы авторизации и
        платежных провайдеров. 
      </p>
    </main>
  );
}
