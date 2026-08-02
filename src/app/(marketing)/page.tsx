import type { Metadata } from "next";

import {
  Faq,
  Features,
  FinalCta,
  Hero,
  Pricing,
  Problem,
  SiteFooter,
  SiteHeader,
} from "@/components/marketing";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: {
    absolute: `${site.name} — шаблон SaaS на Next.js`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — шаблон SaaS на Next.js`,
    description: site.description,
  },
};

export default function MarketingHomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Problem />
        <Features />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
