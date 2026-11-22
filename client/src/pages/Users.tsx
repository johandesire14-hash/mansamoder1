import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownWideNarrow,
  Bell,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Clock3,
  Eye,
  FileCheck2,
  Flag,
  Headphones,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MoreHorizontal,
  Search,
  Settings,
  Shield,
  SlidersHorizontal,
  UserRound,
  Users as UsersIcon,
  WalletCards,
  X,
} from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

type UserStatus = "Actif" | "Suspendu";
type UserTab = "Tous" | "Actifs" | "Suspendus" | "Vérifiés";
type UserRecord = {
  id: string;
  name: string;
  initials: string;
  handle: string;
  email: string;
  joinedAt: string;
  activity: string;
  activityDate: number;
  status: UserStatus;
  role: string;
  company: string;
  location: string;
  reports: number;
  followers: string;
  verified: boolean;
  avatar: string;
};

const initialUsers: UserRecord[] = [
  { id: "usr-01", name: "Aminata Keita", initials: "AK", handle: "@aminata.k", email: "aminata.keita@email.com", joinedAt: "2024-09-30", activity: "Il y a 12 min", activityDate: 1727694000, status: "Actif", role: "Créatrice", company: "Studio Keita", location: "Bamako, Mali", reports: 0, followers: "12,4 k", verified: true, avatar: "bg-[#bd8d70]" },
  { id: "usr-02", name: "Ibrahim Diallo", initials: "ID", handle: "@ibrahim.d", email: "ibrahim.diallo@email.com", joinedAt: "2024-09-29", activity: "Il y a 28 min", activityDate: 1727693040, status: "Actif", role: "Utilisateur", company: "—", location: "Dakar, Sénégal", reports: 0, followers: "2 840", verified: true, avatar: "bg-[#79543f]" },
  { id: "usr-03", name: "Fatou Sangaré", initials: "FS", handle: "@fatou.s", email: "fatou.sangare@email.com", joinedAt: "2024-09-28", activity: "Il y a 1 h", activityDate: 1727686800, status: "Actif", role: "Créatrice", company: "Fatou Créations", location: "Abidjan, Côte d’Ivoire", reports: 1, followers: "8 126", verified: true, avatar: "bg-[#9b6446]" },
  { id: "usr-04", name: "Moussa Traoré", initials: "MT", handle: "@moussa.t", email: "moussa.traore@email.com", joinedAt: "2024-09-27", activity: "Hier, 18:42", activityDate: 1727635320, status: "Actif", role: "Utilisateur", company: "—", location: "Ouagadougou, Burkina Faso", reports: 0, followers: "1 092", verified: false, avatar: "bg-[#614431]" },
  { id: "usr-05", name: "Kadiatou Maïga", initials: "KM", handle: "@kadiatou.m", email: "kadiatou.maiga@email.com", joinedAt: "2024-09-26", activity: "Hier, 16:10", activityDate: 1727626200, status: "Actif", role: "Créatrice", company: "Kadiatou Design", location: "Bamako, Mali", reports: 0, followers: "6 530", verified: true, avatar: "bg-[#b27957]" },
  { id: "usr-06", name: "Youssouf Barry", initials: "YB", handle: "@youssouf.b", email: "youssouf.barry@email.com", joinedAt: "2024-09-25", activity: "Il y a 2 jours", activityDate: 1727528400, status: "Suspendu", role: "Utilisateur", company: "—", location: "Conakry, Guinée", reports: 4, followers: "684", verified: false, avatar: "bg-[#574237]" },
  { id: "usr-07", name: "Aïssata Camara", initials: "AC", handle: "@aissata.c", email: "aissata.camara@email.com", joinedAt: "2024-09-24", activity: "Il y a 3 jours", activityDate: 1727442000, status: "Actif", role: "Créatrice", company: "Aïssata Studio", location: "Abidjan, Côte d’Ivoire", reports: 0, followers: "18,2 k", verified: true, avatar: "bg-[#c18b67]" },
  { id: "usr-08", name: "Salif Ndiaye", initials: "SN", handle: "@salif.n", email: "salif.ndiaye@email.com", joinedAt: "2024-09-23", activity: "Il y a 4 jours", activityDate: 1727355600, status: "Actif", role: "Utilisateur", company: "—", location: "Dakar, Sénégal", reports: 2, followers: "1 380", verified: false, avatar: "bg-[#805d46]" },
  { id: "usr-09", name: "Mariam Koné", initials: "MK", handle: "@mariam.k", email: "mariam.kone@email.com", joinedAt: "2024-09-22", activity: "Il y a 5 jours", activityDate: 1727269200, status: "Actif", role: "Créatrice", company: "Maison Koné", location: "Bamako, Mali", reports: 0, followers: "9 740", verified: true, avatar: "bg-[#a36b51]" },
  { id: "usr-10", name: "Ousmane Touré", initials: "OT", handle: "@ousmane.t", email: "ousmane.toure@email.com", joinedAt: "2024-09-20", activity: "Il y a 1 semaine", activityDate: 1727096400, status: "Suspendu", role: "Utilisateur", company: "—", location: "Lomé, Togo", reports: 3, followers: "932", verified: true, avatar: "bg-[#715343]" },
];

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Signalements", icon: Flag, path: "/reports" },
  { label: "Utilisateurs", icon: UsersIcon, path: "/users" },
  { label: "Vérifications", icon: FileCheck2 },
  { label: "Paiements", icon: WalletCards, path: "/payments" },
  { label: "Entreprises", icon: Building2 },
  { label: "Abonnements", icon: CreditCard },
  { label: "Statistiques", icon: Activity },
  { label: "Journal d’activité", icon: Clock3, path: "/activity" },
  { label: "Sécurité & audit", icon: Shield },
  { label: "Paramètres", icon: Settings },
];

const tabs: { label: UserTab; count: string }[] = [
  { label: "Tous", count: "16 815" },
  { label: "Actifs", count: "14 230" },
  { label: "Suspendus", count: "412" },
  { label: "Vérifiés", count: "12 580" },
];

function Avatar({ user, size = "size-10" }: { user: UserRecord; size?: string }) {
  return <span className={`inline-flex ${size} shrink-0 items-center justify-center rounded-full ${user.avatar} text-xs font-bold text-white ring-2 ring-white`} aria-hidden="true">{user.initials}</span>;
}

function StatusBadge({ status }: { status: UserStatus }) {
  const active = status === "Actif";
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${active ? "bg-[#e8f7ee] text-[#17834a]" : "bg-[#fff0ed] text-[#c64a3e]"}`}><span className={`size-1.5 rounded-full ${active ? "bg-[#22a45d]" : "bg-[#e06455]"}`} />{status}</span>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

export default function Users() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation({ onSuccess: () => setLocation("/login") });
  const [mobileNav, setMobileNav] = useState(false);
  const [users, setUsers] = useState(initialUsers);
  const [tab, setTab] = useState<UserTab>("Tous");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(initialUsers[0].id);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"Tous" | UserStatus>("Tous");
  const [roleFilter, setRoleFilter] = useState("Tous");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [sortMenu, setSortMenu] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [notes, setNotes] = useState<Record<string, string[]>>({});
  const [notice, setNotice] = useState("");

  const visibleUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr");
    return users
      .filter((item) => {
        const matchesTab = tab === "Tous" || (tab === "Actifs" && item.status === "Actif") || (tab === "Suspendus" && item.status === "Suspendu") || (tab === "Vérifiés" && item.verified);
        const matchesStatus = statusFilter === "Tous" || item.status === statusFilter;
        const matchesRole = roleFilter === "Tous" || item.role === roleFilter;
        const matchesVerified = !verifiedOnly || item.verified;
        const searchText = `${item.name} ${item.handle} ${item.email} ${item.location}`.toLocaleLowerCase("fr");
        return matchesTab && matchesStatus && matchesRole && matchesVerified && (!normalizedQuery || searchText.includes(normalizedQuery));
      })
      .sort((a, b) => sortOrder === "recent" ? b.activityDate - a.activityDate : a.activityDate - b.activityDate);
  }, [query, roleFilter, sortOrder, statusFilter, tab, users, verifiedOnly]);

  const selectedUser = visibleUsers.find((item) => item.id === selectedId) ?? visibleUsers[0];
  const adminInitials = user?.name?.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "MH";

  function toggleSuspension() {
    if (!selectedUser) return;
    const nextStatus: UserStatus = selectedUser.status === "Actif" ? "Suspendu" : "Actif";
    setUsers((current) => current.map((item) => item.id === selectedUser.id ? { ...item, status: nextStatus } : item));
    setNotice(`${selectedUser.name} : statut « ${nextStatus} »`);
    window.setTimeout(() => setNotice(""), 2400);
  }

  function saveNote() {
    if (!selectedUser || !noteDraft.trim()) return;
    setNotes((current) => ({ ...current, [selectedUser.id]: [...(current[selectedUser.id] ?? []), noteDraft.trim()] }));
    setNoteDraft("");
    setNoteOpen(false);
    setNotice("Note ajoutée au profil.");
    window.setTimeout(() => setNotice(""), 2400);
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
              const active = label === "Utilisateurs";
              const className = `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${active ? "bg-[#eef0f2] font-bold text-[#111827]" : "text-[#657184] hover:bg-[#f7f8f9] hover:text-[#273142]"}`;
              return <button key={label} type="button" className={className} onClick={() => { setMobileNav(false); if (path) setLocation(path); }} aria-current={active ? "page" : undefined}><Icon className="size-[18px]" />{label}</button>;
            })}
          </nav>
          <div className="mt-auto rounded-2xl bg-[#242729] p-5 text-white">
            <div className="flex size-9 items-center justify-center rounded-xl bg-white/10"><Headphones className="size-5" /></div>
            <p className="mt-4 text-sm font-bold">Support client</p>
            <p className="mt-2 text-xs leading-5 text-white/70">Pour les utilisateurs, contacter l’équipe de maintenance.</p>
            <button type="button" onClick={() => setLocation("/support")} className="mt-4 flex items-center gap-2 text-xs font-bold text-white">Ouvrir la file <ChevronRight className="size-3.5" /></button>
          </div>
        </aside>

        {mobileNav && <button className="fixed inset-0 z-20 bg-[#16202a]/30 lg:hidden" onClick={() => setMobileNav(false)} aria-label="Fermer le menu" />}

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-7 lg:px-8 lg:py-7">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="rounded-xl bg-white p-2.5 text-[#425066] shadow-sm lg:hidden" onClick={() => setMobileNav(true)} aria-label="Ouvrir le menu"><Menu className="size-5" /></button>
              <div><h1 className="text-[28px] font-bold tracking-[-0.06em] text-[#111827] sm:text-[34px]">Utilisateurs</h1><p className="mt-1 text-sm text-[#8791a0]">Gérez les comptes et suivez leur activité.</p></div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" className="relative flex size-11 items-center justify-center rounded-full bg-white text-[#152033] shadow-sm" aria-label="Notifications"><Bell className="size-5" /><span className="absolute right-3 top-2.5 size-2 rounded-full bg-[#df302f]" /></button>
              <div className="flex size-11 items-center justify-center rounded-full bg-[#72543f] text-xs font-bold text-white" aria-label="Compte administrateur">{adminInitials}</div>
              <Button variant="ghost" size="icon" className="rounded-full text-[#64748b]" onClick={() => logoutMutation.mutate()} aria-label="Se déconnecter" disabled={logoutMutation.isPending}><LogOut className="size-4" /></Button>
            </div>
          </header>

          {notice && <div role="status" className="mb-4 rounded-xl bg-[#eaf7ef] px-4 py-3 text-sm font-medium text-[#187b49]">{notice}</div>}

          <section className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(24,35,52,0.035)] sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0f2]">
              <div className="flex max-w-full gap-1 overflow-x-auto" role="tablist" aria-label="Filtrer les utilisateurs par statut">
                {tabs.map(({ label, count }) => <button key={label} type="button" role="tab" aria-selected={tab === label} onClick={() => setTab(label)} className={`relative flex shrink-0 items-center gap-2 px-3 py-3 text-sm transition sm:px-4 ${tab === label ? "font-semibold text-[#171c23]" : "text-[#8791a0] hover:text-[#253044]"}`}><span>{label}</span><span className={`rounded-full px-2 py-0.5 text-[11px] ${tab === label ? "bg-[#f0f2f3] text-[#3c4655]" : "bg-[#f6f7f8] text-[#96a0ad]"}`}>{count}</span>{tab === label && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#26292b] sm:inset-x-4" />}</button>)}
              </div>
            </div>

            <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
              <label className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#e7eaed] px-3.5 text-[#152033]">
                <Search className="size-4 shrink-0 text-[#7e8998]" /><span className="sr-only">Rechercher un utilisateur</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#a0a8b5]" placeholder="Rechercher un utilisateur..." />
                {query && <button type="button" onClick={() => setQuery("")} className="rounded-md p-1 text-[#8b95a4] hover:bg-[#f2f4f6]" aria-label="Effacer la recherche"><X className="size-4" /></button>}
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <button type="button" onClick={() => setShowFilters((open) => !open)} aria-expanded={showFilters} className={`flex h-11 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium ${showFilters || statusFilter !== "Tous" || roleFilter !== "Tous" || verifiedOnly ? "border-[#333638] bg-[#f8f9fa] text-[#25292b]" : "border-[#e7eaed] bg-white text-[#445064]"}`}><SlidersHorizontal className="size-4" />Filtres<ChevronDown className="size-3.5" /></button>
                  {showFilters && <div className="absolute right-0 z-10 mt-2 w-[260px] rounded-xl border border-[#e7eaed] bg-white p-4 shadow-xl">
                    <label className="block text-xs font-semibold text-[#586477]">Statut<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "Tous" | UserStatus)} className="mt-1.5 h-10 w-full rounded-lg border border-[#e7eaed] bg-white px-3 text-sm font-normal text-[#293547]"><option>Tous</option><option>Actif</option><option>Suspendu</option></select></label>
                    <label className="mt-3 block text-xs font-semibold text-[#586477]">Rôle<select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-[#e7eaed] bg-white px-3 text-sm font-normal text-[#293547]"><option>Tous</option><option>Créatrice</option><option>Utilisateur</option></select></label>
                    <label className="mt-3 flex items-center gap-2 text-sm text-[#445064]"><input type="checkbox" checked={verifiedOnly} onChange={(event) => setVerifiedOnly(event.target.checked)} className="size-4 accent-[#242729]" />Compte vérifié uniquement</label>
                    <button type="button" onClick={() => { setStatusFilter("Tous"); setRoleFilter("Tous"); setVerifiedOnly(false); }} className="mt-3 text-xs font-semibold text-[#5c6879] underline underline-offset-2">Réinitialiser les filtres</button>
                  </div>}
                </div>
                <div className="relative">
                  <button type="button" onClick={() => setSortMenu((open) => !open)} aria-expanded={sortMenu} className="flex h-11 items-center gap-2 rounded-xl border border-[#e7eaed] bg-white px-3.5 text-sm font-medium text-[#445064]"><ArrowDownWideNarrow className="size-4" /><span>{sortOrder === "recent" ? "Plus récents" : "Plus anciens"}</span><ChevronDown className="size-3.5" /></button>
                  {sortMenu && <div className="absolute right-0 z-10 mt-2 w-40 rounded-xl border border-[#e7eaed] bg-white p-1.5 shadow-xl"><button type="button" onClick={() => { setSortOrder("recent"); setSortMenu(false); }} className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f5f6f7]">Plus récents</button><button type="button" onClick={() => { setSortOrder("oldest"); setSortMenu(false); }} className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f5f6f7]">Plus anciens</button></div>}
                </div>
              </div>
            </div>

            <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.8fr)]">
              <div className="min-w-0 overflow-hidden rounded-xl border border-[#edf0f2]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-left text-[13px]">
                    <thead className="bg-[#f6f7f8] text-[#667286]"><tr><th className="px-4 py-3 font-medium">Utilisateur</th><th className="px-3 py-3 font-medium">Email</th><th className="px-3 py-3 font-medium">Inscription</th><th className="px-3 py-3 font-medium">Activité</th><th className="px-3 py-3 font-medium">Statut</th><th className="px-3 py-3"><span className="sr-only">Actions</span></th></tr></thead>
                    <tbody>
                      {visibleUsers.map((item) => {
                        const selected = selectedUser?.id === item.id;
                        return <tr key={item.id} onClick={() => setSelectedId(item.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedId(item.id); }} tabIndex={0} aria-selected={selected} className={`cursor-pointer border-b border-[#edf0f2] transition hover:bg-[#fafbfc] ${selected ? "bg-[#f8fafb]" : "bg-white"}`}>
                          <td className="px-4 py-3"><div className="flex min-w-[175px] items-center gap-2.5"><Avatar user={item} size="size-9" /><span className="min-w-0"><span className="block truncate font-semibold text-[#202b3a]">{item.name}</span><span className="block text-xs text-[#8b95a4]">{item.handle}</span></span></div></td>
                          <td className="max-w-[185px] truncate px-3 py-3 text-[#697586]">{item.email}</td>
                          <td className="whitespace-nowrap px-3 py-3 text-[#697586]">{formatDate(item.joinedAt)}</td>
                          <td className="whitespace-nowrap px-3 py-3 text-[#697586]"><span className="flex items-center gap-1.5"><Clock3 className="size-3.5 text-[#a1a9b4]" />{item.activity}</span></td>
                          <td className="px-3 py-3"><StatusBadge status={item.status} /></td>
                          <td className="px-3 py-3"><button type="button" onClick={(event) => { event.stopPropagation(); setSelectedId(item.id); }} className="rounded-lg p-2 text-[#7e8998] hover:bg-[#f0f2f3] hover:text-[#222b38]" aria-label={`Voir le profil de ${item.name}`}><MoreHorizontal className="size-4" /></button></td>
                        </tr>;
                      })}
                      {visibleUsers.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-[#7d8796]">Aucun utilisateur trouvé.</td></tr>}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs text-[#7b8695]"><span>Affichage de {visibleUsers.length ? "1" : "0"} à {visibleUsers.length} sur 16 815 utilisateurs</span><div className="flex items-center gap-1"><button type="button" className="rounded-lg p-2 text-[#a0a8b4] hover:bg-[#f4f5f6]" aria-label="Page précédente"><ChevronLeft className="size-4" /></button><button type="button" className="size-8 rounded-lg bg-[#252829] text-xs font-semibold text-white" aria-current="page">1</button><button type="button" className="size-8 rounded-lg text-xs hover:bg-[#f4f5f6]">2</button><button type="button" className="size-8 rounded-lg text-xs hover:bg-[#f4f5f6]">3</button><span className="px-1">…</span><button type="button" className="rounded-lg p-2 hover:bg-[#f4f5f6]" aria-label="Page suivante"><ChevronRight className="size-4" /></button></div></div>
              </div>

              {selectedUser ? <aside className="rounded-xl border border-[#edf0f2] bg-white p-5 shadow-[0_8px_24px_rgba(24,35,52,0.025)] sm:p-6">
                <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b95a4]">Profil utilisateur</p><p className="mt-1 text-sm text-[#778294]">Informations du compte sélectionné</p></div><button type="button" onClick={() => setSelectedId(selectedUser.id)} className="rounded-lg p-2 text-[#788394] hover:bg-[#f4f5f6]" aria-label="Voir le profil"><Eye className="size-4" /></button></div>
                <div className="mt-5 flex items-center gap-3"><Avatar user={selectedUser} size="size-14" /><div className="min-w-0"><h2 className="truncate text-lg font-bold tracking-[-0.04em] text-[#151b23]">{selectedUser.name}</h2><p className="mt-0.5 text-sm text-[#7b8695]">{selectedUser.handle}</p></div></div>
                <div className="mt-4 flex flex-wrap gap-2"><StatusBadge status={selectedUser.status} />{selectedUser.verified && <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef5ff] px-3 py-1.5 text-xs font-semibold text-[#3d6fc3]"><CheckCircle2 className="size-3.5" />Vérifié</span>}</div>
                <div className="my-5 h-px bg-[#edf0f2]" />
                <dl className="space-y-4 text-sm">
                  <div className="flex items-start gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-[#9aa3b1]" /><div className="min-w-0"><dt className="text-xs text-[#8b95a4]">Adresse e-mail</dt><dd className="mt-0.5 break-all font-medium text-[#354154]">{selectedUser.email}</dd></div></div>
                  <div className="flex items-start gap-3"><CalendarDays className="mt-0.5 size-4 shrink-0 text-[#9aa3b1]" /><div><dt className="text-xs text-[#8b95a4]">Date d’inscription</dt><dd className="mt-0.5 font-medium text-[#354154]">{formatDate(selectedUser.joinedAt)}</dd></div></div>
                  <div className="flex items-start gap-3"><UserRound className="mt-0.5 size-4 shrink-0 text-[#9aa3b1]" /><div><dt className="text-xs text-[#8b95a4]">Rôle</dt><dd className="mt-0.5 font-medium text-[#354154]">{selectedUser.role}</dd></div></div>
                  <div className="flex items-start gap-3"><Building2 className="mt-0.5 size-4 shrink-0 text-[#9aa3b1]" /><div><dt className="text-xs text-[#8b95a4]">Entreprise</dt><dd className="mt-0.5 font-medium text-[#354154]">{selectedUser.company}</dd></div></div>
                  <div className="flex items-start gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-[#9aa3b1]" /><div><dt className="text-xs text-[#8b95a4]">Localisation</dt><dd className="mt-0.5 font-medium text-[#354154]">{selectedUser.location}</dd></div></div>
                  <div className="flex items-start gap-3"><Activity className="mt-0.5 size-4 shrink-0 text-[#9aa3b1]" /><div><dt className="text-xs text-[#8b95a4]">Dernière activité</dt><dd className="mt-0.5 font-medium text-[#354154]">{selectedUser.activity}</dd></div></div>
                </dl>
                <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-[#f6f7f8] p-3"><p className="text-xs text-[#8791a0]">Signalements</p><p className="mt-1 text-lg font-bold text-[#263142]">{selectedUser.reports}</p></div><div className="rounded-xl bg-[#f6f7f8] p-3"><p className="text-xs text-[#8791a0]">Abonnés</p><p className="mt-1 text-lg font-bold text-[#263142]">{selectedUser.followers}</p></div></div>
                {notes[selectedUser.id]?.length ? <div className="mt-4 rounded-xl border border-[#edf0f2] p-3"><p className="text-xs font-semibold text-[#687486]">Notes</p><ul className="mt-2 space-y-2">{notes[selectedUser.id].map((note, index) => <li key={`${selectedUser.id}-note-${index}`} className="text-sm leading-5 text-[#354154]">{note}</li>)}</ul></div> : null}
                <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2"><Button type="button" variant="outline" className="h-10 rounded-xl border-[#e5e8eb] text-sm" onClick={() => setSelectedId(selectedUser.id)}><Eye className="size-4" />Voir le profil</Button><Button type="button" variant="outline" className={`h-10 rounded-xl text-sm ${selectedUser.status === "Actif" ? "border-[#f0d1ce] text-[#bd4c43] hover:bg-[#fff4f2]" : "border-[#d4eadd] text-[#17834a] hover:bg-[#f0faf4]"}`} onClick={toggleSuspension}>{selectedUser.status === "Actif" ? <X className="size-4" /> : <Check className="size-4" />}{selectedUser.status === "Actif" ? "Suspendre" : "Réactiver"}</Button><Button type="button" className="h-10 rounded-xl bg-[#252829] text-sm text-white hover:bg-[#373a3b] sm:col-span-2 xl:col-span-1 2xl:col-span-2" onClick={() => setNoteOpen(true)}><MoreHorizontal className="size-4" />Ajouter une note</Button></div>
              </aside> : <aside className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-[#dfe3e7] bg-white p-6 text-center text-sm text-[#778294]">Sélectionnez un utilisateur pour afficher son profil.</aside>}
            </div>
          </section>

          <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#dfe4e8] pt-4 text-xs text-[#8b95a4]"><span>Dernière synchronisation : aujourd’hui à 11:03</span><span>Utilisateurs Mansa Hub</span></footer>
        </main>
      </div>

      {noteOpen && selectedUser && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#16202a]/35 p-4" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setNoteOpen(false); }}><div role="dialog" aria-modal="true" aria-labelledby="note-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><h2 id="note-title" className="text-lg font-bold text-[#172033]">Ajouter une note</h2><p className="mt-1 text-sm text-[#7b8695]">Profil de {selectedUser.name}</p></div><button type="button" onClick={() => setNoteOpen(false)} className="rounded-lg p-2 text-[#7b8695] hover:bg-[#f3f4f5]" aria-label="Fermer"><X className="size-4" /></button></div><label className="mt-5 block text-sm font-medium text-[#354154]">Note<textarea autoFocus value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} rows={4} className="mt-2 w-full resize-y rounded-xl border border-[#e5e8eb] p-3 text-sm outline-none focus:border-[#9ca3af]" placeholder="Saisir une note..." /></label><div className="mt-5 flex justify-end gap-2"><Button type="button" variant="outline" className="rounded-xl" onClick={() => setNoteOpen(false)}>Annuler</Button><Button type="button" className="rounded-xl bg-[#252829] text-white hover:bg-[#373a3b]" onClick={saveNote} disabled={!noteDraft.trim()}>Enregistrer</Button></div></div></div>}
    </div>
  );
}
