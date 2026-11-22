import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  CreditCard,
  FileCheck2,
  Flag,
  Headphones,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  MoreHorizontal,
  Play,
  Search,
  Settings,
  Shield,
  ShoppingBag,
  Sun,
  Users,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type VerificationStatus = "Approuvé" | "En attente";
type BusinessStatus = "Active" | "Limitée (Enquête)" | "Suspendue";
type DetailsTab = "Résumé & Métriques" | "Produits" | "Dashboard Financier";

type Business = {
  id: string;
  name: string;
  category: string;
  owner: string;
  email: string;
  ownerInitials: string;
  ownerColor: string;
  logoColor: string;
  logoIcon?: LucideIcon;
  logoText?: string;
  verification: VerificationStatus;
  status: BusinessStatus;
  products: number;
  members: number;
  gmv: number;
  refundRate: number;
  productNames: string[];
  gmvTrend?: string;
  commissionTrend?: string;
  memberTrend?: string;
  refundTrend?: string;
};

const navigation: { label: string; icon: LucideIcon; path?: string }[] = [
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
  { label: "Paramètres", icon: Settings, path: "/settings" },
];

const initialBusinesses: Business[] = [
  {
    id: "biz-kora",
    name: "Kora Academy",
    category: "Formation & Éducation",
    owner: "Aminata K.",
    email: "aminata@koraacademy.com",
    ownerInitials: "AK",
    ownerColor: "bg-[#a35e46]",
    logoColor: "bg-[#f6f0e7] text-[#68713c]",
    logoIcon: Leaf,
    verification: "Approuvé",
    status: "Active",
    products: 24,
    members: 1284,
    gmv: 12450000,
    refundRate: 2.1,
    productNames: ["Cours en ligne", "Parcours certifiants", "Ateliers pratiques"],
    gmvTrend: "+12 %",
    commissionTrend: "+10 %",
    memberTrend: "+8 %",
    refundTrend: "−0,6 %",
  },
  {
    id: "biz-naya",
    name: "Naya Studio",
    category: "Studio créatif",
    owner: "Ibrahim D.",
    email: "ibrahim@naya.studio",
    ownerInitials: "ID",
    ownerColor: "bg-[#76513c]",
    logoColor: "bg-[#fff0f4] text-[#e94a82]",
    logoIcon: Activity,
    verification: "Approuvé",
    status: "Limitée (Enquête)",
    products: 17,
    members: 892,
    gmv: 8320000,
    refundRate: 5.8,
    productNames: ["Identité visuelle", "Création de contenu", "Direction artistique"],
  },
  {
    id: "biz-mansa",
    name: "Mansa Digital",
    category: "Technologie & Services",
    owner: "Fatou S.",
    email: "fatou@mansadigital.com",
    ownerInitials: "FS",
    ownerColor: "bg-[#9b6446]",
    logoColor: "bg-[#101820] text-white",
    logoText: "M",
    verification: "Approuvé",
    status: "Active",
    products: 31,
    members: 2134,
    gmv: 28900000,
    refundRate: 1.9,
    productNames: ["Mansa Pro", "Mansa Pay", "Mansa Connect"],
  },
  {
    id: "biz-sunu",
    name: "Sunu Formations",
    category: "Formation professionnelle",
    owner: "Cheikh N.",
    email: "cheikh@sunuform.com",
    ownerInitials: "CN",
    ownerColor: "bg-[#624738]",
    logoColor: "bg-[#fff7df] text-[#d89b12]",
    logoIcon: Sun,
    verification: "En attente",
    status: "Active",
    products: 12,
    members: 423,
    gmv: 4860000,
    refundRate: 3.4,
    productNames: ["Bureautique", "Gestion de projet", "Marketing digital"],
  },
  {
    id: "biz-teranga",
    name: "Teranga Shop",
    category: "Commerce & Distribution",
    owner: "Mariama L.",
    email: "mariama@terangashop.sn",
    ownerInitials: "ML",
    ownerColor: "bg-[#a36b51]",
    logoColor: "bg-[#f3f4f4] text-[#334155]",
    logoIcon: ShoppingBag,
    verification: "Approuvé",
    status: "Active",
    products: 56,
    members: 3205,
    gmv: 41750000,
    refundRate: 2.7,
    productNames: ["Mode & accessoires", "Maison", "Beauté"],
  },
  {
    id: "biz-baobab",
    name: "Baobab Tech",
    category: "Technologie & Services",
    owner: "Ousmane T.",
    email: "ousmane@baobabtech.ci",
    ownerInitials: "OT",
    ownerColor: "bg-[#715343]",
    logoColor: "bg-[#eef4e9] text-[#4d7839]",
    logoIcon: Building2,
    verification: "En attente",
    status: "Suspendue",
    products: 8,
    members: 310,
    gmv: 2100000,
    refundRate: 6.2,
    productNames: ["Hébergement cloud", "Conseil numérique", "Support technique"],
  },
  {
    id: "biz-afriklearn",
    name: "AfrikLearn",
    category: "Formation & Éducation",
    owner: "Aïssatou M.",
    email: "aissatou@afriklearn.com",
    ownerInitials: "AM",
    ownerColor: "bg-[#c18b67]",
    logoColor: "bg-[#eff2f8] text-[#18253d]",
    logoIcon: BookOpen,
    verification: "Approuvé",
    status: "Active",
    products: 19,
    members: 1041,
    gmv: 15680000,
    refundRate: 2.9,
    productNames: ["Langues", "Préparation aux examens", "Compétences numériques"],
  },
  {
    id: "biz-dakarcrea",
    name: "Dakar Créa",
    category: "Création & Design",
    owner: "Mamadou B.",
    email: "mamadou@dakarcrea.sn",
    ownerInitials: "MB",
    ownerColor: "bg-[#805d46]",
    logoColor: "bg-[#f3f4f6] text-[#1f2937]",
    logoText: "DC",
    verification: "Approuvé",
    status: "Limitée (Enquête)",
    products: 11,
    members: 580,
    gmv: 6240000,
    refundRate: 4.8,
    productNames: ["Photographie", "Studio graphique", "Impression"],
  },
  {
    id: "biz-sahel",
    name: "Sahel Market",
    category: "Commerce & Distribution",
    owner: "Khady D.",
    email: "khady@sahelmarket.ml",
    ownerInitials: "KD",
    ownerColor: "bg-[#a96d53]",
    logoColor: "bg-[#f8f0e5] text-[#9b6a35]",
    logoIcon: ShoppingBag,
    verification: "En attente",
    status: "Active",
    products: 27,
    members: 1876,
    gmv: 22100000,
    refundRate: 3.1,
    productNames: ["Produits locaux", "Épicerie", "Artisanat"],
  },
  {
    id: "biz-jangoo",
    name: "Jangoo Santé",
    category: "Santé & Bien-être",
    owner: "Abdoulaye S.",
    email: "abdoulaye@jangoosante.com",
    ownerInitials: "AS",
    ownerColor: "bg-[#694c3b]",
    logoColor: "bg-[#eaf7f1] text-[#13866c]",
    logoIcon: Activity,
    verification: "Approuvé",
    status: "Active",
    products: 15,
    members: 702,
    gmv: 9540000,
    refundRate: 2.5,
    productNames: ["Téléconsultation", "Prévention santé", "Bien-être"],
  },
];

const detailTabs: DetailsTab[] = ["Résumé & Métriques", "Produits", "Dashboard Financier"];

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

function formatCurrency(value: number) {
  return `${formatNumber(value)} FCFA`;
}

function Logo({ business, size = "size-10" }: { business: Business; size?: string }) {
  const Icon = business.logoIcon;
  return (
    <span className={`inline-flex ${size} shrink-0 items-center justify-center rounded-xl ${business.logoColor}`} aria-hidden="true">
      {Icon ? <Icon className="size-5" strokeWidth={2.1} /> : <span className="text-sm font-black tracking-[-0.06em]">{business.logoText}</span>}
    </span>
  );
}

function StatusBadge({ status }: { status: BusinessStatus }) {
  const style = status === "Active"
    ? "bg-[#e6f7ee] text-[#23935a]"
    : status === "Suspendue"
      ? "bg-[#ffeded] text-[#d84444]"
      : "bg-[#fff3df] text-[#b77a1e]";
  return <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${style}`}>{status}</span>;
}

function VerificationBadge({ status }: { status: VerificationStatus }) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${status === "Approuvé" ? "bg-[#e5f7ee] text-[#23935a]" : "bg-[#f0f2f5] text-[#596579]"}`}>
      {status}
    </span>
  );
}

function DetailMetric({
  label,
  value,
  trend,
  trendDown = false,
}: {
  label: string;
  value: string;
  trend?: string;
  trendDown?: boolean;
}) {
  const TrendIcon = trendDown ? ArrowDownRight : ArrowUpRight;
  return (
    <div className="min-h-[98px] rounded-xl border border-[#edf0f3] bg-white p-3.5">
      <p className="text-xs text-[#7b8493]">{label}</p>
      <p className="mt-1.5 text-[18px] font-semibold tracking-[-0.04em] text-[#172033]">{value}</p>
      {trend && <p className={`mt-1.5 flex items-center gap-1.5 text-xs ${trendDown ? "text-[#24a15d]" : "text-[#26a05d]"}`}><TrendIcon className="size-3.5" />{trend}<span className="text-[#929aa7]">vs. mois dernier</span></p>}
    </div>
  );
}

export default function Businesses() {
  const [, setLocation] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation({ onSuccess: () => setLocation("/login") });
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [selectedId, setSelectedId] = useState(initialBusinesses[0].id);
  const [selectedTab, setSelectedTab] = useState<DetailsTab>("Résumé & Métriques");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous les statuts");
  const [mobileNav, setMobileNav] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [rowMenuId, setRowMenuId] = useState<string | null>(null);
  const [manageIntegrations, setManageIntegrations] = useState(false);

  const selectedBusiness = businesses.find((business) => business.id === selectedId) ?? businesses[0];
  const filteredBusinesses = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase("fr");
    return businesses.filter((business) => {
      const matchesSearch = !normalizedQuery || [business.name, business.owner, business.email, business.category].join(" ").toLocaleLowerCase("fr").includes(normalizedQuery);
      const matchesStatus = statusFilter === "Tous les statuts" || business.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [businesses, searchQuery, statusFilter]);

  function updateBusinessStatus(businessId: string, status: BusinessStatus) {
    setBusinesses((current) => current.map((business) => business.id === businessId ? { ...business, status } : business));
    setRowMenuId(null);
    toast.success(status === "Suspendue" ? "Entreprise suspendue" : "Entreprise réactivée");
  }

  function chooseBusiness(businessId: string) {
    setSelectedId(businessId);
    setSelectedTab("Résumé & Métriques");
    setShowDetails(true);
    setManageIntegrations(false);
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
              const active = label === "Entreprises";
              return (
                <button key={label} type="button" onClick={() => { setMobileNav(false); if (path) setLocation(path); }} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${active ? "bg-[#eef0f2] font-bold text-[#111827]" : "text-[#657184] hover:bg-[#f7f8f9] hover:text-[#273142]"}`} aria-current={active ? "page" : undefined}>
                  <Icon className="size-[18px]" />{label}
                </button>
              );
            })}
          </nav>

          <button type="button" onClick={() => { setMobileNav(false); setLocation("/support"); }} className="mt-auto block w-full rounded-2xl bg-[#242729] p-5 text-left text-white transition hover:bg-[#303334]">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/10"><Headphones className="size-5" /></span>
            <span className="mt-4 block text-sm font-bold">Support client</span>
            <span className="mt-2 block text-xs leading-5 text-white/75">Pour les utilisateurs, contacter l’équipe de maintenance.</span>
            <span className="mt-4 flex items-center gap-2 text-xs font-bold">Ouvrir la file <ChevronRight className="size-3.5" /></span>
          </button>
        </aside>

        {mobileNav && <button className="fixed inset-0 z-20 bg-[#16202a]/30 lg:hidden" onClick={() => setMobileNav(false)} aria-label="Fermer le menu" />}

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-7 sm:py-7 lg:px-8 lg:py-8">
          <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
            <div className="flex min-w-0 items-center gap-3">
              <button className="rounded-xl bg-white p-2.5 text-[#273142] shadow-sm lg:hidden" onClick={() => setMobileNav(true)} aria-label="Ouvrir le menu"><Menu className="size-5" /></button>
              <div className="min-w-0">
                <h1 className="text-[28px] font-semibold tracking-[-0.045em] text-[#111827] sm:text-[34px]">Entreprises</h1>
                <p className="mt-0.5 hidden text-sm text-[#778191] sm:block">Surveillez les entreprises, leurs performances et les risques associés.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" className="relative flex size-11 items-center justify-center rounded-full bg-white text-[#172033] shadow-sm" aria-label="Notifications"><Bell className="size-5" /><span className="absolute right-[12px] top-[10px] size-2 rounded-full bg-[#e54747] ring-2 ring-white" /></button>
              <button type="button" className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-[#aa755d] to-[#30343a] text-sm font-bold text-white shadow-sm" aria-label="Compte administrateur">JD</button>
              <button type="button" className="hidden text-[#647184] hover:text-[#172033] sm:inline-flex" onClick={() => logoutMutation.mutate()} aria-label="Se déconnecter"><LogOut className="size-4" /></button>
            </div>
          </header>
          <p className="mt-1 text-sm text-[#778191] sm:hidden">Surveillez les entreprises, leurs performances et les risques associés.</p>

          <div className="mt-6 grid gap-3 md:grid-cols-[minmax(260px,1fr)_96px_190px]">
            <label className="relative min-w-0">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#172033]" />
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Rechercher une entreprise ou un propriétaire..." aria-label="Rechercher une entreprise ou un propriétaire" className="h-11 w-full rounded-xl border border-[#edf0f3] bg-white pl-11 pr-4 text-sm text-[#273142] outline-none placeholder:text-[#929aa7] focus:ring-2 focus:ring-[#d8dde5]" />
            </label>
            <div className="relative">
              <button type="button" onClick={() => setCurrencyMenuOpen((open) => !open)} className="flex h-11 w-full items-center justify-between rounded-xl border border-[#edf0f3] bg-white px-4 text-sm text-[#273142]">
                FCFA<ChevronDown className="size-4" />
              </button>
              {currencyMenuOpen && <div className="absolute left-0 top-12 z-20 w-48 rounded-xl border border-[#edf0f3] bg-white p-1.5 shadow-lg"><button type="button" onClick={() => setCurrencyMenuOpen(false)} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-[#273142] hover:bg-[#f6f7f9]">Franc CFA (FCFA)<Check className="size-4 text-[#26945b]" /></button></div>}
            </div>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filtrer par statut" className="h-11 w-full appearance-none rounded-xl border border-[#edf0f3] bg-white px-4 pr-10 text-sm text-[#273142] outline-none focus:ring-2 focus:ring-[#d8dde5]">
              <option>Tous les statuts</option>
              <option>Active</option>
              <option>Limitée (Enquête)</option>
              <option>Suspendue</option>
            </select>
          </div>

          <div className={`mt-6 grid min-w-0 items-start gap-4 ${showDetails ? "2xl:grid-cols-[minmax(0,1fr)_420px]" : "grid-cols-1"}`}>
            <section className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(24,35,52,0.04)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[930px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#edf0f3] bg-white text-[12px] font-medium text-[#667085]">
                      <th className="px-4 py-4 font-medium">Entreprise</th>
                      <th className="px-3 py-4 font-medium">Propriétaire</th>
                      <th className="px-3 py-4 font-medium">KYC propriétaire</th>
                      <th className="px-3 py-4 font-medium">Statut</th>
                      <th className="px-3 py-4 text-center font-medium">Produits</th>
                      <th className="px-3 py-4 text-center font-medium">Membres</th>
                      <th className="px-3 py-4 font-medium">Volume brut (GMV)</th>
                      <th className="px-3 py-4 font-medium">Taux rembours.</th>
                      <th className="w-12 px-2 py-4"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBusinesses.map((business) => {
                      const active = business.id === selectedId;
                      return (
                        <tr key={business.id} onClick={() => chooseBusiness(business.id)} className={`cursor-pointer border-b border-[#edf0f3] transition hover:bg-[#f8f9fb] ${active ? "bg-[#f3f4f6]" : "bg-white"}`} aria-selected={active}>
                          <td className="px-3 py-3">
                            <div className="flex min-w-[126px] items-center gap-2.5">
                              <Logo business={business} size="size-9" />
                              <span className="text-[12px] font-medium leading-4 text-[#172033]">{business.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <p className="whitespace-nowrap text-[12px] font-medium text-[#172033]">{business.owner}</p>
                            <p className="mt-0.5 max-w-[142px] truncate text-[10px] text-[#8992a1]">{business.email}</p>
                          </td>
                          <td className="px-3 py-3"><VerificationBadge status={business.verification} /></td>
                          <td className="px-3 py-3"><StatusBadge status={business.status} /></td>
                          <td className="px-3 py-3 text-center text-[12px] text-[#273142]">{business.products}</td>
                          <td className="px-3 py-3 text-center text-[12px] text-[#273142]">{formatNumber(business.members)}</td>
                          <td className="whitespace-nowrap px-3 py-3 text-[12px] leading-5 text-[#273142]">{formatNumber(business.gmv)}<br />FCFA</td>
                          <td className={`whitespace-nowrap px-3 py-3 text-[12px] ${business.refundRate >= 4.5 ? "font-semibold text-[#d83e3e]" : "text-[#273142]"}`}>{business.refundRate.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %</td>
                          <td className="px-2 py-3">
                            <div className="relative">
                              <button type="button" onClick={(event) => { event.stopPropagation(); setRowMenuId((current) => current === business.id ? null : business.id); }} className="rounded-lg p-1.5 text-[#647184] hover:bg-white hover:text-[#172033]" aria-label={`Actions pour ${business.name}`}><MoreHorizontal className="size-5" /></button>
                              {rowMenuId === business.id && <div className="absolute right-0 top-9 z-20 w-48 rounded-xl border border-[#edf0f3] bg-white p-1.5 shadow-lg" onClick={(event) => event.stopPropagation()}>
                                <button type="button" onClick={() => { chooseBusiness(business.id); setRowMenuId(null); }} className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#455064] hover:bg-[#f6f7f9]">Ouvrir le détail</button>
                                <button type="button" onClick={() => updateBusinessStatus(business.id, business.status === "Suspendue" ? "Active" : "Suspendue")} className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#c84242] hover:bg-[#fff4f4]">{business.status === "Suspendue" ? "Réactiver l’entreprise" : "Suspendre l’entreprise"}</button>
                              </div>}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredBusinesses.length === 0 && <tr><td colSpan={9} className="px-6 py-14 text-center text-sm text-[#7b8492]">Aucune entreprise trouvée.</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>

            {showDetails && <aside className="relative min-w-0 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(24,35,52,0.05)]">
              <button type="button" onClick={() => setShowDetails(false)} className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-[#687386] hover:bg-[#f2f3f6]" aria-label="Fermer le détail"><X className="size-4" /></button>
              <div className="max-h-[calc(100vh-48px)] overflow-y-auto px-5 pb-5 pt-5 sm:px-6">
                <div className="flex items-center gap-4 pr-7">
                  <Logo business={selectedBusiness} size="size-[62px]" />
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-semibold tracking-[-0.035em] text-[#111827]">{selectedBusiness.name}</h2>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-xs text-[#818a99]">{selectedBusiness.category}</span>
                      <StatusBadge status={selectedBusiness.status} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-b border-[#edf0f3] pb-4">
                  <p className="mb-2 text-xs text-[#818a99]">Propriétaire</p>
                  <div className="flex items-center gap-3">
                    <span className={`flex size-10 items-center justify-center rounded-full ${selectedBusiness.ownerColor} text-xs font-bold text-white`}>{selectedBusiness.ownerInitials}</span>
                    <div className="min-w-0"><p className="text-sm font-semibold text-[#172033]">{selectedBusiness.owner}</p><p className="truncate text-xs text-[#818a99]">{selectedBusiness.email}</p></div>
                  </div>
                </div>

                <div className="sticky top-0 z-[1] -mx-5 flex gap-1 overflow-x-auto border-b border-[#edf0f3] bg-white px-4 sm:-mx-6 sm:px-5">
                  {detailTabs.map((tab) => <button key={tab} type="button" onClick={() => setSelectedTab(tab)} className={`whitespace-nowrap border-b-2 px-2.5 py-3 text-xs font-medium transition ${selectedTab === tab ? "border-[#1f2937] text-[#172033]" : "border-transparent text-[#667085] hover:text-[#172033]"}`} aria-current={selectedTab === tab ? "page" : undefined}>{tab}</button>)}
                </div>

                {selectedTab === "Résumé & Métriques" && <>
                  <div className="grid grid-cols-2 gap-2.5 py-3">
                    <DetailMetric label="Volume brut cumulé" value={formatCurrency(selectedBusiness.gmv)} trend={selectedBusiness.gmvTrend} />
                    <DetailMetric label="Commissions Mansa" value={formatCurrency(Math.round(selectedBusiness.gmv / 10))} trend={selectedBusiness.commissionTrend} />
                    <DetailMetric label="Membres actifs" value={formatNumber(selectedBusiness.members)} trend={selectedBusiness.memberTrend} />
                    <DetailMetric label="Taux de remboursement" value={`${selectedBusiness.refundRate.toLocaleString("fr-FR", { minimumFractionDigits: 1 })} %`} trend={selectedBusiness.refundTrend} trendDown />
                  </div>

                  <div className="mt-2">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-[#172033]">Intégrations actives</h3>
                      <button type="button" onClick={() => setManageIntegrations((open) => !open)} className="text-xs font-medium text-[#3271b9] hover:text-[#1d5797]">{manageIntegrations ? "Fermer" : "Gérer"}</button>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-[#edf0f3]">
                      <IntegrationRow icon="youtube" name="YouTube" detail="Chaîne connectée" />
                      <IntegrationRow icon="stripe" name="Stripe" detail="Paiements connectés" />
                    </div>
                    {manageIntegrations && <div className="mt-2 rounded-xl bg-[#f6f7f9] p-3 text-xs leading-5 text-[#647184]">YouTube et Stripe sont affichés comme intégrations actives de {selectedBusiness.name}.</div>}
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-[#172033]">Dashboard financier</h3>
                      <button type="button" onClick={() => setSelectedTab("Dashboard Financier")} className="inline-flex items-center gap-1 text-xs font-medium text-[#3271b9]">Voir tous les détails<ArrowRight className="size-3.5" /></button>
                    </div>
                    <FinanceSummary />
                  </div>
                </>}

                {selectedTab === "Produits" && <div className="py-4">
                  <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-semibold text-[#172033]">Produits de l’entreprise</h3><span className="rounded-full bg-[#f1f3f5] px-2.5 py-1 text-xs text-[#556174]">{selectedBusiness.products}</span></div>
                  <div className="space-y-2">
                    {selectedBusiness.productNames.map((product, index) => <div key={product} className="flex items-center gap-3 rounded-xl border border-[#edf0f3] p-3"><span className="flex size-9 items-center justify-center rounded-lg bg-[#f3f5f7] text-[#526073]"><BookOpen className="size-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-[#273142]">{product}</p><p className="text-xs text-[#8992a1]">Produit {String(index + 1).padStart(2, "0")}</p></div><CheckCircle2 className="size-4 text-[#26945b]" /></div>)}
                  </div>
                  <p className="mt-3 text-xs text-[#8992a1]">{selectedBusiness.products} produits au catalogue</p>
                </div>}

                {selectedTab === "Dashboard Financier" && <div className="py-4"><h3 className="mb-3 text-sm font-semibold text-[#172033]">Paramètres financiers</h3><FinanceSummary /><div className="mt-4 grid grid-cols-2 gap-2.5"><DetailMetric label="Volume brut cumulé" value={formatCurrency(selectedBusiness.gmv)} /><DetailMetric label="Commissions Mansa" value={formatCurrency(Math.round(selectedBusiness.gmv / 10))} /></div></div>}

                <div className="mt-5 border-t border-[#edf0f3] pt-4">
                  <button type="button" onClick={() => updateBusinessStatus(selectedBusiness.id, selectedBusiness.status === "Suspendue" ? "Active" : "Suspendue")} className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-medium transition ${selectedBusiness.status === "Suspendue" ? "border-[#d8eadf] text-[#21834f] hover:bg-[#f1faf4]" : "border-[#e45757] text-[#d84646] hover:bg-[#fff5f5]"}`}>
                    {selectedBusiness.status === "Suspendue" ? <><CheckCircle2 className="size-4" />Réactiver l’entreprise</> : <><span className="text-base">⊘</span>Suspendre l’entreprise</>}
                  </button>
                </div>
              </div>
            </aside>}
          </div>
        </main>
      </div>
    </div>
  );
}

function IntegrationRow({ icon, name, detail }: { icon: "youtube" | "stripe"; name: string; detail: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-[#edf0f3] px-3 py-2.5 last:border-b-0">
      <span className={`flex size-8 items-center justify-center rounded-lg ${icon === "youtube" ? "bg-[#fff0ef] text-[#e62117]" : "bg-[#f1edff] text-[#635bff]"}`}>
        {icon === "youtube" ? <Play className="size-4 fill-current" /> : <span className="text-sm font-black">S</span>}
      </span>
      <div className="min-w-0 flex-1"><p className="text-sm font-medium text-[#273142]">{name}</p><p className="text-xs text-[#8992a1]">{detail}</p></div>
      <span className="rounded-full bg-[#e6f7ee] px-3 py-1 text-xs font-medium text-[#23935a]">Connecté</span>
    </div>
  );
}

function FinanceSummary() {
  return (
    <div className="rounded-xl bg-[#f2f3f6] p-3.5">
      <FinanceRow icon={Clock3} label="Rétention standard" value="72 h" />
      <FinanceRow icon={Users} label="Seuil minimum" value="5 000 FCFA" />
      <FinanceRow icon={CreditCard} label="Moyens de versement" value="Orange Money, MTN Money, Wave, Virement bancaire" />
    </div>
  );
}

function FinanceRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return <div className="grid grid-cols-[22px_minmax(0,1fr)] gap-3 py-1.5"><Icon className="mt-1 size-4 text-[#334155]" /><div><p className="text-xs text-[#778191]">{label}</p><p className="mt-0.5 text-sm leading-5 text-[#273142]">{value}</p></div></div>;
}
