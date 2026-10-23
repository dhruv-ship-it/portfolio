import Link from "next/link";
import { site } from "@/data/site";

/** `always: true` items stay visible at phone width; the rest appear from sm up. */
const nav = [
  { label: "Work", href: "/#work", always: true },
  { label: "Experience", href: "/#experience", always: false },
  { label: "Skills", href: "/#skills", always: false },
  { label: "About", href: "/#about", always: false },
  { label: "Contact", href: "/#contact", always: true },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight text-ink transition-colors hover:text-accent"
        >
          {site.name}
        </Link>

        <nav aria-label="Sections" className="flex items-center gap-1 sm:gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${
                item.always ? "" : "hidden sm:block"
              } rounded-md px-2 py-1.5 text-sm text-muted transition-colors hover:bg-line-soft hover:text-ink sm:px-3`}
            >
              {item.label}
            </Link>
          ))}
          {site.links.resume ? (
            <a
              href={site.links.resume}
              className="ml-1 hidden rounded-md border border-line px-3 py-1.5 text-sm text-ink transition-colors hover:border-accent hover:text-accent md:block"
            >
              Resume
            </a>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
