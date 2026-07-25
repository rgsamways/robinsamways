import type { Metadata } from "next";
import BuildingDetail from "@/components/farpost-atlas/BuildingDetail";

export const metadata: Metadata = {
  title: "Farpost Atlas · Robin Samways",
};

export default async function FarpostAtlasBuildingPage({
  params,
}: {
  params: Promise<{ buildingId: string }>;
}) {
  const { buildingId } = await params;
  return <BuildingDetail buildingId={Number(buildingId)} />;
}
