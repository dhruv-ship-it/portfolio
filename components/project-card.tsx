import Link from "next/link";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-accent/40">
      <div aria-hidden="true" className="h-1 w-full bg-linear-to-r from-accent via-clay to-signal" />
      <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {project.href ? (
            <Link href={project.href} className="transition-colors hover:text-accent">
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </h3>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-signal/30 bg-signal-soft px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-signal">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-signal"
          />
          {project.status}
        </span>
      </div>

      <p className="label mt-2">{project.meta}</p>

      <div className="prose-col mt-5 space-y-3.5 text-[0.95rem]">
        {project.summary.map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
      </div>

      <ul className="mt-6 flex flex-wrap gap-2">
        {project.proof.map((item) => (
          <li
            key={item}
            className="rounded-md bg-accent-soft px-2.5 py-1 font-mono text-xs text-accent"
          >
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-5 font-mono text-xs text-muted">
        {project.stack.join("  ·  ")}
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line-soft pt-5 text-sm">
        {project.live ? (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent"
          >
            Visit the live site ↗
          </a>
        ) : null}
        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            Code on GitHub ↗
          </a>
        ) : null}
        {project.href ? (
          <Link
            href={project.href}
            className="text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            Read the case study →
          </Link>
        ) : null}
        {project.deepLinks?.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            {link.label} →
          </Link>
        ))}
        </div>
      </div>
    </article>
  );
}
