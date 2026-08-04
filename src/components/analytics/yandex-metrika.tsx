"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { Suspense, useEffect, useRef } from "react";

import { getMetrikaCounterId, metrikaHit } from "@/lib/analytics/metrika";

function MetrikaRouteHits({ counterId }: { counterId: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstHit = useRef(true);

  useEffect(() => {
    if (isFirstHit.current) {
      isFirstHit.current = false;
      return;
    }

    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    metrikaHit(url);
  }, [pathname, searchParams, counterId]);

  return null;
}

export function YandexMetrika() {
  const counterId = getMetrikaCounterId();

  if (!counterId) {
    return null;
  }

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">{`
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

ym(${counterId}, "init", {
  defer: true,
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true,
  webvisor: true
});
ym(${counterId}, "hit", window.location.href);
      `}</Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${counterId}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
      <Suspense fallback={null}>
        <MetrikaRouteHits counterId={counterId} />
      </Suspense>
    </>
  );
}
