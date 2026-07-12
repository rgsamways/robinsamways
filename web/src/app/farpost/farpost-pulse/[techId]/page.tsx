import type { Metadata } from "next";
import TechDetail from "@/components/farpost-pulse/TechDetail";

export const metadata: Metadata = {
  title: "Farpost Pulse · Robin Samways",
};

export default async function TechDetailPage({
  params,
}: {
  params: Promise<{ techId: string }>;
}) {
  const { techId } = await params;
  return <TechDetail techId={techId} />;
}
