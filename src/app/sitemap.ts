import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config/site";

const paths = ["", "/meet", "/help", "/events", "/resources", "/about", "/contact", "/privacy", "/accessibility", "/records"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({ url: `${siteConfig.siteUrl}${path}`, changeFrequency: path === "" ? "weekly" : "monthly", priority: path === "" ? 1 : 0.7 }));
}
