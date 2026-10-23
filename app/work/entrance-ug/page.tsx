import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Entrance UG — case study",
  description:
    "An exam-prep platform for Indian management-entrance exams. Sole engineer, live in production with 500+ students and live payments.",
};

const LIVE_URL = "https://learn.entranceug.com";

const meta = [
  { field: "Role", value: "Sole engineer — architecture through production operations" },
  { field: "Type", value: "Client work, paid engagement" },
  { field: "Built", value: "Jun – Sep 2026" },
  { field: "Status", value: "Launched September 2026, live today" },
];

const highlights = [
  "Built the payments layer so money and access can never disagree. The server asks the gateway what happened rather than trusting the browser, settlement is idempotent, and an hourly sweep picks up anything that went quiet. 29 payment scenarios cover it and they run before every deploy.",
  "Shipped four products on one Postgres schema of 100+ tables: timed mock exams, a course library, reading drills and cohort mentorship. Five kinds of user see five different versions of it, and each one is a separate portal.",
  "Replaced form-by-form content entry with a bulk importer that shows you a dry run first. It spans all four products and now carries 99.7% of a 5,000-question bank.",
  "Built the API's delivery pipeline on AWS (GitHub Actions → ECR → SSM onto EC2), instrumented it, then cut image build time 40% by caching the dependency layer.",
  "Ran an authorization sweep that fired every route with credentials that shouldn't open it — wrong role, and right role holding someone else's id. Roughly 1,683 negative cases, and it caught a privilege escalation between two mentors who shared a student.",
  "Tracked down a cross-user data leak in production caused by two systems that were each working exactly as designed. Closed it with one header and a written invariant.",
  "Shipped 72+ schema migrations against live student data with no data loss, under a rule that splits every destructive change across two deploys.",
];

const products = [
  {
    name: "Mock tests",
    what: "Full-length and sectional papers under real exam conditions, with a section clock, a question palette, mark-for-review, auto-save and auto-submit.",
  },
  {
    name: "Course library",
    what: "376 lessons organised by subject, topic and subtopic, each with its own practice test.",
  },
  {
    name: "Daily challenge",
    what: "A new reading-comprehension passage and data-interpretation set every day, with streaks, a weekly leaderboard and an archive of closed passages.",
  },
  {
    name: "Mentorship",
    what: "Cohort batches with an assigned mentor, weekly tasks, live classes, a doubt thread and batch tests.",
  },
];

const surfaces = [
  ["Students", "the four products, a dashboard, their own analysis, bookmarks and a community chat."],
  ["Parents", "a read-only view of their own child and nothing else: attendance, tasks, test results."],
  ["Mentors", "only the batches assigned to them — roster, tasks, classes, doubts and tests."],
  ["Admins", "43 pages across 16 permission areas that can be granted one at a time."],
  ["Everyone else", "a public site with free resources, plan pricing and a sample quiz."],
];

const constraints = [
  ["One developer.", "Me. No reviewer, no second pair of eyes, nobody to ask."],
  ["A real launch date,", "because students were waiting."],
  [
    "A tight monthly budget,",
    "set by the client. That one constraint decided the whole infrastructure.",
  ],
  [
    "My first production deployment.",
    "I had never put anything on AWS, never owned a domain, never taken a payment, never had a user I could not just email.",
  ],
];

const phases = [
  {
    n: "01",
    title: "Build it",
    body: [
      "I did not start with code. I started with the database, on paper first and then in a copy of the schema I could throw away — every table, field and relationship, before anything got built on top of a shape I would regret.",
      "Two decisions came out of that week and both held for the whole project. The first was splitting the platform into four pillars, each owning its own tables, so a feature touches one pillar and a mistake in one cannot corrupt another. The obvious alternative was one attempts table with a type column; I took the duplication on purpose, and paid for it later when the four question tables turned out not to have matching columns.",
      "The second was that all four pillars share one examination engine. What surrounds a test differs by pillar, but a student sitting a paper should not be able to tell which pillar it belongs to.",
    ],
  },
  {
    n: "02",
    title: "Harden it, then launch",
    body: [
      "Before taking any real money I went looking for ways the payment path could be wrong. It took two days and turned up eight bugs. One of them let a student renew a plan forever off a single payment. I did not just reason about it — I reproduced it, then fixed it so the arithmetic could not produce that answer again.",
      "The other half of that fortnight was infrastructure, and it went badly. The plan was AWS App Runner, but AWS had stopped taking new App Runner customers months earlier, so it was not available to this account. Lightsail containers came next; that hung partway through issuing its TLS certificate, stayed stuck for days, could not be deleted, and my support case went unanswered.",
      "I built it a third time on a plain EC2 instance with Caddy in front, picked specifically because every step of bringing the site up is something I can watch happen from a shell and retry. What made three attempts survivable: nothing in the Dockerfile knows what it is running on, so changing hosts twice cost a deploy workflow rewrite and nothing else.",
    ],
  },
  {
    n: "03",
    title: "Run it",
    body: [
      "Running software is a different job from writing it, and I did not know that until I was doing it. Within a week students were telling me their dashboard was greeting them by somebody else's name. Nothing was wrong with the API and nothing was wrong with the CDN — the bug lived in the gap between them, so finding it meant thinking about the shape of the deployment rather than reading any code.",
      "What that month really produced was tooling. I made the deploy record what it costs on every run, because I had noticed a figure in my own documentation was an estimate from watching a screen rather than anything I had measured. I promoted my verification suite from something I ran out of habit to something that gates the deploy and can block a release. And I wrote a workflow that can diagnose the instance and roll it back without me shelling in by hand.",
    ],
  },
];


type WorkPiece = {
  id: string;
  title: string;
  lead: string;
  body: string[];
  /** A single line worth setting apart. */
  pull?: string;
  /** Anchor on the engineering notes page that covers the mechanism. */
  deeper: { label: string; anchor: string };
};

const work: WorkPiece[] = [
  {
    id: "money",
    title: "Money",
    lead: "The whole payment system is built around one rule: money and access can never disagree.",
    body: [
      "The gateway's signed callback looks like a receipt and is not one. It proves a payment id belongs to an order id, and nothing else. Not that the money was captured, not the amount, not the currency. So the server stopped trusting the browser and asks the gateway directly what happened.",
      "The same payment also arrives more than once by design, and sometimes it does not arrive at all. Both are handled without a guard flag: expiry is measured from the moment the payment was captured and written once, so settling twice gives the same answer, and an hourly sweep picks up any checkout that went quiet. A dropped webhook costs an hour's delay, never a lost payment.",
      "Refunds turned out harder than payments. A fully refunded payment still reports its original amount, so every check passes and the grant runs again. Buy, refund, replay, keep the course. There are 29 named payment scenarios in the suite now, holding 127 assertions, and they run before every deploy.",
    ],
    deeper: { label: "The receipt that isn't a receipt", anchor: "payments" },
  },
  {
    id: "exam-engine",
    title: "The exam engine",
    lead: "Four products share one engine, so everything a real exam needs exists once.",
    body: [
      "The overall timer and per-section clocks, the question palette, mark-for-review, auto-save, auto-submit when the window closes, negative marking, integer answers, multiple-correct and passage questions, maths rendering and a full review mode.",
      "The bug I am most glad I found needs no technical background. I had treated a section's time limit as a fixed deadline instead of a budget, so a student who finished section one in ten minutes walked into section two with fifty minutes on its clock instead of thirty. Time saved by working quickly got handed to the next section, which is the opposite of what a sectional paper means. The fix shipped while students had attempts in progress and carried every one of them across without invalidating anybody's sitting.",
      "Two more rules came from asking what an admin might do mid-paper. An attempt is marked against its own snapshot rather than the live question, so fixing an answer key does not re-mark somebody who already submitted. And a paper that forbids going back to a section is now checked on the server, because a rule only the browser knows is not a rule.",
    ],
    deeper: { label: "A clock is a budget, not a deadline", anchor: "clock" },
  },
  {
    id: "analysis",
    title: "The analysis layer",
    lead: "This is the part I thought hardest about, and most of the thinking went into knowing when not to answer.",
    body: [
      "After a paper, a student gets a short written brief. It is built around the one fact that makes these exams different: a wrong answer costs you marks. That makes the most common piece of advice in test prep, attempt more questions, wrong more often than it is right. So the brief works out whether attempting more would actually have scored more, at that student's own rate of getting things right, and says which situation they are in.",
      "The harder problem was knowing when to shut up. A full paper might carry 60 questions across 25 subtopics, so about two each. Ranking a topic on two questions is noise, not analysis. Every competitor does it anyway, because a page full of topic percentages looks thorough. I put an evidence threshold in instead, and anything below it is left out and listed at the bottom, so you can see what was skipped.",
      "That restraint cost me two things I had already shipped. A percentile I was showing students turned out to be invented, so I deleted it. And a reading-speed figure was arithmetic pretending to be measurement: a 347-word passage came out at 1096 words per minute. It is measured properly now, and it refuses to answer when it cannot.",
    ],
    pull: "A precise-looking number nobody can defend is worse than an honest gap.",
    deeper: { label: "Knowing when not to answer", anchor: "analysis" },
  },
  {
    id: "admin",
    title: "The admin console",
    lead: "Students never see any of this, and a lot of the work went into it, because a platform nobody can operate is not finished.",
    body: [
      "Getting content in was the first problem. The original flow took one level at a time, which made 280 reading-comprehension passages 280 separate uploads, done by hand. So I built an importer that takes one file carrying a whole test and works out the rest. The part I would defend is that the dry run and the real run are the same code path, with the writes held back. A separate preview drifts, and the first time it drifts somebody imports 2,000 questions on the strength of a report describing different behaviour.",
      "The other half is permissions. Sub-admins should not all see everything, and the quick version of that is a role column, which falls over the first time somebody needs two roles and a bit of a third. So there are 16 permission areas instead, granted one at a time, and nothing new is visible to every sub-admin by default.",
      "The small stuff in here is what I would actually bring up in an interview. A student who joins a mentorship batch six weeks in inherits all its history but never shows as having missed any of it. And a deadline decides whether work was on time, not whether it can be handed in, so \"done\", \"done late\" and \"never done\" are three different answers everywhere they appear.",
    ],
    deeper: { label: "A dry run that can't lie", anchor: "importer" },
  },
];


const failures = [
  {
    found: "Found by me, before launch",
    title: "A signature could be replayed to renew a plan forever",
    body: "There is nothing in a gateway signature that ages, and my settlement code worked out the access expiry from the current time on every run. So re-posting the same signature a month later bought another month, from one payment, indefinitely. I reproduced it before fixing it: wound a purchase back to five days remaining, replayed the signature, and watched the expiry move out by 24 days. The fix measures expiry from the moment the payment was captured and writes it once, which makes settlement idempotent by construction rather than by a guard.",
  },
  {
    found: "Found by my users, a week after launch",
    title: "Students saw somebody else's name on their dashboard",
    body: "The API sent no caching instructions at all, and in production every API call goes through the CDN that serves the website. So a shared cache was free to hold one student's \"who am I\" response and hand it to the next person who asked, whatever credentials they were carrying. Nothing was broken in the API and nothing was broken in the CDN — each was doing exactly what it was designed to do, and the bug lived in between. It is closed with one response header, and written down as a numbered invariant in the deployment doc so it cannot quietly come back.",
  },
  {
    found: "Found by the machine",
    title: "A deploy died on a full disk, and the cleanup was gated behind the step that needed it",
    body: "The instance's disk had filled with images from previous deploys. The interesting part is not the disk: there was already a cleanup step, but it ran after the new container reported healthy — which is after the step that had run out of room. So once the disk filled, the pull died, the cleanup never ran, and every retry failed in exactly the same place. It runs before the pull now with no age filter, and because the running container still references the image currently serving, the live version can never be what gets removed.",
  },
];

const tradeoffs = [
  [
    "One instance, one container.",
    "A deploy is a restart, so a deploy that fails to start is an outage until it is fixed or rolled back. That is exactly why there is a rollback workflow. A second instance did not fit the budget, and it is the first thing I would change if availability became a requirement rather than a preference.",
  ],
  [
    "The API and database are secured by TLS and credentials rather than network isolation.",
    "I costed a private network and it was declined for launch, because the gateway alone would have roughly doubled the monthly bill. Written down as a decision, with the trigger for revisiting it.",
  ],
  [
    "Managed container hosting was costed and declined too.",
    "The load balancer alone costs more than everything else put together. The trigger I wrote down is a second instance becoming necessary, at which point the balancer stops being overhead and becomes the thing I needed anyway.",
  ],
  [
    "Background jobs run inside the API process on a timer",
    "rather than in a separate worker. That is correct at one instance, and every write they make is idempotent, which is what would make a second instance safe to add without rewriting them.",
  ],
  [
    "No load test yet.",
    "Nobody knows how the submit path behaves when forty students finish a mock in the same minute. It is the next thing I would measure.",
  ],
];

const stack = [
  [
    "Frontend",
    "React 18, TypeScript, Vite, React Router (five separate lazy-loaded route trees), TanStack Query, Tailwind CSS, Recharts, KaTeX for maths in questions",
  ],
  [
    "Backend",
    "Node, Express 5, TypeScript, Prisma, Zod for request validation, JWT access and refresh tokens, bcrypt, helmet, rate limiting, compression",
  ],
  ["Database", "PostgreSQL — 100+ tables, 72+ migrations, raw SQL where the query mattered"],
  [
    "Infrastructure",
    "AWS — EC2, RDS, S3, CloudFront, ECR, SSM, Secrets Manager, Amplify Hosting. Docker. Caddy terminating TLS with Let's Encrypt certificates it renews itself",
  ],
  [
    "CI/CD",
    "GitHub Actions → ECR → SSM. Build, typecheck and the verification suite gate the deploy. Migrations apply when the container starts",
  ],
  ["Payments", "Razorpay — orders, webhooks verified on raw request bytes, refunds, disputes, reconciliation"],
  ["Other services", "Transactional email, SMS phone verification, presigned uploads straight from the browser"],
  ["Tooling", "npm workspaces, TypeScript project references, a 47-module verification suite I wrote"],
];

/* --------------------------------------------------------------- building blocks */

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line py-14 sm:py-16">
      {eyebrow ? <p className="label">{eyebrow}</p> : null}
      <h2
        id={id}
        className="mt-2 scroll-mt-24 text-2xl font-semibold tracking-tight sm:text-3xl"
      >
        {title}
      </h2>
      <div className="mt-7">{children}</div>
    </section>
  );
}

export default function EntranceUgPage() {
  return (
    <article className="mx-auto max-w-5xl px-5 sm:px-8">
      {/* ---------------------------------------------------------------- Hero */}
      <header className="hero-wash py-12 sm:py-16">
        <Link
          href="/#work"
          className="font-mono text-xs text-muted transition-colors hover:text-accent"
        >
          ← All work
        </Link>

        <p className="label mt-8">Client work · Live in production</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Entrance UG</h1>

        <div className="prose-col mt-6 space-y-4 text-lg">
          <p>
            An exam-prep platform for Indian management-entrance exams. Students sit timed
            mock papers, work through a lesson library and reading-comprehension drills, and
            get matched with mentors. Parents, mentors and admins each get their own portal.
          </p>
          <p className="font-medium text-ink">
            I designed and built all of it on my own, and ran it in production through
            launch.
          </p>
        </div>

        <dl className="mt-10 grid gap-x-10 gap-y-5 border-t border-line pt-8 sm:grid-cols-2">
          {meta.map(({ field, value }) => (
            <div key={field}>
              <dt className="label">{field}</dt>
              <dd className="mt-1.5 text-[0.9375rem] text-ink-soft">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href={LIVE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-85"
          >
            Visit the live site ↗
          </a>
          <Link
            href="/work/entrance-ug/engineering"
            className="rounded-lg border border-line bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            Engineering notes →
          </Link>
        </div>
      </header>

      {/* ---------------------------------------------------------- Highlights */}
      <Section id="in-short" eyebrow="In short" title="The short version">
        <ul className="prose-col space-y-4">
          {highlights.map((item) => (
            <li key={item.slice(0, 24)} className="flex gap-3.5">
              <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span className="leading-relaxed text-ink-soft">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* -------------------------------------------------------- What it is */}
      <Section id="what-it-is" eyebrow="The product" title="What it is">
        <div className="prose-col space-y-5">
          <p>
            Entrance UG gets students ready for IPMAT, JIPMAT and CUET, which are
            undergraduate management-entrance exams in India. They are hard in a particular
            way: each section is separately timed, a wrong answer costs you marks, and you can
            post a good total and still get sunk by one weak section. Almost every design
            decision in the product comes back to those three things.
          </p>
          <p>There are four things a student can do, and they all run on the same examination engine.</p>
        </div>

        <dl className="mt-8 grid gap-5 sm:grid-cols-2">
          {products.map(({ name, what }) => (
            <div key={name} className="rounded-xl border border-line bg-surface p-5">
              <dt className="font-medium">{name}</dt>
              <dd className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{what}</dd>
            </div>
          ))}
        </dl>

        <p className="prose-col mt-10 font-medium">
          Five kinds of user, and they each see a different product:
        </p>
        <dl className="prose-col mt-4 space-y-3">
          {surfaces.map(([who, what]) => (
            <div key={who} className="text-[0.9375rem] leading-relaxed">
              <dt className="inline font-medium text-ink">{who}</dt>
              <dd className="inline text-ink-soft"> get {what}</dd>
            </div>
          ))}
        </dl>

        <p className="prose-col mt-8 text-[0.9375rem] text-muted">
          Behind all of that: 295 published tests, a 5,003-question bank, and a 100+ table
          schema holding it together.
        </p>
      </Section>

      {/* ------------------------------------------------------ Where it began */}
      <Section id="constraints" eyebrow="The brief" title="Where this started">
        <p className="prose-col">
          The brief was short to say and large to build. The client wanted their own
          exam-prep platform: timed mock papers, a course library, daily drills and
          mentorship in one place, built around the way these exams actually work.
        </p>
        <p className="prose-col mt-4">Some things were fixed before I wrote a line.</p>
        <dl className="prose-col mt-6 space-y-4">
          {constraints.map(([head, tail]) => (
            <div key={head} className="text-[0.9375rem] leading-relaxed">
              <dt className="inline font-medium text-ink">{head}</dt>
              <dd className="inline text-ink-soft"> {tail}</dd>
            </div>
          ))}
        </dl>
        <blockquote className="prose-col mt-10 border-l-2 border-accent pl-5 text-lg leading-relaxed text-ink">
          This platform takes money and then has to deliver what the money bought. A bug in a
          mock test is annoying. A bug in the payment path is somebody&rsquo;s money.
        </blockquote>
      </Section>

      {/* ------------------------------------------------------------- Phases */}
      <Section id="phases" eyebrow="How it went" title="The build, in three phases">
        <ol className="space-y-12">
          {phases.map(({ n, title, body }) => (
            <li key={n}>
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-sm font-medium text-clay">{n}</span>
                <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
              </div>
              <div className="prose-col mt-4 space-y-4 pl-0 sm:pl-10">
                {body.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* ----------------------------------------------------------- The work */}
      <Section id="the-work" eyebrow="The engineering" title="Four pieces of the work">
        <p className="prose-col -mt-2 text-[0.9375rem] text-muted">
          Each one stands alone. Read whichever is relevant to you. The{" "}
          <Link
            href="/work/entrance-ug/engineering"
            className="text-ink-soft underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            engineering notes
          </Link>{" "}
          go a level deeper on all four.
        </p>

        <div className="mt-10 space-y-14">
          {work.map((piece) => (
            <div key={piece.id}>
              <h3
                id={piece.id}
                className="scroll-mt-24 border-b border-line-soft pb-3 text-xl font-semibold tracking-tight"
              >
                {piece.title}
              </h3>
              <p className="prose-col mt-5 text-[1.0625rem] font-medium leading-relaxed text-ink">
                {piece.lead}
              </p>
              <div className="prose-col mt-4 space-y-4">
                {piece.body.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>

              {piece.pull ? (
                <p className="prose-col mt-7 border-l-2 border-accent pl-5 text-lg leading-relaxed text-ink">
                  {piece.pull}
                </p>
              ) : null}

              <p className="prose-col mt-6 text-sm">
                <Link
                  href={`/work/entrance-ug/engineering#${piece.deeper.anchor}`}
                  className="text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  How this works, in the engineering notes: {piece.deeper.label} →
                </Link>
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* --------------------------------------------------------- Went wrong */}
      <Section id="went-wrong" eyebrow="Failures" title="Three things that went wrong">
        <p className="prose-col -mt-2 text-[0.9375rem] text-muted">
          One I found, one my users found, one the machine found.
        </p>
        <div className="mt-10 space-y-10">
          {failures.map(({ found, title, body }) => (
            <div key={title} className="rounded-xl border border-line border-l-[3px] border-l-clay bg-surface p-6 sm:p-7">
              <p className="label">{found}</p>
              <h3 className="mt-2.5 text-lg font-semibold tracking-tight">{title}</h3>
              <p className="prose-col mt-3.5 leading-relaxed text-ink-soft">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------- Where it is */}
      <Section id="where-it-stands" eyebrow="Today" title="Where it stands">
        <p className="prose-col">
          500+ students, live payments, 5,003 questions in the bank, 295 published tests
          and 376 lessons, all of it running on{" "}
          <strong className="font-semibold text-ink">
            one application instance and one database
          </strong>
          .
        </p>
        <p className="prose-col mt-5">
          Every piece of that was a decision with a cost attached, and I wrote the costs down.
        </p>
        <dl className="prose-col mt-7 space-y-5">
          {tradeoffs.map(([head, tail]) => (
            <div key={head} className="text-[0.9375rem] leading-relaxed">
              <dt className="inline font-medium text-ink">{head}</dt>
              <dd className="inline text-ink-soft"> {tail}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* ------------------------------------------------------------- Method */}
      <Section id="checking" eyebrow="Method" title="How I check my own work">
        <div className="prose-col space-y-4">
          <p>
            I work fast, and I use the tools that make me faster, AI among them. That part is
            not interesting. What matters is who checks the result, and on this project that
            was only ever going to be me.
          </p>
          <p>So I check a claim before I make it. Four times that changed what shipped.</p>
        </div>
        <ul className="prose-col mt-6 space-y-4">
          {[
            "A percentile I was showing students was invented. I removed the metric rather than keep a number that looked impressive and meant nothing.",
            "I was about to write that I had added code splitting to the React app. It was a fair guess and I nearly wrote it down. One production build showed 50 chunks already there.",
            "I nearly added a check to my test suite that duplicated one already in it. Padding a test suite is the same mistake as padding a resume.",
            "I was told the migration count was 73. It is 72. The extra one is a lock file.",
          ].map((item) => (
            <li key={item.slice(0, 24)} className="flex gap-3.5">
              <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span className="leading-relaxed text-ink-soft">{item}</span>
            </li>
          ))}
        </ul>
        <p className="prose-col mt-6">
          That last one is trivial, and that is exactly why it is on the list. The habit is
          not caring about the big claims. It is checking the small ones, because the small
          ones are where you stop looking.
        </p>
      </Section>

      {/* ----------------------------------------------------------- The stack */}
      <Section id="stack" eyebrow="Detail" title="The stack">
        <dl className="divide-y divide-line-soft border-y border-line-soft">
          {stack.map(([layer, items]) => (
            <div key={layer} className="grid gap-1.5 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="label pt-0.5">{layer}</dt>
              <dd className="text-[0.9375rem] leading-relaxed text-ink-soft">{items}</dd>
            </div>
          ))}
        </dl>
        <p className="prose-col mt-8">
          <strong className="font-semibold text-ink">
            All of the infrastructure was new to me when I started.
          </strong>{" "}
          AWS end to end, Docker, Caddy and certificate management, GitHub Actions, SSM,
          Razorpay, Prisma, writing migrations that run against live data, and operating
          anything in production at all. I learned each of them on this project and I am
          comfortable in all of them now.
        </p>
      </Section>

      {/* ---------------------------------------------------------- The source */}
      <Section id="source" eyebrow="One more thing" title="A note on the source">
        <div className="prose-col space-y-4">
          <p>
            The source is private, and that is a deliberate call. My deployment documentation
            names enough live infrastructure to be a useful map for anyone who went looking,
            and the system holds students&rsquo; personal and payment records. Publishing it
            would trade their security for my convenience.
          </p>
          <p>
            I will walk through any part of it on a call with my screen shared, which proves
            more than a repository link would anyway.
          </p>
        </div>
      </Section>

      {/* -------------------------------------------------------------- Close */}
      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-line py-10">
        <p className="font-mono text-xs text-muted">Figures as of October 2026.</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <Link
            href="/work/entrance-ug/engineering"
            className="font-medium underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent"
          >
            Engineering notes →
          </Link>
          <a
            href={LIVE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            Visit the live site ↗
          </a>
          <Link
            href="/#work"
            className="text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            ← All work
          </Link>
        </div>
      </div>
    </article>
  );
}
