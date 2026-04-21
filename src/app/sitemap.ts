import type { MetadataRoute } from "next";
import { site } from "@/data/site";

const SITE_URL = "https://izzyt.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/timeline`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/experiments`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const experimentRoutes: MetadataRoute.Sitemap = site.experiments.items.map(
    (item) => ({
      url: `${SITE_URL}/experiments/${item.slug}`,
      lastModified: new Date(item.sortDate),
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  const postRoutes: MetadataRoute.Sitemap = site.posts.items.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...experimentRoutes, ...postRoutes];
}
