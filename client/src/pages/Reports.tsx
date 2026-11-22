import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  CreditCard,
  FileCheck2,
  Flag,
  Headphones,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Search,
  Settings,
  Shield,
  Users,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type ReportStatus = "Urgent" | "À traiter" | "En cours" | "Résolu";
type ReportPriority = "Haute" | "Moyenne" | "Basse";
type ReportTab = "Tous" | "Nouveaux" | "En cours" | "Résolus";

type Report = {
  id: string;
  user: string;
  handle: string;
  initials: string;
  avatar: string;
  contentType: string;
  contentDetail: string;
  reason: string;
  dateLabel: string;
  exactDate: string;
  relativeDate: string;
  priority: ReportPriority;
  status: ReportStatus;
  reporter: string;
  reporterHandle: string;
  reporterInitials: string;
  reporterAvatar: string;
  previousReports: number;
  order: number;
};

const navigation: { label: string; icon: LucideIcon; path?: string }[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Signalements", icon: Flag, path: "/reports" },
  { label: "Utilisateurs", icon: Users, path: "/users" },
  { label: "Vérifications", icon: FileCheck2 },
  { label: "Paiements", icon: WalletCards, path: "/payments" },
  { label: "Entreprises", icon: Building2 },
  { label: "Abonnements", icon: CreditCard },
  { label: "Statistiques", icon: Activity },
  { label: "Journal d’activité", icon: Clock3, path: "/activity" },
  { label: "Sécurité & audit", icon: Shield },
  { label: "Paramètres", icon: Settings },
];

const initialReports: Report[] = [
  {
    id: "RPT-45821",
    user: "Aminata K.",
    handle: "@aminata_k",
    initials: "AK",
    avatar: "bg-[#a35e46]",
    contentType: "Commentaire",
    contentDetail: "« C’est n’importe quoi... »",
    reason: "Discours haineux",
    dateLabel: "Aujourd’hui\n11:03",
    exactDate: "Aujourd’hui à 11:03",
    relativeDate: "Il y a 2 heures",
    priority: "Haute",
    status: "Urgent",
    reporter: "Moussa T.",
    reporterHandle: "@moussa_t",
    reporterInitials: "MT",
    reporterAvatar: "bg-[#654835]",
    previousReports: 3,
    order: 10,
  },
  {
    id: "RPT-45820",
    user: "Ibrahim D.",
    handle: "@ibrahim_d",
    initials: "ID",
    avatar: "bg-[#76513c]",
    contentType: "Publication",
    contentDetail: "Photo",
    reason: "Contenu inapproprié",
    dateLabel: "Aujourd’hui\n09:47",
    exactDate: "Aujourd’hui à 09:47",
    relativeDate: "Il y a 4 heures",
    priority: "Moyenne",
    status: "À traiter",
    reporter: "Fatou S.",
    reporterHandle: "@fatou_s",
    reporterInitials: "FS",
    reporterAvatar: "bg-[#9b6446]",
    previousReports: 0,
    order: 9,
  },
  {
    id: "RPT-45819",
    user: "Fatou S.",
    handle: "@fatou_s",
    initials: "FS",
    avatar: "bg-[#a9664c]",
    contentType: "Profil utilisateur",
    contentDetail: "Biographie",
    reason: "Usurpation d’identité",
    dateLabel: "Hier\n21:19",
    exactDate: "Hier à 21:19",
    relativeDate: "Il y a 14 heures",
    priority: "Haute",
    status: "En cours",
    reporter: "Aminata K.",
    reporterHandle: "@aminata_k",
    reporterInitials: "AK",
    reporterAvatar: "bg-[#a35e46]",
    previousReports: 1,
    order: 8,
  },
  {
    id: "RPT-45818",
    user: "Moussa T.",
    handle: "@moussa_t",
    initials: "MT",
    avatar: "bg-[#654835]",
    contentType: "Message privé",
    contentDetail: "« Tu es un arnaqueur »",
    reason: "Harcèlement",
    dateLabel: "Hier\n14:27",
    exactDate: "Hier à 14:27",
    relativeDate: "Il y a 21 heures",
    priority: "Basse",
    status: "Résolu",
    reporter: "Ibrahim D.",
    reporterHandle: "@ibrahim_d",
    reporterInitials: "ID",
    reporterAvatar: "bg-[#76513c]",
    previousReports: 0,
    order: 7,
  },
  {
    id: "RPT-45817",
    user: "Sarah M.",
    handle: "@sarah_m",
    initials: "SM",
    avatar: "bg-[#bd795e]",
    contentType: "Commentaire",
    contentDetail: "« Faux produit »",
    reason: "Désinformation",
    dateLabel: "28 sept. 2024\n16:52",
    exactDate: "28 septembre 2024 à 16:52",
    relativeDate: "Il y a 2 jours",
    priority: "Moyenne",
    status: "À traiter",
    reporter: "Lina B.",
    reporterHandle: "@lina_b",
    reporterInitials: "LB",
    reporterAvatar: "bg-[#a05b43]",
    previousReports: 2,
    order: 6,
  },
  {
    id: "RPT-45816",
    user: "Youssef A.",
    handle: "@youssef_a",
    initials: "YA",
    avatar: "bg-[#774a37]",
    contentType: "Annonce",
    contentDetail: "iPhone 15 Pro",
    reason: "Contenu frauduleux",
    dateLabel: "28 sept. 2024\n13:08",
    exactDate: "28 septembre 2024 à 13:08",
    relativeDate: "Il y a 2 jours",
    priority: "Haute",
    status: "En cours",
    reporter: "Kevin R.",
    reporterHandle: "@kevin_r",
    reporterInitials: "KR",
    reporterAvatar: "bg-[#805d46]",
    previousReports: 1,
    order: 5,
  },
  {
    id: "RPT-45815",
    user: "Lina B.",
    handle: "@lina_b",
    initials: "LB",
    avatar: "bg-[#a05b43]",
    contentType: "Commentaire",
    contentDetail: "« Arnaque totale »",
    reason: "Spam",
    dateLabel: "27 sept. 2024\n18:41",
    exactDate: "27 septembre 2024 à 18:41",
    relativeDate: "Il y a 3 jours",
    priority: "Basse",
    status: "Résolu",
    reporter: "Sarah M.",
    reporterHandle: "@sarah_m",
    reporterInitials: "SM",
    reporterAvatar: "bg-[#bd795e]",
    previousReports: 0,
    order: 4,
  },
  {
    id: "RPT-45814",
    user: "Kevin R.",
    handle: "@kevin_r",
    initials: "KR",
    avatar: "bg-[#805d46]",
    contentType: "Profil utilisateur",
    contentDetail: "Photo de profil",
    reason: "Contenu inapproprié",
    dateLabel: "27 sept. 2024\n11:26",
    exactDate: "27 septembre 2024 à 11:26",
    relativeDate: "Il y a 3 jours",
    priority: "Moyenne",
    status: "À traiter",
    reporter: "Nadia L.",
    reporterHandle: "@nadia_l",
    reporterInitials: "NL",
    reporterAvatar: "bg-[#b46c51]",
    previousReports: 1,
    order: 3,
  },
  {
    id: "RPT-45813",
    user: "Nadia L.",
    handle: "@nadia_l",
    initials: "NL",
    avatar: "bg-[#b46c51]",
    contentType: "Message privé",
    contentDetail: "« Offre suspecte »",
    reason: "Tentative d’arnaque",
    dateLabel: "26 sept. 2024\n19:05",
    exactDate: "26 septembre 2024 à 19:05",
    relativeDate: "Il y a 4 jours",
    priority: "Haute",
    status: "En cours",
    reporter: "Moussa T.",
    reporterHandle: "@moussa_t",
    reporterInitials: "MT",
    reporterAvatar: "bg-[#654835]",
    previousReports: 2,
    order: 2,
  },
  {
    id: "RPT-45812",
    user: "Thomas G.",
    handle: "@thomas_g",
    initials: "TG",
    avatar: "bg-[#754a37]",
    contentType: "Annonce",
    contentDetail: "Montre de luxe",
    reason: "Produits contrefaits",
    dateLabel: "26 sept. 2024\n10:12",
    exactDate: "26 septembre 2024 à 10:12",
    relativeDate: "Il y a 4 jours",
    priority: "Moyenne",
    status: "Résolu",
    reporter: "Ibrahim D.",
    reporterHandle: "@ibrahim_d",
    reporterInitials: "ID",
    reporterAvatar: "bg-[#76513c]",
    previousReports: 0,
    order: 1,
  },
];

const tabs: { label: ReportTab; count: string }[] = [
  { label: "Tous", count: "56" },
  { label: "Nouveaux", count: "18" },
  { label: "En cours", count: "24" },
  { label: "Résolus", count: "14" },
];

const priorityStyles: Record<ReportPriority, string> = {
  Haute: "bg-[#ffeded] text-[#dc4242]",
  Moyenne: "bg-[#fff3e3] text-[#b8791e]",
  Basse: "bg-[#e5f7ee] text-[#299b62]",
};

const statusStyles: Record<ReportStatus, string> = {
  Urgent: "bg-[#ffeded] text-[#d83d3d]",
  "À traiter": "bg-[#fff3e3] text-[#b8791e]",
  "En cours": "bg-[#e9f3ff] text-[#397bc4]",
  Résolu: "bg-[#e5f7ee] text-[#299b62]",
};

function Avatar({
  initials,
  color,
  size = "size-10",
}: {
  initials: string;
  color: string;
  size?: string;
}) {
  return (
    <span
      className={`inline-flex ${size} shrink-0 items-center justify-center rounded-full ${color} text-[11px] font-bold text-white ring-2 ring-white`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

function Badge({ children, className }: { children: string; className: string }) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

export default function Reports() {
  const [, setLocation] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation({ onSuccess: () => setLocation("/login") });
  const [reports, setReports] = useState(initialReports);
  const [activeTab, setActiveTab] = useState<ReportTab>("Tous");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(initialReports[0].id);
  const [mobileNav, setMobileNav] = useState(false);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);

  const selectedReport = reports.find((report) => report.id === selectedId) ?? reports[0];
  const filteredReports = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr");
    return reports
      .filter((report) => {
        const matchesTab =
          activeTab === "Tous" ||
          (activeTab === "Nouveaux" && (report.status === "Urgent" || report.status === "À traiter")) ||
          (activeTab === "En cours" && report.status === "En cours") ||
          (activeTab === "Résolus" && report.status === "Résolu");
        const searchText = [
          report.user,
          report.handle,
          report.contentType,
          report.contentDetail,
          report.reason,
          report.status,
          report.reporter,
        ].join(" ").toLocaleLowerCase("fr");
        return matchesTab && (!normalizedQuery || searchText.includes(normalizedQuery));
      })
      .sort((left, right) => sortNewestFirst ? right.order - left.order : left.order - right.order);
  }, [activeTab, query, reports, sortNewestFirst]);

  function updateSelectedStatus(status: ReportStatus) {
    setReports((current) => current.map((report) => report.id === selectedReport.id ? { ...report, status } : report));
    toast.success(status === "Résolu" ? "Signalement marqué comme résolu" : "Signalement pris en charge");
  }

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(selectedReport.id);
      toast.success("Référence copiée");
    } catch {
      toast.error("Impossible de copier la référence");
    }
    setMoreOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#eef0f2] text-[#172033]">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-30 flex w-[250px] shrink-0 flex-col bg-white px-4 py-7 transition-transform lg:static lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center gap-3 px-4">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[#1f2326] text-xl font-black text-white">M</div>
            <span className="text-xl font-bold tracking-[-0.05em] text-[#111827]">Mansa Hub</span>
            <button className="ml-auto rounded-lg p-1 text-[#94a3b8] lg:hidden" onClick={() => setMobileNav(false)} aria-label="Fermer le menu">
              <X className="size-5" />
            </button>
          </div>

          <nav className="mt-9 space-y-1.5" aria-label="Navigation principale">
            {navigation.map(({ label, icon: Icon, path }) => {
              const active = label === "Signalements";
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => { setMobileNav(false); if (path) setLocation(path); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${active ? "bg-[#eef0f2] font-bold text-[#111827]" : "text-[#657184] hover:bg-[#f7f8f9] hover:text-[#273142]"}`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="size-[18px]" />{label}
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => { setMobileNav(false); setLocation("/support"); }}
            className="mt-auto block w-full rounded-2xl bg-[#242729] p-5 text-left text-white transition hover:bg-[#303334]"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/10"><Headphones className="size-5" /></span>
            <span className="mt-4 block text-sm font-bold">Support client</span>
            <span className="mt-2 block text-xs leading-5 text-white/75">Pour les utilisateurs, contacter l’équipe de maintenance.</span>
            <span className="mt-4 flex items-center gap-2 text-xs font-bold">Ouvrir la file <ChevronRight className="size-3.5" /></span>
          </button>
        </aside>

        {mobileNav && (
          <button className="fixed inset-0 z-20 bg-[#16202a]/30 lg:hidden" onClick={() => setMobileNav(false)} aria-label="Fermer le menu" />
        )}

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-7 sm:py-7 lg:px-8 lg:py-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="rounded-xl bg-white p-2.5 text-[#273142] shadow-sm lg:hidden" onClick={() => setMobileNav(true)} aria-label="Ouvrir le menu">
                <Menu className="size-5" />
              </button>
              <h1 className="text-[28px] font-semibold tracking-[-0.045em] text-[#111827] sm:text-[34px]">Signalements</h1>
            </div>
            <div className="flex w-full items-center gap-3 sm:w-auto">
              <label className="relative min-w-0 flex-1 sm:w-[300px] sm:flex-none">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#172033]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher un signalement..."
                  aria-label="Rechercher un signalement"
                  className="h-12 w-full rounded-full border-0 bg-white pl-12 pr-4 text-sm text-[#273142] shadow-sm outline-none placeholder:text-[#8a92a0] focus:ring-2 focus:ring-[#cbd2dc]"
                />
              </label>
              <button type="button" className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-[#172033] shadow-sm" aria-label="Notifications">
                <Bell className="size-5" />
                <span className="absolute right-[13px] top-[11px] size-2 rounded-full bg-[#e54747] ring-2 ring-white" />
              </button>
              <button type="button" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#aa755d] to-[#30343a] text-sm font-bold text-white shadow-sm" aria-label="Compte administrateur">JD</button>
              <button type="button" className="hidden text-[#647184] hover:text-[#172033] sm:inline-flex" onClick={() => logoutMutation.mutate()} aria-label="Se déconnecter">
                <LogOut className="size-4" />
              </button>
            </div>
          </header>

          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.map(({ label, count }) => {
              const active = activeTab === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveTab(label)}
                  className={`inline-flex h-11 items-center gap-3 rounded-full px-5 text-sm transition ${active ? "bg-[#8e9094] text-white" : "bg-white text-[#273142] hover:bg-[#f9fafb]"}`}
                  aria-pressed={active}
                >
                  {label}
                  <span className={`flex min-w-7 items-center justify-center rounded-full px-2 py-1 text-xs font-medium ${active ? "bg-white text-[#172033]" : "bg-[#f3f4f6] text-[#172033]"}`}>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid min-w-0 grid-cols-1 items-start gap-4 2xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(24,35,52,0.04)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0f3] px-5 py-4 sm:px-6">
                <h2 className="text-lg font-semibold tracking-[-0.03em] text-[#111827]">Signalements récents</h2>
                <button
                  type="button"
                  onClick={() => setSortNewestFirst((current) => !current)}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#f7f8fa] px-3 text-sm text-[#4f596b] hover:bg-[#eef0f2]"
                  aria-label={`Trier par ${sortNewestFirst ? "plus anciens" : "plus récents"}`}
                >
                  {sortNewestFirst ? "Plus récents" : "Plus anciens"}<ChevronDown className="size-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#edf0f3] bg-[#fbfbfc] text-[12px] font-medium text-[#667085]">
                      <th className="px-4 py-3.5 font-medium">Utilisateur</th>
                      <th className="px-3 py-3.5 font-medium">Contenu</th>
                      <th className="px-3 py-3.5 font-medium">Motif</th>
                      <th className="px-3 py-3.5 font-medium">Date</th>
                      <th className="px-3 py-3.5 font-medium">Priorité</th>
                      <th className="px-3 py-3.5 font-medium">Statut</th>
                      <th className="w-8 px-2 py-3.5"><span className="sr-only">Ouvrir le détail</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => {
                      const selected = report.id === selectedId;
                      return (
                        <tr
                          key={report.id}
                          onClick={() => setSelectedId(report.id)}
                          className={`cursor-pointer border-b border-[#edf0f3] transition hover:bg-[#f8f9fb] ${selected ? "bg-[#fbfbfc]" : "bg-white"}`}
                          aria-selected={selected}
                        >
                          <td className="px-4 py-2.5">
                            <div className="flex min-w-[132px] items-center gap-2.5">
                              <Avatar initials={report.initials} color={report.avatar} size="size-9" />
                              <div className="min-w-0">
                                <p className="truncate text-[13px] font-medium text-[#172033]">{report.user}</p>
                                <p className="truncate text-[11px] text-[#8992a1]">{report.handle}</p>
                              </div>
                            </div>
                          </td>
                          <td className="max-w-[150px] px-3 py-2.5">
                            <p className="truncate text-[13px] font-medium text-[#172033]">{report.contentType}</p>
                            <p className="mt-0.5 truncate text-[11px] text-[#8992a1]">{report.contentDetail}</p>
                          </td>
                          <td className="max-w-[135px] px-3 py-2.5 text-[12px] leading-5 text-[#5e6879]">{report.reason}</td>
                          <td className="whitespace-pre-line px-3 py-2.5 text-[12px] leading-5 text-[#5e6879]">{report.dateLabel}</td>
                          <td className="px-3 py-2.5"><Badge className={priorityStyles[report.priority]}>{report.priority}</Badge></td>
                          <td className="px-3 py-2.5"><Badge className={statusStyles[report.status]}>{report.status}</Badge></td>
                          <td className="px-2 py-2.5">
                            <button type="button" className="rounded-lg p-1.5 text-[#9299a5] hover:bg-[#eef0f2] hover:text-[#273142]" onClick={(event) => { event.stopPropagation(); setSelectedId(report.id); }} aria-label={`Détails du signalement de ${report.user}`}>
                              <ChevronRight className="size-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredReports.length === 0 && (
                      <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-[#7b8492]">Aucun signalement trouvé.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <aside className="overflow-visible rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(24,35,52,0.04)] sm:p-6">
              <div className="flex items-center justify-between border-b border-[#edf0f3] pb-4">
                <h2 className="text-lg font-semibold tracking-[-0.03em] text-[#111827]">Détails du signalement</h2>
                <div className="relative">
                  <button type="button" className="rounded-lg p-2 text-[#687386] hover:bg-[#f5f6f8]" onClick={() => setMoreOpen((open) => !open)} aria-label="Plus d’actions">
                    <MoreHorizontal className="size-5" />
                  </button>
                  {moreOpen && (
                    <div className="absolute right-0 top-10 z-10 w-48 rounded-xl border border-[#edf0f3] bg-white p-1.5 shadow-[0_12px_35px_rgba(15,23,42,0.14)]">
                      <button type="button" onClick={copyReference} className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#455064] hover:bg-[#f5f6f8]">Copier la référence</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3.5 border-b border-[#edf0f3] py-4">
                <Avatar initials={selectedReport.initials} color={selectedReport.avatar} size="size-12" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-[#172033]">{selectedReport.user}</p>
                  <p className="truncate text-sm text-[#818a99]">{selectedReport.handle}</p>
                </div>
                <Badge className={statusStyles[selectedReport.status]}>{selectedReport.status}</Badge>
              </div>

              <div className="space-y-5 py-4">
                <DetailRow icon={FileCheck2} label="Type de contenu">
                  <p className="font-medium text-[#455064]">{selectedReport.contentType}</p>
                </DetailRow>

                <DetailRow icon={MessageCircle} label="Contenu signalé">
                  <div className="rounded-xl bg-[#f2f3f6] px-3.5 py-3 text-sm leading-5 text-[#3f4a5d]">{contentQuote(selectedReport)}</div>
                </DetailRow>

                <DetailRow icon={Flag} label="Motif du signalement">
                  <p className="font-medium text-[#455064]">{selectedReport.reason}</p>
                  <p className="mt-1 text-sm leading-5 text-[#828b9a]">{reasonDescription(selectedReport.reason)}</p>
                </DetailRow>

                <DetailRow icon={CalendarDays} label="Date du signalement">
                  <p className="font-medium text-[#455064]">{selectedReport.exactDate}</p>
                  <p className="mt-1 text-sm text-[#828b9a]">{selectedReport.relativeDate}</p>
                </DetailRow>

                <DetailRow icon={Users} label="Signalé par">
                  <p className="font-medium text-[#455064]">{selectedReport.reporter} <span className="font-normal text-[#828b9a]">{selectedReport.reporterHandle}</span></p>
                  <p className="mt-1 text-sm text-[#828b9a]">{selectedReport.previousReports} signalements précédents</p>
                </DetailRow>
              </div>

              <div className="space-y-2.5 border-t border-[#edf0f3] pt-4">
                <button
                  type="button"
                  onClick={() => updateSelectedStatus("En cours")}
                  disabled={selectedReport.status === "Résolu" || selectedReport.status === "En cours"}
                  className="flex h-12 w-full items-center justify-between rounded-xl bg-[#26292b] px-4 text-sm font-semibold text-white transition hover:bg-[#3b3f41] disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <span className="flex items-center gap-3"><FileCheck2 className="size-5" />Traiter</span><ChevronRight className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => updateSelectedStatus("Résolu")}
                  disabled={selectedReport.status === "Résolu"}
                  className="flex h-12 w-full items-center gap-3 rounded-xl border border-[#e3e6ea] px-4 text-sm font-medium text-[#273142] transition hover:bg-[#f7f8fa] disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <CheckCircle2 className="size-5" />Marquer comme résolu
                </button>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[24px_minmax(0,1fr)] gap-3">
      <Icon className="mt-0.5 size-5 text-[#172033]" />
      <div className="min-w-0">
        <p className="mb-1.5 text-sm font-medium text-[#273142]">{label}</p>
        {children}
      </div>
    </div>
  );
}

function contentQuote(report: Report) {
  if (report.id === "RPT-45821") return "C’est n’importe quoi, vous êtes tous des escrocs !";
  return report.contentDetail.replace(/[«»]/g, "").trim() || report.contentType;
}

function reasonDescription(reason: string) {
  const descriptions: Record<string, string> = {
    "Discours haineux": "Propos discriminatoires ou haineux envers un groupe de personnes.",
    "Contenu inapproprié": "Contenu qui ne respecte pas les règles de la communauté.",
    "Usurpation d’identité": "Le profil semble utiliser l’identité d’une autre personne.",
    Harcèlement: "Comportement répété ou message visant à intimider un utilisateur.",
    Désinformation: "Information présentée comme vraie malgré des éléments trompeurs.",
    "Contenu frauduleux": "Publication pouvant induire les utilisateurs en erreur.",
    Spam: "Contenu répétitif ou publié de manière indésirable.",
    "Tentative d’arnaque": "Tentative de tromper un utilisateur ou d’obtenir un avantage indu.",
    "Produits contrefaits": "Article présenté comme authentique sans preuve de conformité.",
  };
  return descriptions[reason] ?? "Ce contenu a été signalé pour examen par l’équipe de modération.";
}
