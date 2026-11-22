import { useMemo, useState, type FormEvent } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  FileCheck2,
  Flag,
  Headphones,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Search,
  Send,
  Settings,
  Shield,
  Users,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

type TicketStatus = "Nouveau" | "En cours" | "Résolu";
type TicketPriority = "Urgent" | "Haute" | "Moyenne" | "Basse";
type TicketTab = "Toutes" | "Nouvelles" | "En cours" | "Résolues";
type Ticket = {
  id: string;
  user: string;
  email: string;
  initials: string;
  avatar: string;
  subject: string;
  dateLabel: string;
  sortDate: number;
  priority: TicketPriority;
  status: TicketStatus;
};
type Message = { sender: "user" | "support"; author: string; time: string; text: string };

const initialTickets: Ticket[] = [
  { id: "45821", user: "Aminata K.", email: "aminata.k@gmail.com", initials: "AK", avatar: "bg-[#9c5a43]", subject: "Problème de connexion", dateLabel: "Aujourd’hui\n11:03", sortDate: 8, priority: "Urgent", status: "Nouveau" },
  { id: "45820", user: "Ibrahim D.", email: "ibrahim.diallo@email.com", initials: "ID", avatar: "bg-[#614431]", subject: "Paiement non reçu", dateLabel: "Aujourd’hui\n09:24", sortDate: 7, priority: "Haute", status: "En cours" },
  { id: "45819", user: "Fatou S.", email: "fatou.sangare@email.com", initials: "FS", avatar: "bg-[#ad7957]", subject: "Question sur mon compte", dateLabel: "Hier\n21:19", sortDate: 6, priority: "Moyenne", status: "Résolu" },
  { id: "45818", user: "Moussa T.", email: "moussa.traore@email.com", initials: "MT", avatar: "bg-[#59402f]", subject: "Modification de mon profil", dateLabel: "Hier\n16:42", sortDate: 5, priority: "Basse", status: "Résolu" },
  { id: "45817", user: "Khadija B.", email: "khadija.ba@email.com", initials: "KB", avatar: "bg-[#b87857]", subject: "Erreur de paiement", dateLabel: "Hier\n14:27", sortDate: 4, priority: "Haute", status: "En cours" },
  { id: "45816", user: "Lamine C.", email: "lamine.cisse@email.com", initials: "LC", avatar: "bg-[#624638]", subject: "Suppression de compte", dateLabel: "30 sept. 2024\n19:11", sortDate: 3, priority: "Moyenne", status: "Nouveau" },
  { id: "45815", user: "Aissatou M.", email: "aissatou.m@email.com", initials: "AM", avatar: "bg-[#a96d53]", subject: "Question sur les vérifications", dateLabel: "30 sept. 2024\n13:56", sortDate: 2, priority: "Basse", status: "Résolu" },
  { id: "45814", user: "Cheikh N.", email: "cheikh.ndiaye@email.com", initials: "CN", avatar: "bg-[#624738]", subject: "Accès refusé", dateLabel: "29 sept. 2024\n10:32", sortDate: 1, priority: "Haute", status: "En cours" },
];

const initialThreads: Record<string, Message[]> = {
  "45821": [
    { sender: "user", author: "Aminata K.", time: "Aujourd’hui à 11:03", text: "Bonjour,\nJe n’arrive plus à me connecter à mon compte depuis ce matin. J’obtiens un message d’erreur « Identifiants invalides » alors que mes informations sont correctes.\nPouvez-vous m’aider ?\nMerci d’avance." },
    { sender: "support", author: "Support - Ibrahim D.", time: "Aujourd’hui à 11:28", text: "Bonjour Aminata,\nMerci pour votre message. Nous allons vérifier votre compte et revenir vers vous rapidement.\nCordialement,\nL’équipe Mansa Hub." },
  ],
  "45820": [{ sender: "user", author: "Ibrahim D.", time: "Aujourd’hui à 09:24", text: "Bonjour, je n’ai pas encore reçu le paiement annoncé sur mon compte. Pourriez-vous vérifier son état ? Merci." }],
  "45819": [{ sender: "user", author: "Fatou S.", time: "Hier à 21:19", text: "Bonjour, j’aurais une question au sujet des informations affichées sur mon compte. Merci pour votre aide." }, { sender: "support", author: "Support - Ibrahim D.", time: "Aujourd’hui à 08:42", text: "Bonjour Fatou, nous avons mis à jour les informations demandées. Bonne journée, l’équipe Mansa Hub." }],
  "45818": [{ sender: "user", author: "Moussa T.", time: "Hier à 16:42", text: "Bonjour, je souhaite modifier quelques informations sur mon profil mais je ne trouve pas où le faire." }, { sender: "support", author: "Support - Ibrahim D.", time: "Hier à 17:05", text: "Bonjour Moussa, votre profil est à jour. N’hésitez pas à nous écrire si vous avez besoin d’aide." }],
  "45817": [{ sender: "user", author: "Khadija B.", time: "Hier à 14:27", text: "Bonjour, une erreur est apparue pendant mon paiement. Pouvez-vous m’aider à vérifier la transaction ?" }],
  "45816": [{ sender: "user", author: "Lamine C.", time: "30 sept. 2024 à 19:11", text: "Bonjour, je voudrais supprimer mon compte. Pouvez-vous m’indiquer la marche à suivre ?" }],
  "45815": [{ sender: "user", author: "Aissatou M.", time: "30 sept. 2024 à 13:56", text: "Bonjour, ma vérification est toujours en attente. Pouvez-vous me dire si un document manque ?" }, { sender: "support", author: "Support - Ibrahim D.", time: "30 sept. 2024 à 14:20", text: "Bonjour Aissatou, votre dossier a bien été vérifié. Merci pour votre patience." }],
  "45814": [{ sender: "user", author: "Cheikh N.", time: "29 sept. 2024 à 10:32", text: "Bonjour, je ne peux plus accéder à mon compte. Le message indique que l’accès est refusé." }],
};

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Signalements", icon: Flag, path: "/reports" },
  { label: "Utilisateurs", icon: Users, path: "/users" },
  { label: "Vérifications", icon: FileCheck2, path: "/verifications" },
  { label: "Paiements", icon: WalletCards, path: "/payments" },
  { label: "Entreprises", icon: Building2, path: "/businesses" },
  { label: "Abonnements", icon: CreditCard },
  { label: "Statistiques", icon: Activity },
  { label: "Journal d’activité", icon: Clock3, path: "/activity" },
  { label: "Sécurité & audit", icon: Shield },
  { label: "Paramètres", icon: Settings },
];

const tabs: TicketTab[] = ["Toutes", "Nouvelles", "En cours", "Résolues"];

function Avatar({ ticket, size = "size-10" }: { ticket: Ticket; size?: string }) {
  return <span className={`inline-flex ${size} shrink-0 items-center justify-center rounded-full ${ticket.avatar} text-xs font-bold text-white ring-2 ring-white`} aria-hidden="true">{ticket.initials}</span>;
}

function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const styles: Record<TicketPriority, string> = {
    Urgent: "bg-[#ffeded] text-[#d74646]",
    Haute: "bg-[#fff0df] text-[#bb741c]",
    Moyenne: "bg-[#eaf3ff] text-[#367cc5]",
    Basse: "bg-[#f0f2f4] text-[#4e5868]",
  };
  return <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${styles[priority]}`}>{priority}</span>;
}

function StatusBadge({ status }: { status: TicketStatus }) {
  const styles: Record<TicketStatus, string> = {
    Nouveau: "bg-[#eaf3ff] text-[#3479bf]",
    "En cours": "bg-[#fff0df] text-[#ba6c15]",
    Résolu: "bg-[#e4f7ef] text-[#168452]",
  };
  return <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${styles[status]}`}>{status}</span>;
}

function MetricCard({ label, value, change, icon: Icon, tone, trend }: { label: string; value: string; change: string; icon: LucideIcon; tone: "red" | "green"; trend: "up" | "down" }) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  return <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(24,35,52,0.035)] sm:p-6"><div className="flex items-start justify-between gap-3"><div className="flex items-start gap-4"><span className="flex size-11 items-center justify-center rounded-xl bg-[#f2f4f5] text-[#151b23]"><Icon className="size-5" /></span><div><p className="text-sm text-[#697586]">{label}</p><p className="mt-2 text-[30px] font-bold leading-none tracking-[-0.06em] text-[#111827]">{value}</p></div></div><span className="flex size-10 items-center justify-center rounded-xl bg-[#f5f6f7] text-[#273142]"><Users className="size-5" /></span></div><p className={`mt-3 flex items-center gap-2 pl-[60px] text-xs ${tone === "red" ? "text-[#db3e3e]" : "text-[#159951]"}`}><TrendIcon className="size-4" /><span className="font-semibold">{change}</span><span className="text-[#8b95a4]">par rapport à hier</span></p></section>;
}

export default function Support() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation({ onSuccess: () => setLocation("/login") });
  const [mobileNav, setMobileNav] = useState(false);
  const [tickets, setTickets] = useState(initialTickets);
  const [threads, setThreads] = useState(initialThreads);
  const [activeTab, setActiveTab] = useState<TicketTab>("Toutes");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("45821");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [sortMenu, setSortMenu] = useState(false);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  const adminInitials = user?.name?.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "MH";

  const visibleTickets = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("fr");
    return tickets.filter((ticket) => {
      const matchesTab = activeTab === "Toutes" || (activeTab === "Nouvelles" && ticket.status === "Nouveau") || (activeTab === "En cours" && ticket.status === "En cours") || (activeTab === "Résolues" && ticket.status === "Résolu");
      const searchable = `${ticket.id} ${ticket.user} ${ticket.email} ${ticket.subject} ${ticket.priority} ${ticket.status}`.toLocaleLowerCase("fr");
      return matchesTab && (!normalized || searchable.includes(normalized));
    }).sort((a, b) => sortOrder === "recent" ? b.sortDate - a.sortDate : a.sortDate - b.sortDate);
  }, [activeTab, query, sortOrder, tickets]);

  const selectedTicket = visibleTickets.find((ticket) => ticket.id === selectedId) ?? visibleTickets[0];
  const conversation = selectedTicket ? threads[selectedTicket.id] ?? [] : [];

  function notify(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2400);
  }

  function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTicket || !draft.trim()) return;
    const now = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date());
    const newMessage: Message = { sender: "support", author: `Support - ${user?.name || "Mansa Hub"}`, time: `Aujourd’hui à ${now}`, text: draft.trim() };
    setThreads((current) => ({ ...current, [selectedTicket.id]: [...(current[selectedTicket.id] ?? []), newMessage] }));
    setDraft("");
    notify("Réponse ajoutée à la conversation.");
  }

  function toggleResolved() {
    if (!selectedTicket) return;
    const nextStatus: TicketStatus = selectedTicket.status === "Résolu" ? "En cours" : "Résolu";
    setTickets((current) => current.map((ticket) => ticket.id === selectedTicket.id ? { ...ticket, status: nextStatus } : ticket));
    setActiveTab(nextStatus === "Résolu" ? "Résolues" : "En cours");
    notify(nextStatus === "Résolu" ? "Demande marquée comme résolue." : "Demande rouverte.");
  }

  return (
    <div className="min-h-screen bg-[#eef0f2] text-[#172033]">
      <div className="flex min-h-screen">
        <aside className={`fixed inset-y-0 left-0 z-30 flex w-[250px] shrink-0 flex-col bg-white px-4 py-7 transition-transform lg:static lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center gap-3 px-4"><div className="flex size-11 items-center justify-center rounded-2xl bg-[#1f2326] text-xl font-black text-white">M</div><span className="text-xl font-bold tracking-[-0.05em] text-[#111827]">Mansa Hub</span><button className="ml-auto rounded-lg p-1 text-[#94a3b8] lg:hidden" onClick={() => setMobileNav(false)} aria-label="Fermer le menu"><X className="size-5" /></button></div>
          <nav className="mt-8 space-y-1" aria-label="Navigation principale">{navigation.map(({ label, icon: Icon, path }) => <button key={label} type="button" onClick={() => { setMobileNav(false); if (path) setLocation(path); }} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-[#657184] transition hover:bg-[#f7f8f9] hover:text-[#273142]"><Icon className="size-[18px]" />{label}</button>)}</nav>
          <button type="button" onClick={() => { setMobileNav(false); setLocation("/support"); }} className="mt-auto block w-full rounded-2xl bg-[#242729] p-5 text-left text-white transition hover:bg-[#303334]" aria-current={location === "/support" ? "page" : undefined}><span className="flex size-9 items-center justify-center rounded-xl bg-white/10"><Headphones className="size-5" /></span><span className="mt-4 block text-sm font-bold">Support client</span><span className="mt-2 block text-xs leading-5 text-white/75">Pour les utilisateurs, contacter l’équipe de maintenance.</span><span className="mt-4 flex items-center gap-2 text-xs font-bold">Ouvrir la file <ChevronRight className="size-3.5" /></span></button>
        </aside>

        {mobileNav && <button className="fixed inset-0 z-20 bg-[#16202a]/30 lg:hidden" onClick={() => setMobileNav(false)} aria-label="Fermer le menu" />}

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-7 lg:px-8 lg:py-7">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3"><button className="rounded-xl bg-white p-2.5 text-[#425066] shadow-sm lg:hidden" onClick={() => setMobileNav(true)} aria-label="Ouvrir le menu"><Menu className="size-5" /></button><div><h1 className="text-[28px] font-bold tracking-[-0.06em] text-[#111827] sm:text-[34px]">Support client</h1><p className="mt-1 text-sm text-[#687487]">Demandes des utilisateurs vers l’équipe de maintenance</p></div></div>
            <div className="flex w-full items-center gap-3 sm:w-auto"><label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full bg-white px-4 text-[#152033] shadow-sm sm:w-[280px] sm:flex-none lg:w-[330px]"><Search className="size-5 shrink-0" /><span className="sr-only">Rechercher</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#9aa3b1]" placeholder="Rechercher..." /></label><button type="button" className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-[#152033] shadow-sm" aria-label="Notifications"><Bell className="size-5" /><span className="absolute right-[13px] top-[11px] size-2 rounded-full bg-[#df302f]" /></button><div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#72543f] text-xs font-bold text-white" aria-label="Compte administrateur">{adminInitials}</div><Button variant="ghost" size="icon" className="shrink-0 rounded-full text-[#64748b]" onClick={() => logoutMutation.mutate()} aria-label="Se déconnecter" disabled={logoutMutation.isPending}><LogOut className="size-4" /></Button></div>
          </header>

          {notice && <div role="status" className="mb-4 rounded-xl bg-[#eaf7ef] px-4 py-3 text-sm font-medium text-[#187b49]">{notice}</div>}

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><MetricCard label="Nouveaux tickets" value="18" change="+25 %" icon={Mail} tone="red" trend="up" /><MetricCard label="En cours" value="7" change="−12 %" icon={Clock3} tone="green" trend="down" /><MetricCard label="Résolus aujourd’hui" value="24" change="+33 %" icon={CheckCircle2} tone="green" trend="up" /></section>

          <section className="mt-5 grid items-start gap-4 xl:grid-cols-[minmax(0,1.52fr)_minmax(360px,0.88fr)]">
            <div className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(24,35,52,0.035)]">
              <div className="p-4 pb-3 sm:p-5 sm:pb-4"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold tracking-[-0.04em] text-[#111827]">Demandes récentes</h2><div className="relative"><button type="button" onClick={() => setSortMenu((open) => !open)} aria-expanded={sortMenu} className="flex items-center gap-2 rounded-full bg-[#f5f6f7] px-3.5 py-2 text-xs font-medium text-[#303b4c]"><span>{sortOrder === "recent" ? "Plus récentes" : "Plus anciennes"}</span><ChevronDown className="size-3.5" /></button>{sortMenu && <div className="absolute right-0 z-10 mt-2 w-40 rounded-xl border border-[#e7eaed] bg-white p-1.5 shadow-xl"><button type="button" onClick={() => { setSortOrder("recent"); setSortMenu(false); }} className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f5f6f7]">Plus récentes</button><button type="button" onClick={() => { setSortOrder("oldest"); setSortMenu(false); }} className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f5f6f7]">Plus anciennes</button></div>}</div></div>
                <label className="mt-3 flex h-11 items-center gap-3 rounded-full bg-[#f3f4f5] px-4 text-[#152033]"><Search className="size-5 shrink-0" /><span className="sr-only">Rechercher une demande</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#8b95a4]" placeholder="Rechercher une demande..." />{query && <button type="button" onClick={() => setQuery("")} className="rounded-md p-1 text-[#8b95a4] hover:bg-white" aria-label="Effacer la recherche"><X className="size-4" /></button>}</label>
                <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Filtrer les tickets">{tabs.map((tab) => <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className={`rounded-full px-4 py-2 text-xs font-medium transition ${activeTab === tab ? "bg-[#292b2c] text-white" : "bg-[#f4f5f6] text-[#3f4a5b] hover:bg-[#e9ecee]"}`}>{tab}</button>)}</div>
              </div>
              <div className="overflow-x-auto"><table className="w-full min-w-[750px] border-collapse text-left text-[13px]"><thead className="bg-[#f5f6f7] text-[#657184]"><tr><th className="px-4 py-3 font-medium">Utilisateur</th><th className="px-3 py-3 font-medium">Sujet</th><th className="px-3 py-3 font-medium">Date</th><th className="px-3 py-3 font-medium">Priorité</th><th className="px-3 py-3 font-medium">Statut</th><th className="px-3 py-3"><span className="sr-only">Ouvrir la conversation</span></th></tr></thead><tbody>{visibleTickets.map((ticket) => { const selected = selectedTicket?.id === ticket.id; return <tr key={ticket.id} onClick={() => setSelectedId(ticket.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedId(ticket.id); }} tabIndex={0} aria-selected={selected} className={`cursor-pointer border-b border-[#edf0f2] transition hover:bg-[#fafbfc] ${selected ? "bg-[#f8fafb]" : "bg-white"}`}><td className="px-4 py-2.5"><div className="flex min-w-[145px] items-center gap-2.5"><Avatar ticket={ticket} size="size-9" /><span className="whitespace-nowrap font-medium text-[#202b3a]">{ticket.user}</span></div></td><td className="max-w-[190px] truncate px-3 py-2.5 text-[#566276]">{ticket.subject}</td><td className="whitespace-pre-line px-3 py-2.5 leading-4 text-[#737f90]">{ticket.dateLabel}</td><td className="px-3 py-2.5"><PriorityBadge priority={ticket.priority} /></td><td className="px-3 py-2.5"><StatusBadge status={ticket.status} /></td><td className="px-3 py-2.5 text-[#8b95a4]"><ChevronRight className="size-4" /></td></tr>; })}{visibleTickets.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-[#7d8796]">Aucune demande trouvée.</td></tr>}</tbody></table></div>
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs text-[#7b8695]"><span>{visibleTickets.length} demande{visibleTickets.length === 1 ? "" : "s"} affichée{visibleTickets.length === 1 ? "" : "s"}</span><div className="flex items-center gap-1"><button type="button" className="rounded-lg p-2 text-[#a0a8b4] hover:bg-[#f4f5f6]" aria-label="Page précédente"><ChevronLeft className="size-4" /></button><button type="button" className="size-8 rounded-lg bg-[#252829] text-xs font-semibold text-white" aria-current="page">1</button><button type="button" className="size-8 rounded-lg text-xs hover:bg-[#f4f5f6]">2</button><button type="button" className="size-8 rounded-lg text-xs hover:bg-[#f4f5f6]">3</button><span className="px-1">…</span><button type="button" className="rounded-lg p-2 hover:bg-[#f4f5f6]" aria-label="Page suivante"><ChevronRight className="size-4" /></button></div></div>
            </div>

            {selectedTicket ? <aside className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(24,35,52,0.035)]"><div className="flex items-center justify-between px-5 pb-3 pt-4"><h2 className="text-xl font-bold tracking-[-0.04em] text-[#111827]">Conversation</h2><span className="text-sm text-[#7b8695]">#{selectedTicket.id}</span></div><div className="mx-4 flex items-center gap-3 rounded-xl border border-[#e8ebee] px-3 py-2"><Avatar ticket={selectedTicket} size="size-12" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#172033]">{selectedTicket.user}</p><p className="truncate text-xs text-[#8993a2]">{selectedTicket.email}</p></div><button type="button" className="rounded-lg p-2 text-[#7f8998] hover:bg-[#f2f4f5]" aria-label="Autres options"><MoreHorizontal className="size-4" /></button></div><div className="px-5 pt-3"><div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-semibold text-[#171d26]">{selectedTicket.subject}</h3><p className="mt-1 text-xs text-[#8993a2]">Ticket #{selectedTicket.id}</p></div><StatusBadge status={selectedTicket.status} /></div></div><div className="mx-4 my-4 h-px bg-[#edf0f2]" /><div className="max-h-[420px] min-h-[220px] space-y-4 overflow-y-auto px-4 pb-4">{conversation.map((message, index) => { const fromSupport = message.sender === "support"; return <div key={`${selectedTicket.id}-${index}`} className={fromSupport ? "flex justify-end" : "flex justify-start"}><div className={`max-w-[92%] ${fromSupport ? "flex flex-row-reverse items-end gap-2" : "flex items-end gap-2"}`}>{!fromSupport && <Avatar ticket={selectedTicket} size="size-8" />}<div className={`min-w-0 ${fromSupport ? "text-right" : ""}`}><div className={`mb-1 flex flex-wrap items-center gap-x-2 text-[11px] text-[#8993a2] ${fromSupport ? "justify-end" : ""}`}><span className="font-semibold text-[#455166]">{message.author}</span><span>{message.time}</span></div><div className={`whitespace-pre-line rounded-2xl px-4 py-3 text-[13px] leading-[1.55] ${fromSupport ? "rounded-br-md bg-[#edf4ff] text-[#42546d]" : "rounded-bl-md bg-[#f2f3f4] text-[#4c5667]"}`}>{message.text}</div></div></div></div>; })}</div><form onSubmit={sendReply} className="border-t border-[#edf0f2] p-4"><label className="sr-only" htmlFor="support-reply">Écrire une réponse</label><textarea id="support-reply" value={draft} onChange={(event) => setDraft(event.target.value)} rows={2} className="w-full resize-y rounded-xl border border-[#e5e8eb] bg-white px-3.5 py-3 text-sm outline-none placeholder:text-[#a0a8b5] focus:border-[#afb7c2]" placeholder="Écrire une réponse..." /><div className="mt-2 flex flex-wrap gap-2"><Button type="submit" disabled={!draft.trim()} className="h-10 rounded-full bg-[#252829] px-4 text-xs font-semibold text-white hover:bg-[#36393a]"><Send className="size-4" />Répondre</Button><Button type="button" variant="outline" onClick={toggleResolved} className="h-10 rounded-full border-[#e4e7ea] px-4 text-xs font-semibold text-[#283243] hover:bg-[#f5f6f7]">{selectedTicket.status === "Résolu" ? <MessageCircle className="size-4" /> : <Check className="size-4" />}{selectedTicket.status === "Résolu" ? "Rouvrir la demande" : "Marquer comme résolu"}</Button></div></form></aside> : <aside className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-[#dfe3e7] bg-white p-6 text-center text-sm text-[#778294]">Sélectionnez une demande pour afficher la conversation.</aside>}
          </section>
        </main>
      </div>
    </div>
  );
}
