import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

const publicRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/pricing", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/login", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/legal/terms", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/legal/offer", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/legal/privacy", priority: 0.4, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
