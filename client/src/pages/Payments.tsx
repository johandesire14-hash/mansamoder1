import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Building2,
  Check,
  Clock3,
  ChevronRight,
  CreditCard,
  CircleDollarSign,
  Clipboard,
  ExternalLink,
  FileCheck2,
  FileText,
  Flag,
  Headphones,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Shield,
  Users,
  WalletCards,
  X,
  Hourglass,
} from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

type PaymentStatus = "Payé" | "En attente" | "Échoué";
type Filter = "Toutes" | "En attente" | "Payées" | "Échouées";

type Transaction = {
  reference: string;
  user: string;
  handle: string;
  initials: string;
  avatar: string;
  type: string;
  amount: string;
  date: string;
  time: string;
  status: PaymentStatus;
  fee: string;
  net: string;
  method: string;
  internalId: string;
};

const transactions: Transaction[] = [
  { reference: "TRX-45821", user: "Aminata K.", handle: "@aminata.k", initials: "AK", avatar: "bg-[#d8ad8d]", type: "Versement créateur", amount: "+ 320,00 $", date: "30 sept. 2024", time: "11:03", status: "Payé", fee: "- 32,00 $ (10%)", net: "288,00 $", method: "Virement bancaire", internalId: "PAY_7f3a2c8e" },
  { reference: "TRX-45820", user: "Ibrahim D.", handle: "@ibrahim.d", initials: "ID", avatar: "bg-[#76513c]", type: "Abonnement entreprise", amount: "+ 99,00 $", date: "29 sept. 2024", time: "14:27", status: "Payé", fee: "- 9,90 $ (10%)", net: "89,10 $", method: "Carte bancaire", internalId: "PAY_7f3a2c8d" },
  { reference: "TRX-45819", user: "Fatou S.", handle: "@fatou.s", initials: "FS", avatar: "bg-[#9b6446]", type: "Versement créateur", amount: "+ 150,00 $", date: "29 sept. 2024", time: "09:12", status: "En attente", fee: "- 15,00 $ (10%)", net: "135,00 $", method: "Virement bancaire", internalId: "PAY_7f3a2c8c" },
  { reference: "TRX-45818", user: "Moussa T.", handle: "@moussa.t", initials: "MT", avatar: "bg-[#64442f]", type: "Achat de crédits", amount: "+ 49,00 $", date: "28 sept. 2024", time: "16:45", status: "Payé", fee: "- 4,90 $ (10%)", net: "44,10 $", method: "Carte bancaire", internalId: "PAY_7f3a2c8b" },
  { reference: "TRX-45817", user: "Kadiatou M.", handle: "@kadiatou.m", initials: "KM", avatar: "bg-[#ad7957]", type: "Versement créateur", amount: "+ 275,00 $", date: "28 sept. 2024", time: "10:21", status: "Payé", fee: "- 27,50 $ (10%)", net: "247,50 $", method: "Virement bancaire", internalId: "PAY_7f3a2c8a" },
  { reference: "TRX-45816", user: "Youssouf B.", handle: "@youssouf.b", initials: "YB", avatar: "bg-[#554034]", type: "Abonnement entreprise", amount: "+ 199,00 $", date: "27 sept. 2024", time: "13:09", status: "Échoué", fee: "0,00 $", net: "0,00 $", method: "Carte bancaire", internalId: "PAY_7f3a2c89" },
  { reference: "TRX-45815", user: "Aïssata C.", handle: "@aissata.c", initials: "AC", avatar: "bg-[#c28a67]", type: "Versement créateur", amount: "+ 420,00 $", date: "26 sept. 2024", time: "18:36", status: "Payé", fee: "- 42,00 $ (10%)", net: "378,00 $", method: "Virement bancaire", internalId: "PAY_7f3a2c88" },
  { reference: "TRX-45814", user: "Salif N.", handle: "@salif.n", initials: "SN", avatar: "bg-[#805d46]", type: "Achat de crédits", amount: "+ 29,00 $", date: "26 sept. 2024", time: "09:44", status: "En attente", fee: "- 2,90 $ (10%)", net: "26,10 $", method: "Carte bancaire", internalId: "PAY_7f3a2c87" },
];

const filters: Filter[] = ["Toutes", "En attente", "Payées", "Échouées"];

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
  { label: "Paramètres", icon: Settings, path: "/settings" },
];

function StatusPill({ status }: { status: PaymentStatus }) {
  const color = status === "Payé"
    ? "bg-[#e1f6eb] text-[#16834a]"
    : status === "Échoué"
      ? "bg-[#ffeded] text-[#d73737]"
      : "bg-[#f1f3f5] text-[#596579]";
  return <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${color}`}>{status}</span>;
}

function Avatar({ transaction, size = "size-9" }: { transaction: Transaction; size?: string }) {
  return (
    <span className={`inline-flex ${size} shrink-0 items-center justify-center rounded-full ${transaction.avatar} text-[11px] font-bold text-white ring-2 ring-white`} aria-hidden="true">
      {transaction.initials}
    </span>
  );
}

function MetricCard({
  label,
  value,
  change,
  comparison,
  icon: Icon,
  dark = false,
  negative = false,
}: {
  label: string;
  value: string;
  change: string;
  comparison: string;
  icon: typeof CircleDollarSign;
  dark?: boolean;
  negative?: boolean;
}) {
  return (
    <section className={`rounded-2xl p-5 sm:p-6 ${dark ? "bg-[#282a2b] text-white" : "bg-white text-[#172033] shadow-[0_8px_24px_rgba(24,35,52,0.035)]"}`}>
      <div className="flex items-start justify-between gap-3">
        <p className={`text-sm ${dark ? "text-white/70" : "text-[#697586]"}`}>{label}</p>
        <span className={`flex size-11 items-center justify-center rounded-xl ${dark ? "bg-white/10 text-white" : "bg-[#f2f4f5] text-[#18212d]"}`}><Icon className="size-5" /></span>
      </div>
      <p className="mt-4 text-[29px] font-bold tracking-[-0.06em] sm:text-[33px]">{value}</p>
      <p className={`mt-2 flex flex-wrap items-center gap-2 text-xs ${negative ? "text-[#dc3b3b]" : "text-[#19a664]"}`}>
        {negative ? <ArrowUpRight className="size-4" /> : <ArrowUpRight className="size-4" />}
        <span className="font-semibold">{change}</span>
        <span className={dark ? "text-white/65" : "text-[#9aa3b1]"}>{comparison}</span>
      </p>
    </section>
  );
}

export default function Payments() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation({ onSuccess: () => setLocation("/login") });
  const [mobileNav, setMobileNav] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("Toutes");
  const [selectedReference, setSelectedReference] = useState(transactions[0].reference);
  const [copied, setCopied] = useState("");

  const visibleTransactions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr");
    return transactions.filter((transaction) => {
      const matchesFilter = filter === "Toutes"
        || (filter === "Payées" && transaction.status === "Payé")
        || (filter === "En attente" && transaction.status === "En attente")
        || (filter === "Échouées" && transaction.status === "Échoué");
      const searchableText = `${transaction.reference} ${transaction.user} ${transaction.handle} ${transaction.type} ${transaction.internalId}`.toLocaleLowerCase("fr");
      return matchesFilter && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [filter, query]);

  const selectedTransaction = visibleTransactions.find((transaction) => transaction.reference === selectedReference)
    ?? visibleTransactions[0]
    ?? transactions[0];

  async function copyValue(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      window.setTimeout(() => setCopied(""), 1400);
    } catch {
      setCopied("");
    }
  }

  const adminInitials = user?.name?.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "MH";

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
              const active = label === "Paiements";
              const className = `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${active ? "bg-[#eef0f2] font-bold text-[#111827]" : "text-[#657184] hover:bg-[#f7f8f9] hover:text-[#273142]"}`;
              return path ? (
                <button key={label} type="button" className={className} onClick={() => { setMobileNav(false); setLocation(path); }} aria-current={active ? "page" : undefined}>
                  <Icon className="size-[18px]" />{label}
                </button>
              ) : (
                <button key={label} type="button" className={className}>
                  <Icon className="size-[18px]" />{label}
                </button>
              );
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
              <h1 className="text-[28px] font-bold tracking-[-0.06em] text-[#111827] sm:text-[34px]">Paiements</h1>
            </div>
            <div className="flex w-full items-center gap-3 sm:w-auto">
              <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full bg-white px-4 text-[#152033] shadow-sm sm:w-[280px] sm:flex-none lg:w-[330px]">
                <Search className="size-5 shrink-0" />
                <span className="sr-only">Rechercher</span>
                <input className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#9aa3b1]" placeholder="Rechercher..." />
              </label>
              <button type="button" className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-[#152033] shadow-sm" aria-label="Notifications"><Bell className="size-5" /><span className="absolute right-[13px] top-[11px] size-2 rounded-full bg-[#df302f]" /></button>
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#72543f] text-xs font-bold text-white" aria-label="Compte administrateur">{adminInitials}</div>
              <Button variant="ghost" size="icon" className="shrink-0 rounded-full text-[#64748b]" onClick={() => logoutMutation.mutate()} aria-label="Se déconnecter" disabled={logoutMutation.isPending}><LogOut className="size-4" /></Button>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <MetricCard label="Revenus de la plateforme" value="23 902 $" change="12%" comparison="par rapport au mois dernier" icon={WalletCards} dark />
            <MetricCard label="Revenus des créateurs" value="12 580 $" change="6%" comparison="par rapport au mois dernier" icon={Users} />
            <MetricCard label="Paiements en attente" value="3 240 $" change="18%" comparison="par rapport à la semaine dernière" icon={Hourglass} negative />
          </div>

          <div className="mt-5 grid items-start gap-4 xl:grid-cols-[minmax(0,1.68fr)_minmax(330px,0.82fr)]">
            <section className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(24,35,52,0.035)]">
              <div className="p-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-bold tracking-[-0.04em] text-[#111827]">Transactions récentes</h2>
                  <button type="button" className="flex shrink-0 items-center gap-2 text-sm text-[#909aaa] hover:text-[#1f2937]">Tout voir <ArrowRight className="size-4" /></button>
                </div>
                <label className="mt-4 flex h-12 items-center gap-3 rounded-xl border border-[#e6e9ed] px-4 text-[#152033]">
                  <Search className="size-5 shrink-0" />
                  <span className="sr-only">Rechercher une transaction</span>
                  <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#a0a8b5]" placeholder="Rechercher une transaction..." />
                  {query && <button type="button" onClick={() => setQuery("")} className="rounded-md p-1 text-[#8b95a4] hover:bg-[#f2f4f6]" aria-label="Effacer la recherche"><X className="size-4" /></button>}
                </label>
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filtrer les transactions par statut">
                  {filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-full border px-4 py-2 text-xs font-medium transition ${filter === item ? "border-[#292b2c] bg-[#292b2c] text-white" : "border-[#e5e7eb] bg-white text-[#3f4a5b] hover:bg-[#f7f8f9]"}`} aria-pressed={filter === item}>{item}</button>)}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[740px] border-collapse text-left text-[13px]">
                  <thead className="bg-[#f5f6f7] text-[#657184]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Référence</th>
                      <th className="px-3 py-3 font-medium">Utilisateur</th>
                      <th className="px-3 py-3 font-medium">Type</th>
                      <th className="px-3 py-3 font-medium">Montant</th>
                      <th className="px-3 py-3 font-medium">Date</th>
                      <th className="px-3 py-3 font-medium">Statut</th>
                      <th className="px-3 py-3"><span className="sr-only">Détails</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleTransactions.map((transaction) => {
                      const selected = selectedTransaction.reference === transaction.reference;
                      return (
                        <tr key={transaction.reference} onClick={() => setSelectedReference(transaction.reference)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedReference(transaction.reference); }} tabIndex={0} aria-selected={selected} className={`cursor-pointer border-b border-[#edf0f2] transition hover:bg-[#fafbfc] ${selected ? "bg-[#f8fafb]" : "bg-white"}`}>
                          <td className="whitespace-nowrap px-4 py-3 font-medium text-[#526076]">{transaction.reference}</td>
                          <td className="px-3 py-3"><div className="flex min-w-[128px] items-center gap-2.5"><Avatar transaction={transaction} size="size-8" /><span className="whitespace-nowrap font-medium text-[#202b3a]">{transaction.user}</span></div></td>
                          <td className="max-w-[130px] px-3 py-3 leading-5 text-[#687487]">{transaction.type}</td>
                          <td className="whitespace-nowrap px-3 py-3 font-medium text-[#172033]">{transaction.amount}</td>
                          <td className="whitespace-nowrap px-3 py-3 leading-5 text-[#778294]">{transaction.date}<br />{transaction.time}</td>
                          <td className="px-3 py-3"><StatusPill status={transaction.status} /></td>
                          <td className="px-3 py-3 text-[#929baa]"><ChevronRight className="size-4" /></td>
                        </tr>
                      );
                    })}
                    {visibleTransactions.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-[#7d8796]">Aucune transaction trouvée.</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>

            <aside className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(24,35,52,0.035)] sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-[#f2f4f5] text-[#172033]"><FileText className="size-5" /></span>
                <h2 className="text-xl font-bold tracking-[-0.04em] text-[#111827]">Détails du paiement</h2>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                <StatusPill status={selectedTransaction.status} />
                <span className="text-xs text-[#717d8f]">{selectedTransaction.date} à {selectedTransaction.time}</span>
              </div>
              <p className="mt-3 text-[34px] font-bold tracking-[-0.06em] text-[#111827]">{selectedTransaction.amount.replace(/^\+\s*/, "")}</p>
              <p className="text-sm font-medium text-[#263346]">{selectedTransaction.type}</p>
              <p className="mt-1 text-sm text-[#929aaa]">Paiement envoyé à {selectedTransaction.user.split(" ")[0]}</p>

              <div className="my-5 h-px bg-[#eaedf0]" />
              <dl className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-3"><dt className="text-[#697586]">Référence</dt><dd className="flex items-center gap-2 text-right text-[#364255]"><span>{selectedTransaction.reference}</span><button type="button" onClick={() => copyValue(selectedTransaction.reference)} className="rounded-md p-1 text-[#586477] hover:bg-[#f1f3f5]" aria-label="Copier la référence">{copied === selectedTransaction.reference ? <Check className="size-4 text-[#16834a]" /> : <Clipboard className="size-4" />}</button></dd></div>
                <div className="flex items-center justify-between gap-3"><dt className="text-[#697586]">Utilisateur</dt><dd className="flex items-center gap-2 text-right"><Avatar transaction={selectedTransaction} size="size-9" /><span className="text-[#364255]">{selectedTransaction.user}<br /><span className="text-xs text-[#929aaa]">{selectedTransaction.handle}</span></span></dd></div>
                <div className="flex items-center justify-between gap-3"><dt className="text-[#697586]">Type</dt><dd className="max-w-[60%] text-right text-[#364255]">{selectedTransaction.type}</dd></div>
                <div className="flex items-center justify-between gap-3"><dt className="text-[#697586]">Montant</dt><dd className="text-right text-[#364255]">{selectedTransaction.amount.replace(/^\+\s*/, "")}</dd></div>
                <div className="flex items-center justify-between gap-3"><dt className="text-[#697586]">Frais de plateforme</dt><dd className="text-right text-[#364255]">{selectedTransaction.fee}</dd></div>
                <div className="flex items-center justify-between gap-3"><dt className="text-[#697586]">Montant net</dt><dd className="text-right font-medium text-[#172033]">{selectedTransaction.net}</dd></div>
                <div className="flex items-center justify-between gap-3"><dt className="text-[#697586]">Méthode de paiement</dt><dd className="text-right text-[#364255]">{selectedTransaction.method}</dd></div>
                <div className="flex items-center justify-between gap-3"><dt className="text-[#697586]">Statut</dt><dd><StatusPill status={selectedTransaction.status} /></dd></div>
                <div className="flex items-center justify-between gap-3"><dt className="text-[#697586]">ID interne</dt><dd className="flex items-center gap-2 text-right text-[#364255]"><span>{selectedTransaction.internalId}</span><button type="button" onClick={() => copyValue(selectedTransaction.internalId)} className="rounded-md p-1 text-[#586477] hover:bg-[#f1f3f5]" aria-label="Copier l’identifiant interne">{copied === selectedTransaction.internalId ? <Check className="size-4 text-[#16834a]" /> : <Clipboard className="size-4" />}</button></dd></div>
              </dl>

              <Button type="button" className="mt-5 h-12 w-full rounded-xl bg-[#252728] text-sm font-semibold text-white hover:bg-[#333637]" onClick={() => copyValue(selectedTransaction.reference)}>
                {copied === selectedTransaction.reference ? <Check className="size-4" /> : <ExternalLink className="size-4" />}
                {copied === selectedTransaction.reference ? "Référence copiée" : "Voir la transaction"}
              </Button>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
