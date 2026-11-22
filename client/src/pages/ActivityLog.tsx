import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  Activity,
  Bell,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Download,
  Eye,
  FileCheck2,
  Flag,
  Headphones,
  Info,
  LayoutDashboard,
  Laptop,
  LogOut,
  MapPin,
  Menu,
  Monitor,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Smartphone,
  Users,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

type ActiveSession = {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActivity: string;
  current: boolean;
  icon: LucideIcon;
};

type AuditEvent = {
  id: string;
  timestamp: string;
  admin: string;
  initials: string;
  role: string;
  avatar: string;
  action: string;
  target: string;
  targetId: string;
  reason: string;
  ip: string;
  details: string;
};

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Signalements", icon: Flag, path: "/reports" },
  { label: "Utilisateurs", icon: Users, path: "/users" },
  { label: "Vérifications", icon: FileCheck2 },
  { label: "Paiements", icon: WalletCards, path: "/payments" },
  { label: "Entreprises", icon: Building2, path: "/businesses" },
  { label: "Abonnements", icon: CreditCard },
  { label: "Statistiques", icon: Activity },
  { label: "Journal d’activité", icon: Clock3, path: "/activity" },
  { label: "Sécurité & audit", icon: Shield },
  { label: "Paramètres", icon: Settings },
];

const initialSessions: ActiveSession[] = [
  {
    id: "sess_mbpro_01",
    device: "MacBook Pro",
    browser: "Chrome · macOS",
    ip: "197.210.45.18",
    location: "Abidjan, Côte d’Ivoire",
    lastActivity: "Aujourd’hui, 11:03",
    current: true,
    icon: Laptop,
  },
  {
    id: "sess_iphone_02",
    device: "iPhone 15",
    browser: "Safari · iOS",
    ip: "102.89.16.44",
    location: "Dakar, Sénégal",
    lastActivity: "Aujourd’hui, 08:47",
    current: false,
    icon: Smartphone,
  },
  {
    id: "sess_windows_03",
    device: "Windows PC",
    browser: "Edge · Windows 11",
    ip: "154.72.21.09",
    location: "Douala, Cameroun",
    lastActivity: "Hier, 14:27",
    current: false,
    icon: Monitor,
  },
];

const initialEvents: AuditEvent[] = [
  {
    id: "evt_20240901_1103",
    timestamp: "1 sept. 2024 · 11:03:18",
    admin: "Aminata K.",
    initials: "AK",
    role: "Modératrice",
    avatar: "bg-[#a05b43]",
    action: "SUSPEND_USER",
    target: "Kora Academy",
    targetId: "cmp_2048",
    reason: "Contenu illégal signalé",
    ip: "197.210.45.18",
    details: "Compte suspendu après examen du signalement et vérification du contenu concerné.",
  },
  {
    id: "evt_20240901_1022",
    timestamp: "1 sept. 2024 · 10:22:41",
    admin: "Ibrahim D.",
    initials: "ID",
    role: "Administrateur",
    avatar: "bg-[#76513c]",
    action: "APPROVE_KYC",
    target: "Aminata K.",
    targetId: "usr_7781",
    reason: "Vérification d’identité validée",
    ip: "102.89.16.44",
    details: "Les pièces justificatives ont été examinées et le profil a été marqué comme vérifié.",
  },
  {
    id: "evt_20240831_1814",
    timestamp: "31 août 2024 · 18:14:09",
    admin: "Fatou S.",
    initials: "FS",
    role: "Modératrice",
    avatar: "bg-[#9b6446]",
    action: "APPROVE_PAYOUT",
    target: "Retrait",
    targetId: "wdr_2024_019",
    reason: "Conformité LCB-FT",
    ip: "41.203.12.77",
    details: "Le retrait a été approuvé après le contrôle réglementaire requis.",
  },
  {
    id: "evt_20240831_1637",
    timestamp: "31 août 2024 · 16:37:52",
    admin: "Moussa T.",
    initials: "MT",
    role: "Administrateur",
    avatar: "bg-[#614431]",
    action: "UPDATE_PLATFORM_SETTINGS",
    target: "Paramètres plateforme",
    targetId: "cfg_0001",
    reason: "Mise à jour des règles de modération",
    ip: "154.72.21.09",
    details: "Les règles de modération ont été actualisées dans les paramètres de la plateforme.",
  },
  {
    id: "evt_20240830_0911",
    timestamp: "30 août 2024 · 09:11:06",
    admin: "Aminata K.",
    initials: "AK",
    role: "Modératrice",
    avatar: "bg-[#a05b43]",
    action: "RETRY_WEBHOOK_IDEMPOTENT",
    target: "Paiement",
    targetId: "pay_8831",
    reason: "Résolution d’erreur technique",
    ip: "197.210.45.18",
    details: "Le webhook du paiement a été relancé de manière idempotente après une erreur technique.",
  },
];

const actionStyles: Record<string, string> = {
  SUSPEND_USER: "bg-[#fff0ed] text-[#cf473b]",
  APPROVE_KYC: "bg-[#e6f7ee] text-[#21814d]",
  APPROVE_PAYOUT: "bg-[#e6f7ee] text-[#21814d]",
  UPDATE_PLATFORM_SETTINGS: "bg-[#eaf2ff] text-[#3d73b8]",
  RETRY_WEBHOOK_IDEMPOTENT: "bg-[#f0edff] text-[#6c55ac]",
};

function makeAuditEvent({
  action,
  target,
  targetId,
  reason,
  ip,
  admin,
  initials,
}: {
  action: string;
  target: string;
  targetId: string;
  reason: string;
  ip: string;
  admin: string;
  initials: string;
}): AuditEvent {
  const now = new Date();
  const time = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(now);
  const date = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(now).replace(".", "");
  return {
    id: `evt_${Date.now()}`,
    timestamp: `${date} · ${time}`,
    admin,
    initials,
    role: "Administrateur",
    avatar: "bg-[#76513c]",
    action,
    target,
    targetId,
    reason,
    ip,
    details: reason,
  };
}

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function ActionBadge({ action }: { action: string }) {
  const style = actionStyles[action] ?? "bg-[#f1f3f5] text-[#596579]";
  return <span className={`inline-flex max-w-full whitespace-nowrap rounded-md px-2.5 py-1.5 font-mono text-[10px] font-bold tracking-[-0.02em] sm:text-[11px] ${style}`}>{action}</span>;
}

export default function ActivityLog() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation({ onSuccess: () => setLocation("/login") });
  const [mobileNav, setMobileNav] = useState(false);
  const [sessions, setSessions] = useState(initialSessions);
  const [events, setEvents] = useState(initialEvents);
  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("Toutes les actions");
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [notice, setNotice] = useState("");

  const adminName = user?.name || "Ibrahim D.";
  const adminInitials = adminName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "ID";
  const currentIp = sessions.find((session) => session.current)?.ip || "197.210.45.18";
  const actionOptions = useMemo(() => Array.from(new Set(events.map((event) => event.action))), [events]);
  const visibleEvents = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("fr");
    return events.filter((event) => {
      const matchesAction = actionFilter === "Toutes les actions" || event.action === actionFilter;
      const searchable = `${event.timestamp} ${event.admin} ${event.role} ${event.action} ${event.target} ${event.targetId} ${event.reason} ${event.ip}`.toLocaleLowerCase("fr");
      return matchesAction && (!normalized || searchable.includes(normalized));
    });
  }, [actionFilter, events, query]);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeDialogButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!selectedEvent) return;
    closeDialogButtonRef.current?.focus();

    function handleDialogKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelectedEvent(null);
        return;
      }
      if (event.key !== "Tab") return;

      const focusableElements = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? []);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (!firstElement || !lastElement) {
        event.preventDefault();
        dialogRef.current?.focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    window.addEventListener("keydown", handleDialogKeyDown);
    return () => {
      window.removeEventListener("keydown", handleDialogKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [selectedEvent]);

  function openEventDetails(event: AuditEvent) {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSelectedEvent(event);
  }

  function closeEventDetails() {
    setSelectedEvent(null);
  }

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  }

  function revokeSession(session: ActiveSession) {
    if (session.current) return;
    setSessions((current) => current.filter((item) => item.id !== session.id));
    setEvents((current) => [
      makeAuditEvent({
        action: "REVOKE_SESSION",
        target: session.device,
        targetId: session.id,
        reason: "Révocation demandée depuis la liste des sessions.",
        ip: currentIp,
        admin: adminName,
        initials: adminInitials,
      }),
      ...current,
    ]);
    showNotice("La session a été retirée de cette liste.");
  }

  function revokeOtherSessions() {
    const otherSessions = sessions.filter((session) => !session.current);
    if (otherSessions.length === 0) {
      showNotice("Aucune autre session n’est affichée.");
      return;
    }
    setSessions((current) => current.filter((session) => session.current));
    setEvents((current) => [
      makeAuditEvent({
        action: "REVOKE_OTHER_SESSIONS",
        target: `${otherSessions.length} autres sessions`,
        targetId: otherSessions.map((session) => session.id).join(", "),
        reason: "Déconnexion des autres sessions demandée depuis le registre.",
        ip: currentIp,
        admin: adminName,
        initials: adminInitials,
      }),
      ...current,
    ]);
    showNotice("Les autres sessions ont été retirées de cette liste.");
  }

  function exportEvents(kind: "csv" | "json") {
    const action = kind === "csv" ? "EXPORT_AUDIT_LOG_CSV" : "EXPORT_AUDIT_LOG_JSON";
    const exportEvent = makeAuditEvent({
      action,
      target: "Journal d’audit",
      targetId: "audit_export",
      reason: `Export ${kind.toUpperCase()} déclenché depuis le registre.`,
      ip: currentIp,
      admin: adminName,
      initials: adminInitials,
    });
    const records = [exportEvent, ...events];
    setEvents(records);

    const content = kind === "csv"
      ? [
          ["Horodatage", "Administrateur", "Rôle", "Type d’action", "Cible", "ID cible", "Motif réglementaire", "Adresse IP"].map(csvCell).join(";"),
          ...records.map((event) => [event.timestamp, event.admin, event.role, event.action, event.target, event.targetId, event.reason, event.ip].map(csvCell).join(";")),
        ].join("\r\n")
      : JSON.stringify(records, null, 2);
    const mimeType = kind === "csv" ? "text/csv;charset=utf-8" : "application/json;charset=utf-8";
    const blob = new Blob([kind === "csv" ? `\uFEFF${content}` : content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = kind === "csv" ? "mansa-hub-journal-lcb-ft.csv" : "mansa-hub-journal-brut.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showNotice(`Export ${kind.toUpperCase()} préparé.`);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="min-h-screen bg-[#eef0f2] text-[#172033]">
      <div className="flex min-h-screen">
        <aside className={`fixed inset-y-0 left-0 z-30 flex w-[250px] shrink-0 flex-col bg-white px-4 py-7 transition-transform lg:static lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center gap-3 px-4">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[#1f2326] text-xl font-black text-white">M</div>
            <span className="text-xl font-bold tracking-[-0.05em] text-[#111827]">Mansa Hub</span>
            <button className="ml-auto rounded-lg p-1 text-[#94a3b8] lg:hidden" onClick={() => setMobileNav(false)} aria-label="Fermer le menu"><X className="size-5" /></button>
          </div>

          <nav className="mt-9 space-y-1.5" aria-label="Navigation principale">
            {navigation.map(({ label, icon: Icon, path }) => {
              const active = path === "/activity" && location === "/activity";
              const className = `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${active ? "bg-[#eef0f2] font-bold text-[#111827]" : "text-[#657184] hover:bg-[#f7f8f9] hover:text-[#273142]"}`;
              return <button key={label} type="button" className={className} onClick={() => { setMobileNav(false); if (path) setLocation(path); }} aria-current={active ? "page" : undefined}><Icon className="size-[18px]" />{label}</button>;
            })}
          </nav>

          <button type="button" onClick={() => { setMobileNav(false); setLocation("/support"); }} className="mt-auto block w-full rounded-2xl bg-[#242729] p-5 text-left text-white transition hover:bg-[#303334]" aria-label="Ouvrir la file Support client">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/10"><Headphones className="size-5" /></span>
            <span className="mt-4 block text-sm font-bold">Support client</span>
            <span className="mt-2 block text-xs leading-5 text-white/75">Pour les utilisateurs, contacter l’équipe de maintenance.</span>
            <span className="mt-4 flex items-center gap-2 text-xs font-bold">Ouvrir la file <ChevronRight className="size-3.5" /></span>
          </button>
        </aside>

        {mobileNav && <button className="fixed inset-0 z-20 bg-[#16202a]/30 lg:hidden" onClick={() => setMobileNav(false)} aria-label="Fermer le menu" />}

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-7 lg:px-8 lg:py-7">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="rounded-xl bg-white p-2.5 text-[#425066] shadow-sm lg:hidden" onClick={() => setMobileNav(true)} aria-label="Ouvrir le menu"><Menu className="size-5" /></button>
              <div>
                <h1 className="text-[28px] font-bold tracking-[-0.06em] text-[#111827] sm:text-[34px]">Journal d’activité</h1>
                <p className="mt-1 text-sm text-[#687487]">Suivez les actions sensibles et les accès administrateurs</p>
              </div>
            </div>
            <div className="flex w-full items-center gap-3 sm:w-auto">
              <form onSubmit={handleSearchSubmit} className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full bg-white px-4 text-[#152033] shadow-sm sm:w-[250px] sm:flex-none lg:w-[300px]">
                <Search className="size-5 shrink-0" />
                <label className="sr-only" htmlFor="global-audit-search">Rechercher dans le journal</label>
                <input id="global-audit-search" value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#9aa3b1]" placeholder="Rechercher..." />
              </form>
              <button type="button" className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-[#152033] shadow-sm" aria-label="Notifications"><Bell className="size-5" /><span className="absolute right-[13px] top-[11px] size-2 rounded-full bg-[#df302f]" /></button>
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#76513c] text-xs font-bold text-white" aria-label={`Compte administrateur ${adminName}`}>{adminInitials}</div>
              <Button variant="ghost" size="icon" className="shrink-0 rounded-full text-[#64748b]" onClick={() => logoutMutation.mutate()} aria-label="Se déconnecter" disabled={logoutMutation.isPending}><LogOut className="size-4" /></Button>
            </div>
          </header>

          <div role="note" className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#e8d8ae] bg-[#fff9ea] px-4 py-3 text-xs leading-5 text-[#78643d]">
            <Info className="mt-0.5 size-4 shrink-0" />
            <p><span className="font-semibold">Aperçu local.</span> Les sessions et événements sont conservés uniquement dans cette page. Les actions de révocation ne déconnectent pas réellement les appareils et ce journal n’est pas un registre serveur immuable.</p>
          </div>

          {notice && <div role="status" className="mb-5 flex items-center gap-2 rounded-xl border border-[#cdebd8] bg-[#f0fbf4] px-4 py-3 text-sm text-[#237648]"><CheckCircle2 className="size-4 shrink-0" />{notice}</div>}

          <section className="mb-6 rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(24,35,52,0.035)] sm:p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold tracking-[-0.04em] text-[#111827]">Sessions administrateur actives</h2>
                <p className="mt-1 text-sm text-[#8791a0]">Appareils connectés et activité récente</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f7ef] px-3 py-2 text-xs font-semibold text-[#21814d]"><ShieldCheck className="size-4" />Registre sécurisé</span>
                <button type="button" onClick={revokeOtherSessions} className="inline-flex items-center gap-2 rounded-xl border border-[#f2d3d1] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#cf473b] transition hover:bg-[#fff6f5] sm:text-sm"><LogOut className="size-4" />Déconnecter les autres sessions</button>
              </div>
            </div>

            <div className="divide-y divide-[#edf0f2]">
              {sessions.map((session) => {
                const Icon = session.icon;
                return (
                  <div key={session.id} className="grid gap-3 py-4 first:pt-2 last:pb-1 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f2f4f5] text-[#425066]"><Icon className="size-5" /></span>
                      <div className="min-w-0"><p className="truncate text-sm font-bold text-[#172033]">{session.device}</p><p className="mt-1 truncate text-xs text-[#8993a2]">{session.browser}</p></div>
                    </div>
                    <div className="text-xs leading-5 text-[#667386]"><p className="font-medium text-[#354154]">{session.ip}</p><p className="flex items-center gap-1.5"><MapPin className="size-3.5 shrink-0 text-[#a1a9b4]" />{session.location}</p></div>
                    <div className="text-xs text-[#667386]"><p className="text-[#8993a2]">Dernière activité</p><p className="mt-1 font-medium text-[#354154]">{session.lastActivity}</p></div>
                    <div className="flex items-center justify-end">
                      {session.current
                        ? <span className="rounded-full bg-[#e8f7ef] px-3 py-1.5 text-xs font-semibold text-[#21814d]">Session actuelle</span>
                        : <button type="button" onClick={() => revokeSession(session)} className="rounded-lg px-3 py-2 text-xs font-semibold text-[#cf473b] transition hover:bg-[#fff0ed]">Révoquer</button>}
                    </div>
                  </div>
                );
              })}
              {sessions.length === 0 && <p className="py-6 text-center text-sm text-[#8791a0]">Aucune session affichée.</p>}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(24,35,52,0.035)]">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#edf0f2] px-5 py-5 sm:px-6">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold tracking-[-0.04em] text-[#111827]"><ShieldCheck className="size-5 text-[#21814d]" />Journal d’audit immuable</h2>
                <p className="mt-1 text-sm text-[#8791a0]">Registre des actions sensibles et réglementaires</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => exportEvents("csv")} className="inline-flex items-center gap-2 rounded-xl bg-[#1f2326] px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#34393c] sm:text-sm"><Download className="size-4" />Export CSV LCB-FT</button>
                <button type="button" onClick={() => exportEvents("json")} className="inline-flex items-center gap-2 rounded-xl border border-[#dce1e6] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#354154] transition hover:bg-[#f7f8f9] sm:text-sm"><Download className="size-4" />Export JSON brut</button>
              </div>
            </div>

            <div className="flex items-start gap-3 border-b border-[#cfead9] bg-[#eff9f3] px-5 py-3.5 text-sm text-[#26734a] sm:px-6"><ShieldCheck className="mt-0.5 size-4 shrink-0" /><p><span className="font-semibold">Lecture seule des enregistrements affichés</span><span className="mx-2 text-[#8db89d]">·</span>Aucune immutabilité ni persistance serveur n’est configurée</p></div>

            <div className="flex flex-col gap-3 border-b border-[#edf0f2] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <label className="flex h-10 min-w-0 items-center gap-2.5 rounded-xl border border-[#e4e8ec] px-3 text-[#8791a0] sm:w-[300px]">
                <Search className="size-4 shrink-0" />
                <span className="sr-only">Rechercher dans les événements</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#172033] outline-none placeholder:text-[#a0a8b3]" placeholder="Rechercher une action, un admin..." />
              </label>
              <label className="flex h-10 items-center gap-2 rounded-xl border border-[#e4e8ec] px-3 text-xs text-[#697586] sm:min-w-[210px]">
                <span className="whitespace-nowrap">Filtrer :</span>
                <select value={actionFilter} onChange={(event) => setActionFilter(event.target.value)} className="min-w-0 flex-1 border-0 bg-transparent text-sm font-medium text-[#354154] outline-none">
                  <option>Toutes les actions</option>
                  {actionOptions.map((action) => <option key={action} value={action}>{action}</option>)}
                </select>
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px] border-collapse text-left">
                <thead><tr className="bg-[#f8f9fa] text-[10px] font-bold uppercase tracking-[0.07em] text-[#8993a2]">
                  <th className="px-4 py-3.5 sm:px-5">Horodatage</th>
                  <th className="px-4 py-3.5">Administrateur</th>
                  <th className="px-4 py-3.5">Type d’action</th>
                  <th className="px-4 py-3.5">Cible &amp; ID</th>
                  <th className="px-4 py-3.5">Motif réglementaire</th>
                  <th className="px-4 py-3.5">Adresse IP</th>
                  <th className="px-4 py-3.5 text-center">Détails</th>
                </tr></thead>
                <tbody className="divide-y divide-[#edf0f2]">
                  {visibleEvents.map((event) => (
                    <tr key={event.id} className="align-middle text-xs text-[#536174] transition hover:bg-[#fbfcfc]">
                      <td className="whitespace-nowrap px-4 py-4 font-medium text-[#354154] sm:px-5">{event.timestamp}</td>
                      <td className="px-4 py-4"><div className="flex items-center gap-2.5"><span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${event.avatar} text-[10px] font-bold text-white`}>{event.initials}</span><span><span className="block whitespace-nowrap font-semibold text-[#354154]">{event.admin}</span><span className="mt-0.5 block text-[10px] text-[#929baa]">{event.role}</span></span></div></td>
                      <td className="px-4 py-4"><ActionBadge action={event.action} /></td>
                      <td className="px-4 py-4"><span className="block whitespace-nowrap font-semibold text-[#354154]">{event.target}</span><span className="mt-1 block font-mono text-[10px] text-[#929baa]">{event.targetId}</span></td>
                      <td className="max-w-[210px] px-4 py-4 leading-5 text-[#697586]">{event.reason}</td>
                      <td className="whitespace-nowrap px-4 py-4 font-mono text-[11px] text-[#647184]">{event.ip}</td>
                      <td className="px-4 py-4 text-center"><button type="button" onClick={() => openEventDetails(event)} className="inline-flex size-8 items-center justify-center rounded-lg text-[#7d8999] transition hover:bg-[#eef2f5] hover:text-[#273142]" aria-label={`Voir les détails de ${event.action}`}><Eye className="size-4" /></button></td>
                    </tr>
                  ))}
                  {visibleEvents.length === 0 && <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-[#8993a2]">Aucun événement ne correspond à cette recherche.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#edf0f2] px-5 py-3.5 text-xs text-[#8993a2] sm:px-6"><span>{visibleEvents.length} événement{visibleEvents.length === 1 ? "" : "s"} affiché{visibleEvents.length === 1 ? "" : "s"}</span><span>Les exports CSV et JSON sont ajoutés au journal de cette vue.</span></div>
          </section>

          <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#dce9e1] bg-[#f7fbf8] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e5f3ea] text-[#278151]"><ShieldCheck className="size-5" /></span><div><h2 className="text-sm font-bold text-[#263b2e]">Traçabilité réglementaire</h2><p className="mt-1 max-w-3xl text-xs leading-5 text-[#6c7d72]">Les exports et demandes de révocation s’ajoutent à cette vue locale uniquement; aucune action n’est consignée dans un registre serveur.</p></div></div>
            <span className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-[#5d7867]"><ShieldCheck className="size-4" />Accès administrateur</span>
          </section>
        </main>
      </div>

      {selectedEvent && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121923]/45 p-4" role="presentation" onPointerDown={(event) => { if (event.target === event.currentTarget) closeEventDetails(); }}>
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="audit-dialog-title" tabIndex={-1} className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl outline-none sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8791a0]">Détail de l’événement</p><h2 id="audit-dialog-title" className="mt-2 text-lg font-bold text-[#111827]">{selectedEvent.action}</h2></div><button ref={closeDialogButtonRef} type="button" onClick={closeEventDetails} className="rounded-lg p-2 text-[#6f7b8b] hover:bg-[#f2f4f5]" aria-label="Fermer"><X className="size-5" /></button></div>
          <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <div><dt className="text-xs text-[#8993a2]">Horodatage</dt><dd className="mt-1 text-sm font-medium text-[#354154]">{selectedEvent.timestamp}</dd></div>
            <div><dt className="text-xs text-[#8993a2]">Administrateur</dt><dd className="mt-1 text-sm font-medium text-[#354154]">{selectedEvent.admin} · {selectedEvent.role}</dd></div>
            <div><dt className="text-xs text-[#8993a2]">Cible</dt><dd className="mt-1 text-sm font-medium text-[#354154]">{selectedEvent.target} <span className="font-mono text-xs text-[#8791a0]">({selectedEvent.targetId})</span></dd></div>
            <div><dt className="text-xs text-[#8993a2]">Adresse IP</dt><dd className="mt-1 font-mono text-sm text-[#354154]">{selectedEvent.ip}</dd></div>
            <div className="sm:col-span-2"><dt className="text-xs text-[#8993a2]">Motif réglementaire</dt><dd className="mt-1 text-sm font-medium text-[#354154]">{selectedEvent.reason}</dd></div>
            <div className="sm:col-span-2"><dt className="text-xs text-[#8993a2]">Détails</dt><dd className="mt-1 rounded-xl bg-[#f7f8f9] p-3 text-sm leading-6 text-[#536174]">{selectedEvent.details}</dd></div>
          </dl>
          <div className="mt-6 flex justify-end"><Button type="button" variant="outline" onClick={closeEventDetails}>Fermer</Button></div>
        </div>
      </div>}
    </div>
  );
}
