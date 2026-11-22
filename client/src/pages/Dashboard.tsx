import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  FileCheck2,
  Flag,
  Headphones,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Shield,
  TrendingUp,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_DEMO_DASHBOARD_DATA,
  loadDemoDashboardData,
  saveDemoDashboardData,
  type DemoPriority,
} from "@/lib/demoDashboardStorage";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Signalements", icon: Flag },
  { label: "Utilisateurs", icon: Users },
  { label: "Vérifications", icon: FileCheck2 },
  { label: "Paiements", icon: WalletCards },
  { label: "Entreprises", icon: Building2 },
  { label: "Abonnements", icon: CreditCard },
  { label: "Statistiques", icon: BarChart3 },
  { label: "Journal d’activité", icon: Activity, path: "/activity" },
  { label: "Sécurité & audit", icon: Shield },
  { label: "Paramètres", icon: Settings },
];

function MetricCard({
  label,
  value,
  trend,
  icon: Icon,
  dark = false,
  accent = "green",
}: {
  label: string;
  value: string;
  trend: string;
  icon: typeof CircleDollarSign;
  dark?: boolean;
  accent?: "green" | "red";
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${dark ? "bg-[#242729] text-white" : "bg-white text-[#172033] shadow-[0_8px_24px_rgba(24,35,52,0.04)]"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`text-sm ${dark ? "text-white/65" : "text-[#697586]"}`}>{label}</span>
        <span
          className={`flex size-10 items-center justify-center rounded-xl ${dark ? "bg-white/10 text-white" : "bg-[#f3f5f6] text-[#253044]"}`}
        >
          <Icon className="size-5" />
        </span>
      </div>
      <div className="mt-5 text-[30px] font-bold tracking-[-0.06em]">{value}</div>
      <div
        className={`mt-2 flex items-center gap-2 text-xs font-semibold ${accent === "red" ? "text-[#e25555]" : "text-[#22a45d]"}`}
      >
        <TrendingUp className="size-3.5" />
        {trend}
        <span className={`font-normal ${dark ? "text-white/45" : "text-[#98a2b3]"}`}>
          vs. mois dernier
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation({ onSuccess: () => setLocation("/login") });
  const [mobileNav, setMobileNav] = useState(false);
  const [demoData, setDemoData] = useState(loadDemoDashboardData);
  const [storageAvailable, setStorageAvailable] = useState(true);

  useEffect(() => {
    setStorageAvailable(saveDemoDashboardData(demoData));
  }, [demoData]);

  function resetDemoData() {
    setDemoData({
      ...DEFAULT_DEMO_DASHBOARD_DATA,
      chartBars: [...DEFAULT_DEMO_DASHBOARD_DATA.chartBars],
      priorities: DEFAULT_DEMO_DASHBOARD_DATA.priorities.map((priority) => ({ ...priority })),
    });
  }

  return (
    <div className="min-h-screen bg-[#eef1f4] text-[#172033]">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-30 flex w-[250px] shrink-0 flex-col bg-[#fff] px-4 py-7 transition-transform lg:static lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center gap-3 px-4">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[#1f2326] text-xl font-black text-white">
              M
            </div>
            <span className="text-xl font-bold tracking-[-0.05em] text-[#111827]">Mansa Hub</span>
            <button
              className="ml-auto rounded-lg p-1 text-[#94a3b8] lg:hidden"
              onClick={() => setMobileNav(false)}
              aria-label="Fermer le menu"
            >
              <X className="size-5" />
            </button>
          </div>
          <nav className="mt-9 space-y-1.5" aria-label="Navigation principale">
            {navItems.map(({ label, icon: Icon, active, path }) => (
              <button
                key={label}
                type="button"
                onClick={() => { setMobileNav(false); if (path) setLocation(path); else if (label === "Paiements") setLocation("/payments"); else if (label === "Utilisateurs") setLocation("/users"); }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${active ? "bg-[#eef0f2] font-bold text-[#111827]" : "text-[#657184] hover:bg-[#f7f8f9] hover:text-[#273142]"}`}
              >
                <Icon className="size-[18px]" />
                {label}
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl bg-[#242729] p-5 text-white">
            <div className="flex size-9 items-center justify-center rounded-xl bg-white/10">
              <Headphones className="size-5" />
            </div>
            <p className="mt-4 text-sm font-bold">Support client</p>
            <p className="mt-2 text-xs leading-5 text-white/60">
              Pour les utilisateurs, contacter l’équipe de maintenance.
            </p>
            <button type="button" onClick={() => setLocation("/support")} className="mt-4 flex items-center gap-2 text-xs font-bold text-white">
              Ouvrir la file <ChevronRight className="size-3.5" />
            </button>
          </div>
        </aside>

        {mobileNav && (
          <button
            className="fixed inset-0 z-20 bg-[#16202a]/30 lg:hidden"
            onClick={() => setMobileNav(false)}
            aria-label="Fermer le menu"
          />
        )}

        <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                className="rounded-xl bg-white p-2.5 text-[#425066] shadow-sm lg:hidden"
                onClick={() => setMobileNav(true)}
                aria-label="Ouvrir le menu"
              >
                <Menu className="size-5" />
              </button>
              <div>
                <h1 className="text-[28px] font-bold tracking-[-0.06em] text-[#111827] sm:text-[34px]">
                  Dashboard de modération
                </h1>
                <p className="mt-1 text-sm text-[#7a8595]">
                  Supervisez l’activité de Mansa en un coup d’œil.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm text-[#8993a2] shadow-sm sm:flex">
                <Search className="size-4" />Rechercher...
              </div>
              <button
                className="relative rounded-full bg-white p-3 text-[#273142] shadow-sm"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#e25555]" />
              </button>
              <div className="flex size-10 items-center justify-center rounded-full bg-[#27353d] text-sm font-bold text-white">
                JD
              </div>
            </div>
          </header>

          <div
            className={`mt-5 flex flex-wrap items-center justify-between gap-2 rounded-xl px-4 py-3 text-xs ${storageAvailable ? "bg-[#effaf3] text-[#28784d]" : "bg-[#fff7e8] text-[#9a681b]"}`}
            role="status"
          >
            <span>
              {storageAvailable
                ? "Données de démonstration enregistrées dans ce navigateur uniquement."
                : "Stockage navigateur indisponible : les données ne seront pas conservées après fermeture."}
            </span>
            <button
              className="font-semibold underline underline-offset-2"
              onClick={resetDemoData}
              type="button"
            >
              Réinitialiser les données de démo
            </button>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <button className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#273142] shadow-sm">
                Aujourd’hui
              </button>
              <button className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#273142] shadow-sm">
                Cette semaine
              </button>
              <button className="rounded-full bg-[#6e7479] px-4 py-2 text-xs font-semibold text-white shadow-sm">
                Ce mois
              </button>
            </div>
            <button className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-[#273142] shadow-sm">
              <CalendarDays className="size-3.5" />1 sept. 2024 - 30 sept. 2024
              <ChevronDown className="size-3.5" />
            </button>
          </div>

          <section className="mt-7 grid gap-4 xl:grid-cols-4">
            <MetricCard
              dark
              label="Argent généré"
              value={demoData.generatedMoney}
              trend={demoData.generatedMoneyTrend}
              icon={CircleDollarSign}
            />
            <MetricCard
              label="Utilisateurs actifs"
              value={demoData.activeUsers}
              trend={demoData.activeUsersTrend}
              icon={Users}
            />
            <MetricCard
              label="Vérifications à traiter"
              value={demoData.pendingVerifications}
              trend={demoData.pendingVerificationsTrend}
              icon={FileCheck2}
              accent="red"
            />
            <MetricCard
              label="Revenus des créateurs"
              value={demoData.creatorRevenue}
              trend={demoData.creatorRevenueTrend}
              icon={Users}
            />
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(24,35,52,0.04)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold tracking-[-0.04em] text-[#111827]">
                    Activité de modération
                  </h2>
                  <p className="mt-1 text-xs text-[#8993a2]">
                    Actions enregistrées sur les 6 derniers jours
                  </p>
                </div>
                <button className="flex items-center gap-1 rounded-full bg-[#f4f6f7] px-3 py-2 text-xs font-semibold text-[#425066]">
                  6 derniers jours <ChevronDown className="size-3.5" />
                </button>
              </div>
              <div className="mt-8 flex h-[205px] items-end gap-4 border-b border-[#edf0f2] px-4 sm:gap-8">
                <div className="flex h-full flex-col justify-between py-1 text-[10px] text-[#9aa3af]">
                  <span>200</span>
                  <span>150</span>
                  <span>100</span>
                  <span>50</span>
                  <span>0</span>
                </div>
                <div className="flex h-full flex-1 items-end justify-around gap-3 pb-0">
                  {demoData.chartBars.map((height, index) => (
                    <div key={index} className="flex h-full flex-1 flex-col justify-end">
                      <div
                        className="mx-auto w-full max-w-[56px] rounded-t-xl bg-[#4a4c4e]"
                        style={{ height: `${height}%` }}
                      />
                      <span className="mt-3 text-center text-xs text-[#7d8795]">
                        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(24,35,52,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold tracking-[-0.04em] text-[#111827]">Priorités</h2>
                <button className="flex items-center gap-1 text-xs font-semibold text-[#758196]">
                  Tout voir <ChevronRight className="size-3.5" />
                </button>
              </div>
              <div className="mt-5 divide-y divide-[#eef0f2]">
                {demoData.priorities.map((priority) => (
                  <PriorityRow key={priority.title} {...priority} />
                ))}
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(24,35,52,0.04)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold tracking-[-0.04em] text-[#111827]">
                  Accès rapides
                </h2>
                <p className="mt-1 text-xs text-[#8993a2]">
                  Ouvrez les espaces opérationnels prioritaires.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <QuickAction
                  icon={FileCheck2}
                  label="Vérifications"
                  count={demoData.pendingVerifications}
                  tone="amber"
                />
                <QuickAction icon={BarChart3} label="Statistiques" count="Voir" tone="green" />
                <QuickAction icon={Shield} label="Sécurité & audit" count="" tone="gray" />
                <QuickAction icon={Headphones} label="Support client" count="12" tone="dark" onClick={() => setLocation("/support")} />
              </div>
            </div>
          </section>

          <footer className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#dfe4e8] pt-5 text-xs text-[#8b95a4]">
            <span>Dernière synchronisation : aujourd’hui à 11:03</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#687486]"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="size-3.5" />Se déconnecter
            </Button>
          </footer>
        </main>
      </div>
    </div>
  );
}

function PriorityRow({ tone, title, subtitle, count, status }: DemoPriority) {
  const colors = {
    red: "bg-[#fff0f0] text-[#db4b4b]",
    amber: "bg-[#fff7e8] text-[#c78b2b]",
    gray: "bg-[#f0f2f3] text-[#4b5563]",
  };

  return (
    <div className="flex items-center gap-3 py-4">
      <div className={`flex size-9 shrink-0 items-center justify-center rounded-full ${colors[tone]}`}>
        <span className="text-sm font-bold">
          {tone === "red" ? "!" : tone === "amber" ? "⚑" : "▣"}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#283343]">{title}</p>
        <p className="mt-0.5 truncate text-[11px] text-[#929ba7]">{subtitle}</p>
      </div>
      <span className="text-sm font-bold text-[#283343]">{count}</span>
      <span className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${colors[tone]}`}>
        {status}
      </span>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  count,
  tone,
  onClick,
}: {
  icon: typeof FileCheck2;
  label: string;
  count: string;
  tone: "amber" | "green" | "gray" | "dark";
  onClick?: () => void;
}) {
  const styles = {
    amber: "bg-[#fff7e8] text-[#bb7d16]",
    green: "bg-[#effaf3] text-[#1c9256]",
    gray: "bg-[#f0f2f3] text-[#475569]",
    dark: "bg-[#242729] text-white",
  };

  return (
    <button type="button" onClick={onClick} className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold ${styles[tone]}`}>
      <Icon className="size-4" />
      {label}
      {count && <span className="rounded-full bg-white/70 px-1.5 py-0.5 text-[10px]">{count}</span>}
    </button>
  );
}
