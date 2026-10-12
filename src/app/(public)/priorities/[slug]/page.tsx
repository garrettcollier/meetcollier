import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const instant = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Priority not found: ${slug}`, robots: { index: false, follow: false } };
}

export default async function PriorityDetailPage({ params }: Props) {
  await params;
  notFound();
}
