import Link from "next/link";

export default function NotFound() {
  return <main className="flex min-h-screen items-center justify-center bg-warm-50 px-5 py-16"><div className="max-w-xl text-center"><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">404</p><h1 className="mt-4 font-serif text-5xl font-semibold text-navy-950">That page is not available.</h1><p className="mt-5 text-base leading-7 text-navy-700">It may not have been published, may have moved, or may require authenticated administrative access.</p><Link href="/" className="mt-8 inline-flex rounded-lg bg-navy-950 px-5 py-3 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4">Return home</Link></div></main>;
}
