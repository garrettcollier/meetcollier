import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const instant = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Event not found: ${slug}`, robots: { index: false, follow: false } };
}

export default async function EventDetailPage({ params }: Props) {
  await params;
  notFound();
}
