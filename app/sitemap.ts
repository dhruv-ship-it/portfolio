import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const projectPages = projects.flatMap((project) => [
    ...(project.href ? [{ path: project.href, priority: 0.8 }] : []),
    ...(project.deepLinks ?? []).map((link) => ({ path: link.href, priority: 0.6 })),
  ]);

  return [
    { url: site.url, lastModified: now, priority: 1 },
    ...projectPages.map(({ path, priority }) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      priority,
    })),
  ];
}
