import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Entrance UG — engineering notes",
  description:
    "Ten decisions from building Entrance UG, and in each case the thing I did not do.",
};

const LIVE_URL = "https://learn.entranceug.com";

/* ---------------------------------------------------------------------------
   Content. Anchors are stable and are pasted into conversations — do not
   rename an id once it has shipped.
   --------------------------------------------------------------------------- */

type Block =
  | { kind: "p"; text: string }
  | { kind: "lead"; text: string }
  | { kind: "code"; text: string }
  | { kind: "list"; items: { head?: string; text: string }[] }
  | { kind: "table"; head: string[]; rows: string[][] };

type Note = { num: string; id: string; title: string; body: Block[] };

const notes: Note[] = [
  {
    num: "01",
    id: "schema",
    title: "Four pillars, or one table?",
    body: [
      {
        kind: "p",
        text: "Students do four separate things here: sit mock exams, work through a course library, do daily reading drills, and join mentorship batches. All four involve sitting a test, getting marked, and seeing analysis.",
      },
      {
        kind: "p",
        text: "So the obvious schema is one attempts table with a type column, one questions table, one answers table. Less code, fewer migrations, one place to fix a bug.",
      },
      {
        kind: "p",
        text: "I went the other way. Each of the four owns its own questions, attempts and analytics tables. Four sets of near-identical tables, which looks like exactly the duplication you are taught to avoid.",
      },
      {
        kind: "p",
        text: "Two reasons. A shared table means every query carries a filter it can forget, and forgetting it does not throw an error. It returns somebody else's data. And one index then has to serve four different access patterns, when the one that matters for mock exams is not the one that matters for a daily drill. Keeping them apart means a feature touches one pillar and cannot corrupt another.",
      },
      {
        kind: "lead",
        text: "What it cost me, and this bill came due months later: the four question tables drifted.",
      },
      {
        kind: "p",
        text: "They were supposed to be near-identical and they were not. Reading comprehension has no topic or difficulty, because its passage is the test. Mentorship needs two author columns, because either a mentor or an admin can write a question. Three bugs came out of those differences. The nastiest was a TypeScript trap worth knowing about: a Prisma create is not type-checked through a spread, because the input is a union type and a spread skips excess-property checks. So create({ data: { ...common } }) compiles fine and fails on the query.",
      },
      {
        kind: "p",
        text: "The fix was not to merge the tables. It was to stop trusting my own reading of the schema. One check module now runs every pillar-to-pillar combination against a real database, sixteen of them, so the next drift shows up as a failing check rather than a broken question.",
      },
      {
        kind: "p",
        text: "Would I do it again? Yes, but I would have written that check on day one instead of month three.",
      },
    ],
  },
  {
    num: "02",
    id: "payments",
    title: "The receipt that isn't a receipt",
    body: [
      {
        kind: "lead",
        text: "The whole payment system is built around one rule: money and access can never disagree.",
      },
      {
        kind: "p",
        text: "When a student pays, Razorpay hands the browser a signed token. The obvious thing to do, and the thing every quickstart shows you, is verify the signature and grant access. The signature is cryptographically sound, so what else do you need?",
      },
      {
        kind: "p",
        text: "Quite a lot, it turns out. That token proves a payment id belongs to an order id. That is all it proves. It does not tell you the money was actually captured rather than just authorised. It does not tell you the amount, or the currency. And an authorised-but-uncaptured payment produces a byte-identical signature to a captured one, so you cannot tell them apart by looking harder.",
      },
      {
        kind: "p",
        text: "So I stopped treating the browser as a source of truth. The signature is checked for authenticity and then set aside as evidence. The server asks Razorpay directly what happened to that payment, and checks the capture status, amount and currency against the order it created itself. A short payment is refused, and the shortfall is recorded rather than dropped, because somebody has paid something and that fact has to survive somewhere.",
      },
      {
        kind: "p",
        text: "There is a related decision I am glad I made: there is no \"mark as paid\" button anywhere in the admin console. Whether money moved is a question for Razorpay, not a judgement call for whoever is on support that day.",
      },
      {
        kind: "p",
        text: "Then there is the replay. I found this one myself, before launch, and it is the bug I would most want to be asked about. Nothing in Razorpay's signature ages, and my settlement code worked out the access expiry from the current time on every run. So re-posting the same signature a month later bought another month. From one payment, forever.",
      },
      {
        kind: "p",
        text: "The lazy fix is a processed boolean. I did not do that, because a flag is a race. Razorpay sends two different events for every capture, the browser reports the payment too, and webhooks retry, so one payment can start three settlements inside the same second and all three read false.",
      },
      {
        kind: "p",
        text: "Instead, expiry is measured from the moment the payment was captured, written once, and never moved. Settling the same payment twice computes the same answer both times.",
      },
      {
        kind: "lead",
        text: "It is idempotent because the arithmetic cannot give you anything else, not because something is standing guard.",
      },
      {
        kind: "p",
        text: "I proved the bug before fixing it: wound a purchase back to five days remaining, replayed the signature, and watched the expiry jump 24 days into the future.",
      },
    ],
  },
  {
    num: "03",
    id: "reconciliation",
    title: "The webhook that never came",
    body: [
      {
        kind: "p",
        text: "Webhooks get dropped. A student approves a UPI payment in their banking app ten minutes after closing the tab, or the webhook is misconfigured at launch and nobody notices for a day. Either way you are holding an order id and nothing else.",
      },
      {
        kind: "p",
        text: "The standard answer is to retry the webhook, and Razorpay does retry. But retries only help if the message was sent. If it never arrived at all there is nothing to retry, and the student who paid has no access and no way to get it except emailing support.",
      },
      {
        kind: "p",
        text: "So there is an hourly sweep. It picks up any checkout that has gone quiet for twenty minutes, asks the order what happened to it rather than asking about a payment id it does not have, finds the attempt that actually paid, and runs it through the same settlement path the webhook would have used.",
      },
      {
        kind: "p",
        text: "The design rule I held to: the sweep introduces no new trust. Razorpay is still the only thing allowed to say money moved. It closes a checkout as abandoned only once Razorpay confirms nothing was captured, and if Razorpay cannot be reached it decides nothing at all rather than guessing in either direction.",
      },
      {
        kind: "lead",
        text: "What that buys is a guarantee I can state in one line: a dropped webhook costs an hour's delay, never a lost payment.",
      },
      {
        kind: "p",
        text: "One thing I got wrong on the way here. My first webhook handler claimed the event before acting on it, which stops double grants and introduces something worse. If the first attempt died after claiming, say a deploy or a database blip, the retry found the claim, decided it was a duplicate, and dropped it. The student who paid never got access and nothing was left to try again. The distinction that fixed it: losing the insert is not the same as being a duplicate. Only a finished event ends a retry.",
      },
      {
        kind: "p",
        text: "Refunds turned out to be harder than payments, which I was not expecting. A fully refunded payment still reports its original amount, so every check passes and the grant runs again. Buy, refund, replay, keep the course. Two refunds arriving at once both read the running total into memory and wrote it back, so one quietly vanished. And because \"is this fully refunded?\" came off that same stale read, a payment refunded in full across two partials never took access back. Money fully returned, course fully delivered.",
      },
      {
        kind: "p",
        text: "There are 29 named payment scenarios in the suite now, holding 127 assertions, and they run before every deploy. So a payment regression blocks the release rather than reaching students. The ones worth mentioning are not the happy paths. They are things like an unreachable gateway neither grants nor claims failure, a plan renamed after the sale does not rewrite the receipt, and a checkout split across two accounts gets held for a human rather than guessed at.",
      },
    ],
  },
  {
    num: "04",
    id: "clock",
    title: "A clock is a budget, not a deadline",
    body: [
      {
        kind: "p",
        text: "This is the clearest bug in the project and you do not need any background to see it.",
      },
      {
        kind: "p",
        text: "These exams time each section separately. Thirty minutes for quantitative, thirty for reasoning, and so on. So when an attempt started, I worked out all the deadlines up front: section one ends 30 minutes in, section two at 60, section three at 90. Simple, and it is what a deadline means.",
      },
      {
        kind: "p",
        text: "It is wrong, and it is wrong in the direction that rewards the wrong thing. A student who finishes section one in ten minutes walks into section two with fifty minutes on its clock instead of thirty. The time they saved by working quickly got handed to the next section, which is the opposite of what a sectional paper is for.",
      },
      {
        kind: "p",
        text: "A deadline is a point in time. A sectional allowance is a budget. I had modelled the second as the first. Sections now carry whatever is left of their own clock, plus the moment they were entered. Entering stamps it and sets the deadline to now plus what remains; leaving subtracts what was actually spent. Unused time stays with the section that did not use it.",
      },
      {
        kind: "p",
        text: "The part I am actually proud of is the migration. This shipped while students had attempts in progress, and the easy option would have been to invalidate them and apologise. I did not have to. For every in-flight section I could reconstruct the remaining budget from the deadline it already had, because under the old rule that deadline minus now is exactly the time it had left. Two columns added, nothing removed, so it went out in one deploy and nobody's sitting broke.",
      },
      {
        kind: "p",
        text: "A related hole in the same area, which I only found because I went looking: a paper that forbids going back to a section still let you jump from section one to section four, quietly closing two sections the student never saw. Forward movement was allowed unconditionally, so both settings were only half a rule. That is checked on the server now, because a rule only the browser knows is not a rule.",
      },
    ],
  },
  {
    num: "05",
    id: "snapshot",
    title: "What an admin can do to a student mid-paper",
    body: [
      {
        kind: "p",
        text: "Here is a scenario I did not think about until late: an admin notices a wrong answer key and fixes it while forty students are halfway through that paper.",
      },
      {
        kind: "p",
        text: "What happened in my first version was ugly. Submit scored against the current question, while the review page rendered what the student had actually seen. So those students got marked against a key that did not exist when they answered, and were then shown the old one. Two students who picked the same option scored differently depending on which side of the edit they submitted.",
      },
      {
        kind: "lead",
        text: "The decision: an attempt is marked against its own snapshot, never the live question.",
      },
      {
        kind: "p",
        text: "Every attempt copies the answer key, the question type and the marks onto its own rows when it starts, and scoring reads only those. An attempt is a record of what it was marked against.",
      },
      {
        kind: "p",
        text: "The obvious objection is that you now cannot fix a genuinely wrong key, and that is true. So fixing one is a deliberate admin action that re-scores every affected attempt, rebuilds the analytics and the ranks, and leaves a trail. Which is the right shape: correcting marks should be a decision somebody makes on purpose, not a side effect of editing a row.",
      },
      {
        kind: "p",
        text: "The same thinking runs through the question bank. A question lives in a catalogue, and each test holds its own copy. Editing the catalogue does not silently rewrite papers that already went out. Pushing an edit into the tests a question sits in is something you opt into, and it needs the right to change every one of those tests or it is refused, because a test left behind would show the old wording while the bank showed the new.",
      },
    ],
  },
  {
    num: "06",
    id: "analysis",
    title: "Knowing when not to answer",
    body: [
      {
        kind: "p",
        text: "This is the part I thought hardest about, and the decisions here are all about not showing something.",
      },
      {
        kind: "p",
        text: "After a student submits a paper they get a short written brief: what worked, what did not, what marks were on the table. Easy to build, and easy to build badly, because the most common piece of advice in test prep is to attempt more questions. On a paper with negative marking, that advice is wrong more often than it is right.",
      },
      { kind: "p", text: "So before the brief ever says it, it does the arithmetic:" },
      {
        kind: "code",
        text: "expected value of attempting the blanks\n  = (strike rate × marks per question)\n    − ((1 − strike rate) × negative marks)",
      },
      {
        kind: "p",
        text: "A student converting 70% gains from attempting more. A student converting 25% loses from it. Two students can leave exactly the same number of blanks and need opposite advice. And when the arithmetic says they were right to leave them, the brief says so: leaving those blanks was the right call, guessing them would have cost you 3 marks. Accuracy has to come up before coverage does.",
      },
      {
        kind: "p",
        text: "Every finding is priced in marks rather than counted in questions, for the same reason.",
      },
      {
        kind: "lead",
        text: "The harder decision was knowing when to shut up.",
      },
      {
        kind: "p",
        text: "A full-length paper might carry 60 questions across 25 subtopics, so roughly two questions per subtopic. Ranking a topic on two questions is not analysis, it is noise. One lucky guess moves a topic-accuracy figure by 33 points. Every competitor does this anyway, because a page full of topic percentages looks thorough.",
      },
      {
        kind: "p",
        text: "I put an evidence threshold in instead. A cluster has to carry at least 8% of the paper's questions before the brief will judge it, and anything under that is left out and listed at the bottom, so you can see what was skipped rather than assuming everything was considered. Subtopics never get judged off a single paper at all. The numbers are still there to read. The platform just does not draw a conclusion from them.",
      },
      {
        kind: "p",
        text: "Two things I deleted, which is the part of this section I would actually defend in an interview.",
      },
      {
        kind: "list",
        items: [
          {
            head: "A percentile I was showing students was invented.",
            text: "Not wrong. Invented. When I went to check how it was computed, there was no real cohort behind it. I removed the metric rather than keep a number that looked impressive and meant nothing.",
          },
          {
            head: "A reading speed was arithmetic pretending to be measurement.",
            text: "I was working out reading time as total time minus time spent on questions. But a comprehension paper shows the passage next to the question, and the per-question stopwatch charges time to whichever question is on screen. So the minutes actually spent reading got billed to question one and then subtracted away again. A 347-word passage came out at 1096 words per minute, and students saw that as if it were a measurement.",
          },
        ],
      },
      {
        kind: "p",
        text: "It is measured properly now, from things the browser can honestly observe: scrolling, text selection, touch, pointer position, whether the passage is even on screen. The rule it is built around is that question navigation is never a reading signal. Clicking from question one to question two does not start the reading clock, does not stop it, and does not mean the passage was read. Reading the questions first is a strategy, not a finished read.",
      },
      {
        kind: "p",
        text: "And it refuses to answer when it cannot. Three states: measured, estimated, or not measured with a reason. \"Not measured\" is a real answer and the one I would rather give.",
      },
      {
        kind: "lead",
        text: "A precise-looking number nobody can defend is worse than an honest gap.",
      },
      {
        kind: "p",
        text: "One honest note: the thresholds in there are first guesses, not settled science. I picked them before there was real data to calibrate against, which is why every attempt keeps its full event timeline. I can test a change against attempts that already happened instead of waiting for new ones.",
      },
    ],
  },
  {
    num: "07",
    id: "importer",
    title: "A dry run that can't lie",
    body: [
      {
        kind: "p",
        text: "The original way to get content in took one level at a time: create a test, then create sections naming that test, then create questions naming those sections. Which meant 280 reading-comprehension passages was 280 separate uploads, and the client's team was doing that by hand.",
      },
      {
        kind: "p",
        text: "So I built an importer that takes one file carrying a whole test and works out the rest, across all four pillars. The interesting decisions are not the file format.",
      },
      {
        kind: "lead",
        text: "The dry run and the real run are the same code path.",
      },
      {
        kind: "p",
        text: "Not a preview that approximates what would happen. Literally the same code, with the writes held back. I did it that way because a separate preview implementation is a thing that drifts, and the first time it drifts somebody imports 2,000 questions on the strength of a report that was describing different behaviour. Every create, update, skip and error is listed before anything is written, so nothing lands that was not shown first.",
      },
      {
        kind: "p",
        text: "Each test is its own transaction, so it lands whole or not at all. And a test a student has already sat is refused outright, which was a decision rather than a limitation. The alternative is changing a paper underneath a cohort partway through. Mock exams are the one exception, because those genuinely need new versions, so a fresh paper is composed for future attempts while existing attempts keep the snapshot they were marked against.",
      },
      {
        kind: "p",
        text: "Scheduling carries across split requests. A 280-passage file is too big for one request, so the page splits it into pieces, and the schedule offset carries from one piece to the next. It lands as one unbroken daily run rather than six overlapping ones. That is a small thing that took a while to get right and would have been very annoying to discover in production.",
      },
      {
        kind: "p",
        text: "The measurable outcome: the bank holds 5,003 questions, and 99.7% of them arrived through bulk writes rather than one form at a time. 178 distinct write seconds in total, the busiest of them carrying 122 questions.",
      },
    ],
  },
  {
    num: "08",
    id: "permissions",
    title: "Areas, not roles",
    body: [
      {
        kind: "p",
        text: "The client has sub-admins, and they should not all see everything. Whoever is uploading passages has no business in the revenue console.",
      },
      {
        kind: "p",
        text: "The quick version of this is a role column: admin, content_admin, finance_admin. It falls over the first time somebody needs two of them and a bit of a third, and then you are adding roles for every combination.",
      },
      {
        kind: "p",
        text: "So permissions are areas instead. 16 of them, granted one at a time from a matrix. Every admin page, sidebar entry and endpoint belongs to exactly one area, and the rule I hold to is that nothing new is visible to every sub-admin by default. Adding a surface means gating it in three places in the same commit: the API, which is the real gate; the sidebar; and the route table, so pasting a URL you do not hold shows a page naming the area you would need rather than a screen full of failed requests.",
      },
      {
        kind: "p",
        text: "The combinations are where it gets interesting. An ad campaign report shows every click to anyone holding ads, but only names the students who clicked if they also hold members. That is two areas composing into a third behaviour, which a role column cannot express at all.",
      },
      {
        kind: "p",
        text: "Two powers I deliberately refused to make grantable. Managing other admins, because anyone who could do that could grant themselves everything or promote themselves. And the platform's own request latency and error rates, because route-level timings span every pillar at once, including the ones the person reading them has no area for. When I added the second one I wrote down why it is not an area, so whoever reads it later can tell a decision from an omission.",
      },
      {
        kind: "p",
        text: "Mentors sit outside this entirely. They hold no areas and see only the batches assigned to them, and that scoping lives in the service rather than the route, so every id a mentor passes gets re-checked against their own batches. Another batch's test is actively refused, not just missing from a list.",
      },
      {
        kind: "p",
        text: "That distinction caught a real bug. A student can sit in several batches under several mentors, and the code behind a doubt and an attempt scoped by student, which is right for a student and wrong for a mentor. So a mentor who shared one student with a colleague could read that student's work from the colleague's batch by pasting an id. I found it by firing every route in the system with credentials that should not open it: wrong role, and the case a UI can never test for you, right role holding somebody else's id. Roughly 1,683 negative cases.",
      },
      {
        kind: "p",
        text: "Worth being precise: that was a sweep I ran once, not a standing harness. Making it standing is on my list, because only something that re-enumerates routes can catch the next un-gated one.",
      },
    ],
  },
  {
    num: "09",
    id: "hosting",
    title: "Three attempts at where this runs",
    body: [
      {
        kind: "p",
        text: "Budget: tight, and set by the client. Developers: one, who had never deployed anything to production before. So the plan was managed hosting, obviously. Let somebody else own the servers.",
      },
      {
        kind: "list",
        items: [
          {
            head: "Attempt one: AWS App Runner.",
            text: "Containers, managed, no instances to think about. Turns out AWS had stopped accepting new App Runner customers months earlier. It simply was not available to this account, and nothing said so until I tried.",
          },
          {
            head: "Attempt two: Lightsail containers.",
            text: "Created it, and it hung partway through issuing its TLS certificate. Stayed stuck for days. Could not be deleted. My support case went unanswered.",
          },
          {
            head: "Attempt three: a plain EC2 instance with Caddy in front of it.",
            text: "The least fashionable option of the three. I chose it because every step of bringing the site up is something I can watch happen from a shell and retry if it fails. No managed workflow left to get stuck inside. Caddy handles TLS with a Let's Encrypt certificate it renews itself.",
          },
        ],
      },
      {
        kind: "p",
        text: "What it costs me, and I would rather say it than have it found: one instance is one point of failure, OS patching is mine, and a deploy is a restart. So a deploy that fails to start is an outage until I fix it or roll back. The managed options I could not use would have kept the old version serving. That is the trade, and a second instance is the first thing I would change if availability became a requirement rather than a preference.",
      },
      {
        kind: "p",
        text: "Two smaller decisions inside that one. Deploys reach the instance through SSM rather than SSH, which means no bastion, no inbound shell port, and no key material sitting in CI. And nothing in the Dockerfile knows what it is running on, because it takes configuration from the environment and nothing else. That is the only reason moving hosts twice cost me a workflow rewrite instead of a rebuild, and it is why the third attempt took hours rather than days.",
      },
    ],
  },
  {
    num: "10",
    id: "migrations",
    title: "One deploy, or two?",
    body: [
      {
        kind: "p",
        text: "Migrations run inside the container when it starts, so a migration that fails takes the API down with it, and there is no second instance still serving the old version.",
      },
      {
        kind: "lead",
        text: "Which forces a rule I would otherwise have taken years to learn properly: anything destructive gets split across two deploys.",
      },
      {
        kind: "p",
        text: "First ship the code that stops using the column and confirm it is live. Then ship the migration that drops it. One deploy doing both means the old container is serving reads against a schema that no longer has the column, for however many seconds the handover takes. Adding columns is safe in one.",
      },
      {
        kind: "p",
        text: "This is expand and contract, and I got to it from the constraint rather than from a blog post, which is why I can tell you what it costs. It is slower, it is twice as many deploys, and I have definitely sat there wanting to just do it in one.",
      },
      {
        kind: "p",
        text: "72+ migrations against live student data so far, no data loss. I read the generated SQL before every commit, because that is the thing that is actually going to run against real students' rows.",
      },
      {
        kind: "p",
        text: "There is a related decision about the deploy itself. The verification suite used to be something I ran out of habit. Now the deploy workflow runs it first and will not build or push an image unless it passes, so a payment or scoring regression blocks the release instead of reaching students. It went from a habit to a gate, and that is the difference that matters.",
      },
      {
        kind: "p",
        text: "On that suite, honestly: it is hand-rolled, 47 check modules, no coverage reporting, no framework. An engineer spots that in ten seconds so I would rather say it first. What it does have is that every check runs a real service function against a real database and asserts on the rows that came out. No mocks, so a check cannot pass against a fiction. It builds its own fixtures and destroys them afterwards, which is what makes it safe to point at a database with real data in it, and it refuses to run against production at all.",
      },
    ],
  },
  {
    num: "11",
    id: "details",
    title: "Five smaller things I'd point at",
    body: [
      {
        kind: "p",
        text: "Not decisions big enough for their own section, but they are the ones I would actually bring up.",
      },
      {
        kind: "list",
        items: [
          {
            head: "Rate limits are per account, not per IP.",
            text: "A school or coaching-centre connection presents one address for a whole room of students, so limiting by IP would throttle a classroom sitting the same mock. The submit limit is deliberately low, because submitting happens once per attempt in normal use, so a low ceiling also blunts the obvious abuse.",
          },
          {
            head: "A deploy died on a full disk, and the cleanup was gated behind the step that needed it.",
            text: "There was a prune step. It ran after the new container reported healthy, and only for week-old images. Pulling the image is the step before that. So once the disk filled, the pull died, the prune never ran, and every retry failed in exactly the same place.",
          },
          {
            head: "The same student was showing three different streaks",
            text: "on the student, admin and parent views. Streaks had been converted to count consecutive IST days in one place and left on the old rule in two others. The rule I took from it: when you change something shared, go and find every reader of it.",
          },
          {
            head: "Students saw somebody else's name on their dashboard.",
            text: "The API sent no cache-control header, and in production every API call passes through the CDN that serves the website. So a shared cache was free to keep one student's \"who am I\" response and hand it to the next person who asked. Neither component was broken. The API was permissive and the CDN was doing what CDNs do, and the bug lived in between them. Two correct components can compose into an incorrect system, and that class of bug is invisible to code review and unit tests. You can only see it if you can describe the request path end to end.",
          },
          {
            head: "One builder serves four pillars for reading, and four separate writers for writing.",
            text: "Reading, reordering and deleting go through one module with adapters. Writing deliberately still goes to each pillar's own endpoints, because those carry validation that already works, and re-implementing it in a fifth place is exactly how four ecosystems quietly drift apart again.",
          },
        ],
      },
    ],
  },
  {
    num: "12",
    id: "tradeoffs",
    title: "What I'd change",
    body: [
      {
        kind: "p",
        text: "Each of these was a decision with a reason, and I wrote down what would make me revisit it. That is the difference between a constraint and an oversight.",
      },
      {
        kind: "table",
        head: ["What's missing", "Why", "What would change it"],
        rows: [
          [
            "A second instance",
            "Roughly doubles the compute bill, which the budget did not allow for.",
            "Availability becoming a requirement rather than a preference. First thing I'd change.",
          ],
          [
            "Redis, a queue, a worker, any cache",
            "Nothing in the workload needs one at this size. Postgres is the only service, and one fewer moving part is one fewer thing to operate alone.",
            "A genuinely asynchronous workload — bulk email, report generation — rather than one I've assumed is.",
          ],
          [
            "A private network",
            "The gateway alone would roughly double the bill, so it was declined for launch. TLS and credentials do the work instead of network isolation.",
            "Any growth in how sensitive the stored data is, or the budget admitting it.",
          ],
          [
            "A separate worker for background jobs",
            "Two jobs on a timer in-process is correct at one instance.",
            "A second instance. Every write they make is already idempotent, which makes that an addition rather than a rewrite.",
          ],
          [
            "A load test",
            "Haven't done one.",
            "Nothing. This is just next. I don't know how the submit path behaves when forty students submit in the same minute, and I'd like to.",
          ],
        ],
      },
      {
        kind: "p",
        text: "There is request-latency instrumentation behind an admin endpoint, but it has not carried enough traffic for me to quote a number I would stand behind, so there is not one anywhere on this page.",
      },
    ],
  },
  {
    num: "13",
    id: "talk",
    title: "If you want to dig into any of this",
    body: [
      {
        kind: "p",
        text: "The source is private, and that is my call. My deployment documentation names enough live infrastructure to be a useful map for anyone who went looking, and the system holds students' personal and payment records. Publishing it would trade their security for my convenience.",
      },
      {
        kind: "p",
        text: "What I would rather offer is a screen share. Four things here are better to talk through than to read, because each one has a wrong version I can show you first:",
      },
      {
        kind: "list",
        items: [
          { head: "The settlement path,", text: "end to end, and what the replay looked like before it was closed." },
          { head: "The sectional clock,", text: "including how the migration carried live attempts across." },
          { head: "The reading-pace timeline", text: "of a real attempt, and why not measured is the better answer." },
          { head: "A deploy,", text: "live, including the rollback." },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ renderer */

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "p":
            return (
              <p key={i} className="mt-4 leading-relaxed text-ink-soft">
                {block.text}
              </p>
            );
          case "lead":
            return (
              <p key={i} className="mt-5 border-l-2 border-accent pl-5 text-[1.0625rem] leading-relaxed text-ink">
                {block.text}
              </p>
            );
          case "code":
            return (
              <pre
                key={i}
                className="mt-5 overflow-x-auto rounded-xl border border-line bg-surface p-5 font-mono text-[0.8125rem] leading-relaxed text-ink-soft"
              >
                {block.text}
              </pre>
            );
          case "list":
            return (
              <ul key={i} className="mt-5 space-y-3.5">
                {block.items.map((item) => (
                  <li key={item.text.slice(0, 24)} className="flex gap-3.5">
                    <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span className="leading-relaxed text-ink-soft">
                      {item.head ? <strong className="font-medium text-ink">{item.head} </strong> : null}
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "table":
            return (
              <div key={i} className="mt-6 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      {block.head.map((cell) => (
                        <th key={cell} className="label py-3 pr-5 align-bottom font-normal">
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={row[0]} className="border-b border-line-soft align-top">
                        <td className="py-4 pr-5 font-medium text-ink">{row[0]}</td>
                        <td className="py-4 pr-5 leading-relaxed text-ink-soft">{row[1]}</td>
                        <td className="py-4 leading-relaxed text-ink-soft">{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </>
  );
}

export default function EngineeringNotesPage() {
  return (
    <article className="mx-auto max-w-5xl px-5 sm:px-8">
      {/* ---------------------------------------------------------------- Hero */}
      <header id="top" className="hero-wash scroll-mt-24 py-12 sm:py-16">
        <Link
          href="/work/entrance-ug"
          className="font-mono text-xs text-muted transition-colors hover:text-accent"
        >
          ← Back to the case study
        </Link>

        <p className="label mt-8">Entrance UG · Engineering notes</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Ten decisions, and what I didn&rsquo;t do
        </h1>

        <div className="prose-col mt-6 space-y-4">
          <p className="text-lg">
            Ten decisions I made building Entrance UG, and in each case the thing I did not
            do. That second half is the interesting half, so it is in all of them.
          </p>
          <p>
            Worth saying up front: this is one person&rsquo;s platform running on one
            application instance and one database. Nothing here is web-scale, and none of
            these were problems of scale. What made them hard was money and time. A payment
            system where being wrong costs a student real money, and a timed exam engine where
            the clock is the product.
          </p>
          <p>
            None of it needs reading in order.{" "}
            <Link
              href="/work/entrance-ug"
              className="text-ink underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent"
            >
              The case study has the story and the timeline
            </Link>{" "}
            if you would rather have the narrative.
          </p>
        </div>
      </header>

      {/* ------------------------------------------------------------------ TOC */}
      <nav aria-label="On this page" className="border-y border-line py-8">
        <p className="label">On this page</p>
        <ol className="mt-5 grid gap-x-10 gap-y-2.5 sm:grid-cols-2">
          {notes.map((note) => (
            <li key={note.id} className="flex gap-3 text-[0.9375rem]">
              <span className="pt-1 font-mono text-xs tabular-nums text-clay">{note.num}</span>
              <a
                href={`#${note.id}`}
                className="text-ink-soft underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {note.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ---------------------------------------------------------------- Notes */}
      <div className="divide-y divide-line">
        {notes.map((note) => (
          <section key={note.id} className="py-14 sm:py-16">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-sm font-medium tabular-nums text-clay">{note.num}</span>
              <h2
                id={note.id}
                className="scroll-mt-24 text-2xl font-semibold tracking-tight sm:text-[1.75rem]"
              >
                {note.title}
              </h2>
            </div>
            <div className="prose-col mt-5 sm:pl-10">
              <Blocks blocks={note.body} />
            </div>
          </section>
        ))}
      </div>

      {/* ---------------------------------------------------------------- Close */}
      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-line py-10">
        <p className="font-mono text-xs text-muted">Figures as of October 2026.</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <a
            href={LIVE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent"
          >
            Visit the live site ↗
          </a>
          <Link
            href="/work/entrance-ug"
            className="text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            ← Back to the case study
          </Link>
        </div>
      </div>
    </article>
  );
}
