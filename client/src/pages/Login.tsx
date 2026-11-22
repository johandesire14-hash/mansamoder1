import { useEffect, useState } from "react";
import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { useLocation, Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { startLogin } from "../const";
import { useAuth } from "../_core/hooks/useAuth";

export default function Login() {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();
  const utils = trpc.useUtils();
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      setLocation("/dashboard");
    },
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRecoveryInfo, setShowRecoveryInfo] = useState(false);
  const [oauthError, setOauthError] = useState("");

  useEffect(() => {
    if (loginMutation.error) loginMutation.reset();
  }, [email, password]);

  if (!loading && user?.role === "admin") return <Redirect to="/dashboard" />;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate({ email, password });
  };

  const handleOAuthLogin = () => {
    setOauthError("");
    try {
      startLogin();
    } catch {
      setOauthError("Impossible de démarrer la connexion OAuth Manus. Réessayez ou utilisez votre adresse e-mail.");
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#eef1f4] text-[#111827]">
      <div className="relative mx-auto flex min-h-screen max-w-[1440px] items-center justify-center px-5 py-10 lg:px-12">
        <div className="pointer-events-none absolute -left-32 top-1/2 hidden h-[620px] w-[620px] -translate-y-1/2 rounded-full bg-[#1f2326] lg:block" />
        <div className="pointer-events-none absolute -left-4 top-1/2 hidden h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-[#a7dfc0] opacity-80 mix-blend-multiply lg:block" />
        <div className="pointer-events-none absolute right-[-160px] top-[-120px] h-[360px] w-[360px] rounded-full bg-[#dff5e9]" />

        <section className="relative grid w-full max-w-[1100px] overflow-hidden rounded-[30px] bg-white shadow-[0_30px_90px_rgba(20,34,49,0.12)] lg:grid-cols-[0.88fr_1.12fr]">
          <div className="relative hidden min-h-[690px] overflow-hidden bg-[#1f2326] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-white text-xl font-black text-[#1f2326]">M</div>
                <span className="text-xl font-bold tracking-[-0.04em]">Mansa Hub</span>
              </div>
              <div className="mt-28 max-w-[330px]">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9ee4b9]">Administration sécurisée</p>
                <h1 className="mt-5 text-5xl font-bold leading-[1.03] tracking-[-0.06em]">Pilotez la plateforme avec confiance.</h1>
                <p className="mt-6 text-sm leading-7 text-white/65">Un espace réservé aux équipes qui surveillent les utilisateurs, les entreprises et les flux financiers de Mansa.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/55">
              <span className="flex size-8 items-center justify-center rounded-xl bg-white/10"><ShieldCheck className="size-4 text-[#9ee4b9]" /></span>
              Accès protégé et journalisé
            </div>
          </div>

          <div className="relative flex min-h-[690px] flex-col justify-center px-7 py-10 sm:px-14 lg:px-20">
            <div className="absolute right-7 top-7 rounded-full border border-[#e6e8eb] px-3 py-1.5 text-[11px] font-semibold text-[#64748b]">FR</div>
            <div className="mb-9 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#1f2326] text-lg font-black text-white">M</div>
                <span className="text-lg font-bold tracking-[-0.04em]">Mansa Hub</span>
              </div>
            </div>
            <div className="max-w-[430px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#effaf3] px-3 py-1.5 text-xs font-semibold text-[#16834a]"><LockKeyhole className="size-3.5" /> Connexion sécurisée</div>
              <h2 className="text-4xl font-bold tracking-[-0.06em] text-[#111827]">Espace de modération</h2>
              <p className="mt-3 text-sm leading-6 text-[#64748b]">Connectez-vous à votre espace sécurisé</p>

              <form className="mt-9 space-y-5" onSubmit={handleSubmit}>
                <label className="block text-sm font-semibold text-[#253044]">
                  Adresse e-mail
                  <input className="mt-2 h-12 w-full rounded-xl border border-[#dfe4e9] bg-[#fbfcfd] px-4 text-sm font-normal outline-none transition focus:border-[#36a867] focus:ring-4 focus:ring-[#36a867]/10" type="email" autoComplete="email" placeholder="admin@mansa.app" value={email} onChange={(event) => setEmail(event.target.value)} required />
                </label>
                <label className="block text-sm font-semibold text-[#253044]">
                  Mot de passe
                  <span className="relative mt-2 block">
                    <input className="h-12 w-full rounded-xl border border-[#dfe4e9] bg-[#fbfcfd] px-4 pr-12 text-sm font-normal outline-none transition focus:border-[#36a867] focus:ring-4 focus:ring-[#36a867]/10" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Votre mot de passe" value={password} onChange={(event) => setPassword(event.target.value)} required />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#94a3b8] hover:bg-[#eef2f4] hover:text-[#334155]" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
                  </span>
                </label>
                <div className="flex justify-end"><button type="button" onClick={() => setShowRecoveryInfo((open) => !open)} aria-expanded={showRecoveryInfo} className="text-xs font-semibold text-[#28784b] hover:underline">Mot de passe oublié ?</button></div>
                {showRecoveryInfo && <p role="status" className="rounded-xl border border-[#dfe4e9] bg-[#f8fafb] px-4 py-3 text-sm leading-5 text-[#526076]">La réinitialisation automatique n’est pas disponible pour ce compte administrateur. Contactez le propriétaire du projet pour mettre à jour les identifiants de manière sécurisée.</p>}
                {loginMutation.error && <div className="rounded-xl border border-[#fecaca] bg-[#fff5f5] px-4 py-3 text-sm text-[#b42318]">Adresse e-mail ou mot de passe incorrect.</div>}
                <Button className="h-12 w-full rounded-xl bg-[#1f2326] text-sm font-bold text-white shadow-[0_8px_20px_rgba(31,35,38,0.16)] hover:bg-[#30363a]" type="submit" disabled={loginMutation.isPending}>{loginMutation.isPending ? "Connexion en cours…" : <><span>Se connecter</span><ArrowRight className="size-4" /></>}</Button>
              </form>

              <div className="my-7 flex items-center gap-4 text-[11px] font-medium text-[#94a3b8]"><span className="h-px flex-1 bg-[#e8ebee]" />ou<span className="h-px flex-1 bg-[#e8ebee]" /></div>
              <Button type="button" variant="outline" className="h-12 w-full rounded-xl border-[#dfe4e9] bg-white text-sm font-semibold text-[#253044] hover:bg-[#f8fafb]" onClick={handleOAuthLogin}>Continuer avec Manus OAuth</Button>
              {oauthError && <p role="alert" className="mt-3 rounded-xl border border-[#fecaca] bg-[#fff5f5] px-4 py-3 text-sm text-[#b42318]">{oauthError}</p>}
              <p className="mt-8 flex items-start gap-2 text-center text-[11px] leading-5 text-[#94a3b8]"><Check className="mt-0.5 size-3.5 shrink-0 text-[#36a867]" />Accès réservé aux membres autorisés de l’équipe Mansa.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
