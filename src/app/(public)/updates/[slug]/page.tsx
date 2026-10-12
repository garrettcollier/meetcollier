import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const instant = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Update not found: ${slug}`, robots: { index: false, follow: false } };
}

export default async function UpdateDetailPage({ params }: Props) {
  await params;
  notFound();
}
