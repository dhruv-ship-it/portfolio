/**
 * The work index. Each entry renders one card on the home page.
 *
 * `href` points at the detail page under /work/<slug>. A project without a
 * detail page yet can set `href: ""` and the card simply won't offer the link.
 */

export type Project = {
  slug: string;
  title: string;
  /** Short status word for the pill: "Live", "In progress", "Shipped". */
  status: string;
  /** Role and dates, one line. */
  meta: string;
  /** Plain language. What is it, who uses it, is it real — in about 60 words. */
  summary: string[];
  /** Three short pieces of proof. */
  proof: string[];
  /** Six tokens, no more. */
  stack: string[];
  /** The live product, if there is one to visit. */
  live: string;
  /** The detail page. */
  href: string;
  /** Any further pages worth linking straight from the card. */
  deepLinks?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "entrance-ug",
    title: "Entrance UG",
    status: "Live",
    meta: "Sole engineer · Client work · Jun – Sep 2026",
    summary: [
      "An exam-prep platform for Indian management-entrance exams. Students sit timed mock papers, work through a lesson library and reading-comprehension drills, and get matched with mentors. Parents, mentors and admins each get their own portal.",
      "I designed, built and shipped all of it on my own, and ran it in production through launch. 500+ students use it today and it takes real payments.",
    ],
    proof: ["500+ students", "Live payments", "Sole engineer"],
    stack: ["React", "TypeScript", "Express", "PostgreSQL", "Prisma", "AWS"],
    live: "https://learn.entranceug.com",
    href: "/work/entrance-ug",
    deepLinks: [{ label: "Engineering notes", href: "/work/entrance-ug/engineering" }],
  },
];
