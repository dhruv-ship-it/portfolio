import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-28 sm:px-8">
      <p className="label">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        That page does not exist
      </h1>
      <p className="prose-col mt-4">
        The link may be out of date. Everything on this site is reachable from the home page.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-85"
      >
        Go home
      </Link>
    </div>
  );
}
