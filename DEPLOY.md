# Running and deploying this site

Three parts: run it on your machine, put it on Vercel, point your own domain at it.

---

## 1. Run it locally

```bash
cd D:\projects\PORTFOLIO
npm run dev
```

Open **http://localhost:3000**.

The dev server keeps running and rebuilds on every save, so leave it open in its own
terminal while you edit. **Ctrl+C** stops it. Dependencies are already installed; you only
need `npm install` again if you move the folder to another machine.

To see exactly what Vercel will serve:

```bash
npm run build
npm run start      # http://localhost:3000
```

If `npm run build` fails with a worker crash or "Fatal error", it is this machine running
out of memory, not your code. Close some tabs and run it again. `npm run typecheck` checks
the code on its own and never does this.

---

## 2. Put it on Vercel

### Step 1 — Commit

The repo is already initialized. Before the first commit, confirm nothing private is going
in:

```bash
git status
```

**`_source/` must not appear in that list.** It holds the client docs and a file with live
database credentials. If you ever see it listed, stop and check `.gitignore` still has
`/_source/` in it.

Then:

```bash
git add .
git commit -m "Portfolio site"
```

### Step 2 — Push to GitHub

Create an empty repository at <https://github.com/new>. Do not let GitHub add a README,
a `.gitignore` or a licence — the repo must be empty or the first push is rejected.

Public or private both work with Vercel. Private is fine if you would rather not have the
page source browsable.

Then, with your repo's URL:

```bash
git remote add origin https://github.com/dhruv-ship-it/portfolio.git
git branch -M main
git push -u origin main
```

### Step 3 — Import into Vercel

1. Go to <https://vercel.com> and **sign up with GitHub**. Signing in with GitHub means
   Vercel can see your repositories without any extra setup.
2. **Add New → Project**.
3. Find the repository and click **Import**. If it is not listed, click
   *Adjust GitHub App Permissions* and grant Vercel access to it.
4. On the configure screen, change nothing:
   - Framework Preset — **Next.js** (detected automatically)
   - Root Directory — `./`
   - Build and Output Settings — leave as they are
   - Environment Variables — **none**. This site has no database, no API keys, nothing.
5. Click **Deploy** and wait a minute or two.

You get a URL like `portfolio-xyz.vercel.app`. That URL is live and shareable right away.

### Step 4 — Tell the site its own address

Open [data/site.ts](data/site.ts) and set `url` to the address you will actually give
people — your custom domain if you are adding one, otherwise the `.vercel.app` URL:

```ts
url: "https://dhruvranjan.com",
```

That value feeds the canonical URL, the link preview when you paste it into WhatsApp or
LinkedIn, and `sitemap.xml`. Then:

```bash
git add .
git commit -m "Set site URL"
git push
```

**Every push to `main` deploys automatically from now on.** That is the whole workflow:
edit, commit, push, live in about a minute.

---

## 3. Point your own domain at it

### Buying one

Any registrar works. Worth knowing:

- **Cloudflare Registrar** — sells at wholesale cost with no markup and no first-year
  discount that jumps later. Cheapest over time, but it will not sell you a domain you do
  not already hold elsewhere, so you buy at another registrar and transfer in later.
- **Namecheap** — straightforward, fair renewal prices, easy DNS screen.
- **GoDaddy / BigRock / Hostinger** — fine, but check the **renewal** price, not the
  first-year offer. The gap is often large.

A `.com` is usually ₹1,000–1,500 a year. `.dev` and `.in` are good alternatives and
roughly similar. Something like `dhruvranjan.com` or `dhruvranjan.dev` reads better on a
resume than a hyphenated name.

### Connecting it

1. In Vercel: **your project → Settings → Domains**.
2. Type the domain, e.g. `dhruvranjan.com`, and click **Add**.
3. Vercel then shows you the exact DNS records to create. **Use the values on that screen**,
   not values copied from anywhere else, including this file — Vercel has changed them
   before. There are two ways to satisfy it:

   **Option A — let Vercel run your DNS (simplest).** Vercel gives you two nameservers.
   At your registrar, find *Nameservers* or *DNS settings*, switch from the default to
   *Custom*, and paste both in. Vercel then handles every record for you.

   **Option B — keep your registrar's DNS.** Add the records Vercel lists, typically an
   `A` record on `@` pointing at an IP, and a `CNAME` on `www` pointing at a Vercel
   hostname. Use this one if the domain is also doing something else, such as email.

4. Wait. DNS changes usually take 10–30 minutes and are allowed up to 48 hours. Vercel's
   Domains screen shows a checkmark when it sees the records.
5. **HTTPS is automatic.** Vercel issues and renews the certificate once DNS resolves.
   There is nothing to buy or configure.
6. Pick which address is canonical. Vercel will offer to redirect `www.dhruvranjan.com` to
   `dhruvranjan.com` or the reverse. Either is fine, but choose one so you are not serving
   the same pages at two addresses.
7. Set `url` in [data/site.ts](data/site.ts) to the final domain and push.

### If it does not work

- **"Invalid Configuration" in Vercel** — the DNS record has not propagated yet, or it is
  pointing somewhere else. Check with `nslookup dhruvranjan.com`.
- **Domain shows a registrar parking page** — your registrar left its own default records
  in place. Delete those; a leftover `A` record on `@` will win over the one you added.
- **Works without `www` but not with it, or the reverse** — you added one record and not
  the other. Both need to exist.

---

## Afterwards

Put the live URL on your resume, your LinkedIn profile, and your GitHub profile README.
A portfolio nobody is pointed at does not do any work.
