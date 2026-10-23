import Link from "next/link";
import ProjectCard from "@/components/project-card";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

function SectionHeading({
  id,
  eyebrow,
  title,
}: {
  id: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-9">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="h-px w-7 bg-clay" />
        <p className="label">{eyebrow}</p>
      </div>
      <h2 id={id} className="mt-3 scroll-mt-24 text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="hero-wash overflow-hidden">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
          {site.availability ? (
            <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal-soft px-3 py-1 font-mono text-xs text-signal">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
              {site.availability}
            </p>
          ) : null}

          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{site.name}</h1>

          <p className="mt-3 text-lg text-ink-soft sm:text-xl">
            {site.role}
            {site.location ? <span className="text-muted"> · {site.location}</span> : null}
          </p>

          <p className="prose-col mt-8 text-xl leading-relaxed text-ink sm:text-2xl">
            {site.tagline}
          </p>

          <p className="prose-col mt-4 text-[1.0625rem] leading-relaxed text-muted">
            The one I would point at is Entrance UG, an exam-prep platform with 500+ students
            and live payments. I built it on my own and took it through launch.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-85"
            >
              See the work
            </a>
            <a
              href={`mailto:${site.email}`}
              className="rounded-lg border border-line bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
            >
              Get in touch
            </a>
            {site.links.resume ? (
              <a
                href={site.links.resume}
                className="px-2 py-2.5 text-sm text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                Resume
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- Work */}
      <div className="border-y border-line bg-tint">
        <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
          <SectionHeading id="work" eyebrow="Selected work" title="What I have built" />
          <div className="space-y-6">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      </div>

      {/* -------------------------------------------------------- Experience */}
      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <SectionHeading id="experience" eyebrow="Experience" title="Where I have worked" />
        <ol className="space-y-10">
          {site.experience.map((job) => (
            <li
              key={`${job.org}-${job.dates}`}
              className="grid gap-x-10 gap-y-3 sm:grid-cols-[11rem_1fr]"
            >
              <p className="label-muted pt-1.5">{job.dates}</p>
              <div className="relative border-l-2 border-line-soft pl-6">
                <span
                  aria-hidden="true"
                  className="absolute -left-[5px] top-2 size-2 rounded-full bg-accent"
                />
                <h3 className="font-semibold tracking-tight">
                  {job.role}
                  <span className="text-muted"> · </span>
                  {job.href ? (
                    <Link href={job.href} className="text-accent transition-opacity hover:opacity-70">
                      {job.org}
                    </Link>
                  ) : (
                    job.org
                  )}
                </h3>
                <p className="mt-1.5 font-mono text-xs text-muted">{job.stack.join("  ·  ")}</p>
                <div className="prose-col mt-3 space-y-2.5">
                  {job.points.map((point) => (
                    <p key={point.slice(0, 24)} className="text-[0.9375rem]">
                      {point}
                    </p>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------------------ Skills */}
      <div className="border-y border-line bg-tint">
        <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
          <SectionHeading id="skills" eyebrow="Toolkit" title="What I work with" />
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {site.skills.map((group) => (
              <div key={group.group}>
                <dt className="label">{group.group}</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-line bg-surface px-2.5 py-1 text-[0.8125rem] text-ink-soft"
                    >
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* ------------------------------------------------------------- About */}
      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <SectionHeading id="about" eyebrow="About" title="A little more" />
        <div className="prose-col space-y-5 text-[1.0625rem]">
          {site.about.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>

        {site.education.school ? (
          <div className="mt-10 rounded-xl border border-line bg-surface p-6 sm:p-7">
            <p className="label">Education</p>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <p className="font-medium">{site.education.school}</p>
              <p className="font-mono text-xs text-muted">{site.education.dates}</p>
            </div>
            <p className="mt-1 text-[0.9375rem] text-ink-soft">{site.education.degree}</p>
            {site.education.note ? (
              <p className="mt-2 text-[0.9375rem] text-muted">{site.education.note}</p>
            ) : null}
            {site.education.highlights.length > 0 ? (
              <ul className="mt-5 space-y-2.5 border-t border-line-soft pt-5">
                {site.education.highlights.map((item) => (
                  <li key={item.slice(0, 24)} className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-clay"
                    />
                    <span className="text-[0.9375rem] leading-relaxed text-ink-soft">{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </section>

      {/* ----------------------------------------------------------- Contact */}
      <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
        <div className="rounded-2xl border border-accent/20 bg-accent-soft p-8 sm:p-12">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-7 bg-accent" />
            <p className="label-accent">Contact</p>
          </div>
          <h2 id="contact" className="mt-3 scroll-mt-24 text-2xl font-semibold tracking-tight sm:text-3xl">
            Get in touch
          </h2>
          <p className="prose-col mt-4 text-[1.0625rem]">
            The fastest way to reach me is email. I am happy to walk through any part of my
            work on a call with my screen shared.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-6 inline-block font-mono text-base underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent sm:text-lg"
          >
            {site.email}
          </a>
        </div>
      </section>
    </>
  );
}
