const API_URL = process.env.NEXT_PUBLIC_FARPOST_PULSE_API_URL ?? "http://localhost:7071";

export type SnapshotStat = {
  label: string;
  value: number | null;
  unit: string;
};

export type Tech = {
  id: string;
  name: string;
  role: string;
  snapshotStat: SnapshotStat;
  jobCount: number;
};

export type Job = {
  id: string;
  techId: string;
  propertyType: string;
  date: string;
  photosRequired: number;
  photosTaken: number;
  anglesRequired: string[];
  anglesMissed: string[];
  nfcTagsExpected: number;
  nfcTagsScanned: number;
  turnaroundHours: number;
};

export type CoachingTipResponse = {
  tip: string;
  generatedAt: string;
  basedOnJobIds: string[];
};

export type DashboardPatterns = {
  techCompletionRates: { techId: string; techName: string; tagCompletionRate: number | null }[];
  mostMissedAngleOrgWide: string | null;
  avgTurnaroundHoursOrgWide: number | null;
  turnaroundTrendOrgWide: "improving" | "stable" | "declining";
};

export async function getTechs(): Promise<Tech[]> {
  const response = await fetch(`${API_URL}/api/techs`);
  if (!response.ok) throw new Error("request failed");
  return response.json();
}

export async function getTechJobs(techId: string): Promise<Job[]> {
  const response = await fetch(`${API_URL}/api/techs/${techId}/jobs`);
  if (!response.ok) throw new Error("request failed");
  return response.json();
}

export async function generateCoachingTip(techId: string): Promise<CoachingTipResponse> {
  const response = await fetch(`${API_URL}/api/coaching/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ techId }),
  });
  if (!response.ok) throw new Error("request failed");
  return response.json();
}

export async function getDashboardPatterns(): Promise<DashboardPatterns> {
  const response = await fetch(`${API_URL}/api/dashboard/patterns`);
  if (!response.ok) throw new Error("request failed");
  return response.json();
}
