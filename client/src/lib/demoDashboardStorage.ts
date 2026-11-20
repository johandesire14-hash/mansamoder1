export type DemoPriority = {
  tone: "red" | "amber" | "gray";
  title: string;
  subtitle: string;
  count: string;
  status: string;
};

export type DemoDashboardData = {
  generatedMoney: string;
  generatedMoneyTrend: string;
  activeUsers: string;
  activeUsersTrend: string;
  pendingVerifications: string;
  pendingVerificationsTrend: string;
  creatorRevenue: string;
  creatorRevenueTrend: string;
  chartBars: number[];
  priorities: DemoPriority[];
};

const STORAGE_KEY = "mansa-hub:dashboard-demo-data:v1";

export const DEFAULT_DEMO_DASHBOARD_DATA: DemoDashboardData = {
  generatedMoney: "23 902 $",
  generatedMoneyTrend: "12 %",
  activeUsers: "16 815",
  activeUsersTrend: "8 %",
  pendingVerifications: "47",
  pendingVerificationsTrend: "24 %",
  creatorRevenue: "12 580 $",
  creatorRevenueTrend: "6 %",
  chartBars: [42, 68, 34, 55, 48, 30],
  priorities: [
    {
      tone: "red",
      title: "Contenus haineux",
      subtitle: "Contenus signalés pour discours haineux",
      count: "12",
      status: "Urgent",
    },
    {
      tone: "amber",
      title: "Arnaques potentielles",
      subtitle: "Annonces suspectes à vérifier",
      count: "18",
      status: "À traiter",
    },
    {
      tone: "gray",
      title: "Contenus inappropriés",
      subtitle: "Contenus pour adultes, violence, etc.",
      count: "17",
      status: "En attente",
    },
  ],
};

function isDemoPriority(value: unknown): value is DemoPriority {
  if (typeof value !== "object" || value === null) return false;
  const priority = value as Record<string, unknown>;
  return (
    (priority.tone === "red" || priority.tone === "amber" || priority.tone === "gray") &&
    typeof priority.title === "string" &&
    typeof priority.subtitle === "string" &&
    typeof priority.count === "string" &&
    typeof priority.status === "string"
  );
}

function isDemoDashboardData(value: unknown): value is DemoDashboardData {
  if (typeof value !== "object" || value === null) return false;
  const data = value as Record<string, unknown>;
  const stringFields = [
    "generatedMoney",
    "generatedMoneyTrend",
    "activeUsers",
    "activeUsersTrend",
    "pendingVerifications",
    "pendingVerificationsTrend",
    "creatorRevenue",
    "creatorRevenueTrend",
  ];

  return (
    stringFields.every((field) => typeof data[field] === "string") &&
    Array.isArray(data.chartBars) &&
    data.chartBars.length === 6 &&
    data.chartBars.every(
      (bar) => typeof bar === "number" && Number.isFinite(bar) && bar >= 0 && bar <= 100,
    ) &&
    Array.isArray(data.priorities) &&
    data.priorities.length === 3 &&
    data.priorities.every(isDemoPriority)
  );
}

export function loadDemoDashboardData(): DemoDashboardData {
  if (typeof window === "undefined") return DEFAULT_DEMO_DASHBOARD_DATA;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_DEMO_DASHBOARD_DATA;

    const parsed: unknown = JSON.parse(stored);
    return isDemoDashboardData(parsed) ? parsed : DEFAULT_DEMO_DASHBOARD_DATA;
  } catch {
    return DEFAULT_DEMO_DASHBOARD_DATA;
  }
}

export function saveDemoDashboardData(data: DemoDashboardData): boolean {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
