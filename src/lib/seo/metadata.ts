import type { Metadata } from "next";

import { site } from "@/config/site";

type CreatePageMetadataInput = {
  title: string;
  description: string;
  path?: string;
  absoluteTitle?: boolean;
  noIndex?: boolean;
};

export function absoluteUrl(path = "/") {
  const base = site.url.replace(/\/$/, "");
  if (!path || path === "/") {
    return base;
  }
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createPageMetadata({
  title,
  description,
  path = "/",
  absoluteTitle = false,
  noIndex = false,
}: CreatePageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = absoluteTitle ? title : `${title} · ${site.name}`;

  return {
    title: absoluteTitle
      ? { absolute: title }
      : title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    title: site.title,
    description: site.description,
    url: absoluteUrl("/"),
    siteName: site.name,
    locale: site.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  alternates: {
    canonical: absoluteUrl("/"),
  },
};
