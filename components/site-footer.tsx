import { site } from "@/data/site";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  const external = [
    { label: "Email", href: `mailto:${site.email}` },
    site.links.github ? { label: "GitHub", href: site.links.github } : null,
    site.links.linkedin ? { label: "LinkedIn", href: site.links.linkedin } : null,
    site.links.leetcode ? { label: "LeetCode", href: site.links.leetcode } : null,
    site.links.twitter ? { label: "X", href: site.links.twitter } : null,
    site.links.resume ? { label: "Resume", href: site.links.resume } : null,
  ].filter((l): l is { label: string; href: string } => l !== null);

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-10 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-muted">
          © {year} {site.name}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {external.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
