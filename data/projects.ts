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
  /** The public repo, if the source is open. Leave "" for client work that stays private. */
  github?: string;
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
  {
    slug: "zonewise",
    title: "ZoneWise",
    status: "Live",
    meta: "Solo project · Oct 2026",
    summary: [
      "A location-aware research assistant for Delhi's Master Plan 2047. Click a point on the map and it tells you which zones apply there, with the answer backed by the actual clause.",
      "I built the retrieval and a verification step that checks every citation against the real document before it reaches you, so an answer that sounds right also has to be right.",
    ],
    proof: ["55% → 71% recall", "640 tests", "Live on Azure"],
    stack: ["Python", "FastAPI", "React", "ChromaDB", "Groq", "Docker"],
    live: "https://zonewise-dhruv-c8csg2c9hqb4d9fq.uaenorth-01.azurewebsites.net",
    github: "https://github.com/dhruv-ship-it/delhi-plan-rag",
    href: "",
  },
  {
    slug: "chess-engine",
    title: "Chess Engine",
    status: "Shipped",
    meta: "Solo project · Feb – Mar 2026",
    summary: [
      "A chess engine written from scratch in Python, no chess library doing the hard part for me: move generation, search and evaluation are all mine.",
      "Most of the work was making it think faster without changing what it can see, through better move ordering, a transposition table and a quiescence search.",
    ],
    proof: ["93% faster search", "+2 plies deeper", "13 benchmark positions"],
    stack: ["Python"],
    live: "",
    github: "https://github.com/dhruv-ship-it/Chess-engine",
    href: "",
  },
];
