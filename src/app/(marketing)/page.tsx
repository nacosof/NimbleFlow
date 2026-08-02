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
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: `${site.name} — шаблон SaaS на Next.js`,
  description: site.description,
  path: "/",
  absoluteTitle: true,
});


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
