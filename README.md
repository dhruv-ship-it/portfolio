# Portfolio — Dhruv Ranjan

Next.js (App Router) + TypeScript + Tailwind CSS v4. Statically prerendered, no database,
no client-side JavaScript beyond what Next ships by default.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build, typechecked
npm run typecheck  # types only
```

## Where the content lives

All of it is data, not markup. You should rarely need to touch a page file.

| File | What it holds |
| --- | --- |
| `data/site.ts` | Name, role, tagline, email, social links, resume path, education, About paragraphs, skills |
| `data/projects.ts` | The work index — one entry per card on the home page |
| `app/work/entrance-ug/page.tsx` | The Entrance UG case study copy |
| `app/work/entrance-ug/engineering/page.tsx` | The engineering notes copy |

Fill in all of `site.education` and the Education block appears under About. Leave
`school` empty and it is skipped.

**To add the resume:** save the PDF as `public/dhruv-ranjan-resume.pdf`, then set
`links.resume` to `"/dhruv-ranjan-resume.pdf"` in `data/site.ts`. A Resume button appears
in the header and a link in the footer. While it is `""`, neither is rendered.

Any link in `data/site.ts` left as an empty string is not rendered, so the site is safe to
ship with blanks.

## Adding a project

1. Add an entry to `projects` in `data/projects.ts`.
2. Create `app/work/<slug>/page.tsx` for its detail page, and point `href` at it.
   Copy the Entrance UG page as the starting shape.

A project with no detail page yet can set `href: ""` — the card then only offers the live
link.

## Routes

```
/                                    home — hero, work index, skills, about, contact
/work/entrance-ug                    case study (the story and the timeline)
/work/entrance-ug/engineering        engineering notes (13 deep-linkable sections)
/sitemap.xml  /robots.txt
```

The notes page anchors (`#payments`, `#clock`, `#analysis`, …) are meant to be pasted into
conversations. **Do not rename an id once it has shipped** — it breaks links already out in
the world. The case study deep-links into four of them.

## Deploying

See **[DEPLOY.md](DEPLOY.md)** for the full walkthrough: running it locally, pushing to
GitHub, importing into Vercel, and pointing a custom domain at it.

The short version: push to GitHub, import the repo on vercel.com, deploy. Next.js is
detected automatically, there is nothing to configure and no environment variables. After
the first deploy, put the real address in `site.url` in `data/site.ts`. Every later push
to `main` deploys itself.

## Two things to know

- **`_source/` is gitignored and must stay that way.** It holds the working notes this site
  was written from, the archived v0 template, and `_source/secrets/` — a production
  database connection string and a GitHub token that were sitting in the project root.
  Move those two files somewhere outside this folder when convenient.
- **The Entrance UG case study deliberately has no repository link.** The reason is stated
  on the page itself. Do not add one.
