import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, CalendarDays, Database, ShieldCheck, Users, Venus } from "lucide-react";
import { DemoNotice } from "@/components/site/Layout";
import { ChartCard, Donut, Lines, TerritoryMap, VBar } from "@/components/site/Charts";
import { DESTAQUES, FONTES, TIPOS_VIOLENCIA, ULTIMA_ATUALIZACAO, ANOS } from "@/data/demo";
import { fmt, serieDe, useIndicadoresAtivos, valorDe } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dossiê da Mulher — Itaquaquecetuba, SP" },
      { name: "description", content: "Portal de indicadores públicos sobre violência, saúde, educação e participação das mulheres em Itaquaquecetuba." },
      { property: "og:title", content: "Dossiê da Mulher — Itaquaquecetuba, SP" },
      { property: "og:description", content: "Indicadores públicos sobre a situação das mulheres em Itaquaquecetuba." },
    ],
  }),
  component: Index,
});

const ICONS = [Users, Venus, ShieldCheck, BarChart3];

function Index() {
  const lista = useIndicadoresAtivos();
  const anoRef = Math.max(...lista.map((i) => i.ano), ANOS[ANOS.length - 1]);
  const viol = serieDe(lista, "VIOL_REG");
  const mpu = serieDe(lista, "MPU");
  const linhas = ANOS.map((ano) => ({ ano: String(ano), viol: viol.find((v) => v.ano === ano)?.valor ?? 0, mpu: mpu.find((v) => v.ano === ano)?.valor ?? 0 }));
  const totalAno = valorDe(lista, "VIOL_REG", 2024) ?? 0;

  return (
    <>
      <section className="bg-institutional text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-80">Plataforma institucional de indicadores públicos</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">Dossiê da Mulher Itaquaquecetubense</h1>
          <p className="mt-4 max-w-2xl text-lg opacity-90">Reúne, organiza e torna públicos dados sobre violência, saúde, educação, trabalho e participação das mulheres no município, para apoiar políticas públicas baseadas em evidências.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/indicadores" className="inline-flex items-center gap-2 rounded-md bg-card px-5 py-2.5 font-medium text-primary hover:bg-secondary">Consultar indicadores <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/graficos" className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/40 px-5 py-2.5 font-medium hover:bg-primary-foreground/10">Ver painel de gráficos</Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6">
        <DemoNotice />

        <section aria-labelledby="destaques">
          <h2 id="destaques" className="text-2xl font-semibold text-primary">Indicadores em destaque</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DESTAQUES.map((cod, idx) => {
              const s = serieDe(lista, cod);
              const atual = s[s.length - 1];
              const ant = s[s.length - 2];
              if (!atual) return null;
              const varr = ant ? ((atual.valor - ant.valor) / ant.valor) * 100 : null;
              const Icon = ICONS[idx];
              return (
                <article key={cod} className="rounded-lg border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-highlight" />
                    <span className="text-xs text-muted-foreground">{atual.ano}</span>
                  </div>
                  <p className="mt-4 font-display text-4xl font-semibold text-primary">{fmt(atual.valor)}</p>
                  <p className="text-xs text-muted-foreground">{atual.unidade}</p>
                  <h3 className="mt-2 font-sans text-sm font-medium text-foreground">{atual.titulo}</h3>
                  {varr !== null && <p className="mt-2 text-xs text-muted-foreground">{varr >= 0 ? "▲" : "▼"} {fmt(Math.abs(varr))}% em relação a {ant!.ano}</p>}
                </article>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="visualizacoes" className="space-y-5">
          <div className="flex items-end justify-between">
            <h2 id="visualizacoes" className="text-2xl font-semibold text-primary">Visualizações estatísticas</h2>
            <Link to="/graficos" className="text-sm font-medium text-highlight hover:underline">Painel completo →</Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <ChartCard title="Violência registrada e medidas protetivas" periodo="2019–2024">
              <Lines data={linhas} series={[{ key: "viol", nome: "Registros de violência" }, { key: "mpu", nome: "Medidas protetivas" }]} />
            </ChartCard>
            <ChartCard title="Distribuição por tipo de violência" periodo="2024">
              <Donut data={TIPOS_VIOLENCIA.map((t) => ({ nome: t.nome, valor: Math.round(totalAno * t.p) }))} />
            </ChartCard>
            <ChartCard title="Feminicídios consumados por ano" periodo="2019–2024">
              <VBar data={serieDe(lista, "FEMIN").map((i) => ({ nome: String(i.ano), valor: i.valor }))} color="var(--chart-2)" />
            </ChartCard>
            <figure className="rounded-lg border bg-card p-5">
              <figcaption className="mb-4">
                <h3 className="text-lg font-semibold">Visualização territorial</h3>
                <p className="text-xs text-muted-foreground">Registros de violência por região · 2024</p>
              </figcaption>
              <TerritoryMap total={totalAno} />
            </figure>
          </div>
        </section>

        <section className="grid gap-5 rounded-lg border bg-card p-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-primary"><Database className="h-5 w-5" /><h2 className="text-lg font-semibold">Fontes dos dados</h2></div>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">{FONTES.slice(0, 5).map((f) => <li key={f}>• {f}</li>)}</ul>
          </div>
          <div>
            <div className="flex items-center gap-2 text-primary"><CalendarDays className="h-5 w-5" /><h2 className="text-lg font-semibold">Período de referência</h2></div>
            <p className="mt-3 text-sm text-muted-foreground">Séries anuais de {ANOS[0]} a {anoRef}.</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-primary"><BarChart3 className="h-5 w-5" /><h2 className="text-lg font-semibold">Última atualização</h2></div>
            <p className="mt-3 text-sm text-muted-foreground">{ULTIMA_ATUALIZACAO} (demonstrativa)</p>
            <Link to="/informacoes" className="mt-2 inline-block text-sm font-medium text-highlight hover:underline">Metodologia e glossário →</Link>
          </div>
        </section>
      </div>
    </>
  );
}
