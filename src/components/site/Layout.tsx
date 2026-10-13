import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Info, Lock, Menu, X } from "lucide-react";
import { DEMO_NOTICE } from "@/data/demo";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/indicadores", label: "Indicadores" },
  { to: "/graficos", label: "Gráficos" },
  { to: "/informacoes", label: "Informações" },
] as const;

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className={cn("grid h-10 w-10 place-items-center rounded-md font-display text-lg font-semibold", light ? "bg-sidebar-primary text-sidebar-primary-foreground" : "bg-primary text-primary-foreground")} aria-hidden>
        DM
      </span>
      <span className="leading-tight">
        <span className={cn("block font-display text-xl font-semibold", light ? "text-sidebar-foreground" : "text-primary")}>Dossiê da Mulher</span>
        <span className={cn("block text-xs uppercase tracking-wider", light ? "text-sidebar-foreground/70" : "text-muted-foreground")}>Itaquaquecetuba — SP</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Brand />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-primary" activeProps={{ className: "bg-secondary text-primary" }}>
              {n.label}
            </Link>
          ))}
          <Link to="/admin" className="ml-3 flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs text-muted-foreground hover:text-primary">
            <Lock className="h-3.5 w-3.5" /> Área administrativa
          </Link>
        </nav>
        <button className="rounded-md p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Abrir menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="border-t px-4 pb-4 md:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block py-2.5 font-medium text-foreground">{n.label}</Link>
          ))}
          <Link to="/admin" onClick={() => setOpen(false)} className="block py-2.5 text-sm text-muted-foreground">Área administrativa</Link>
        </nav>
      )}
    </header>
  );
}

export function DemoNotice({ className }: { className?: string }) {
  return (
    <div role="note" className={cn("flex items-start gap-2 rounded-md border border-warning-foreground/20 bg-warning px-3 py-2 text-sm text-warning-foreground", className)}>
      <Info className="mt-0.5 h-4 w-4 shrink-0" /> <span>{DEMO_NOTICE}</span>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-sidebar text-sidebar-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <Brand light />
          <p className="mt-4 text-sm text-sidebar-foreground/70">Plataforma de indicadores públicos sobre a situação das mulheres no município.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex h-20 items-center justify-center rounded-md border border-dashed border-sidebar-border text-center text-xs text-sidebar-foreground/60">Espaço reservado:<br />Prefeitura de Itaquaquecetuba</div>
          <div className="flex h-20 items-center justify-center rounded-md border border-dashed border-sidebar-border text-center text-xs text-sidebar-foreground/60">Espaço reservado:<br />Instituição de ensino</div>
        </div>
        <div className="text-sm text-sidebar-foreground/70">
          <p className="font-medium text-sidebar-foreground">Protótipo — versão demonstrativa</p>
          <p className="mt-2">{DEMO_NOTICE}</p>
        </div>
      </div>
    </footer>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="border-b bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-highlight">{eyebrow}</p>
        <h1 className="mt-2 text-4xl font-semibold text-primary">{title}</h1>
        {children && <div className="mt-3 max-w-3xl text-muted-foreground">{children}</div>}
      </div>
    </section>
  );
}
