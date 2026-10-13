import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DemoNotice, PageHeader } from "@/components/site/Layout";
import { ChartCard, Donut, HBar, Lines, TerritoryMap, VBar } from "@/components/site/Charts";
import { ANOS, DIA_SEMANA, ESCOLARIDADE, FAIXA_ETARIA, FAIXA_HORARIA, FONTES, RACA_COR, REGIOES, RELACAO_AUTOR, TIPOS_VIOLENCIA } from "@/data/demo";
import { fmt, serieDe, useIndicadoresAtivos, valorDe } from "@/lib/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/graficos")({
  head: () => ({
    meta: [
      { title: "Gráficos — Dossiê da Mulher Itaquaquecetuba" },
      { name: "description", content: "Painel analítico com séries históricas, perfis e distribuição territorial." },
      { property: "og:title", content: "Gráficos — Dossiê da Mulher" },
      { property: "og:description", content: "Painel analítico de indicadores sobre as mulheres de Itaquaquecetuba." },
    ],
  }),
  component: Graficos,
});

const SECOES = [
  { id: "todas", nome: "Todas as seções" },
  { id: "historico", nome: "Séries históricas" },
  { id: "tipos", nome: "Tipos e circunstâncias" },
  { id: "perfil", nome: "Perfil das vítimas" },
  { id: "autor", nome: "Autores e território" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="border-l-4 border-highlight pl-3 text-2xl font-semibold text-primary">{title}</h2>
      <div className="grid gap-5 lg:grid-cols-2">{children}</div>
    </section>
  );
}

function Graficos() {
  const lista = useIndicadoresAtivos();
  const [ano, setAno] = useState("2024");
  const [comp, setComp] = useState("2023");
  const [secao, setSecao] = useState("todas");
  const [regiao, setRegiao] = useState("todas");

  const a = Number(ano);
  const fator = regiao === "todas" ? 1 : REGIOES.find((r) => r.nome === regiao)?.p ?? 1;
  const total = Math.round((valorDe(lista, "VIOL_REG", a) ?? 0) * fator);
  const totalComp = Math.round((valorDe(lista, "VIOL_REG", Number(comp)) ?? 0) * fator);
  const dist = (arr: { nome: string; p: number }[], t = total) => arr.map((d) => ({ nome: d.nome, valor: Math.round(t * d.p) }));
  const show = (s: string) => secao === "todas" || secao === s;
  const periodo = `${ano}${regiao !== "todas" ? ` · ${regiao}` : ""}`;

  const codes = [["VIOL_REG", "Violência registrada"], ["MPU", "Medidas protetivas"], ["ATEND_CRM", "Atendimentos CRM"]] as const;
  const linhas = ANOS.map((y) => {
    const row: Record<string, number | string> = { ano: String(y) };
    codes.forEach(([c]) => (row[c] = serieDe(lista, c).find((i) => i.ano === y)?.valor ?? 0));
    return row;
  });
  const letal = ANOS.map((y) => ({ ano: String(y), FEMIN: valorDe(lista, "FEMIN", y) ?? 0, FEMIN_TENT: valorDe(lista, "FEMIN_TENT", y) ?? 0 }));
  const comparativo = TIPOS_VIOLENCIA.map((t) => ({ nome: t.nome, [ano]: Math.round(total * t.p), [comp]: Math.round(totalComp * t.p) }));

  const sel = (label: string, v: string, set: (s: string) => void, opts: { v: string; l: string }[]) => (
    <label className="block text-xs font-medium text-muted-foreground">{label}
      <Select value={v} onValueChange={set}>
        <SelectTrigger className="mt-1 bg-card"><SelectValue /></SelectTrigger>
        <SelectContent>{opts.map((o) => <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>)}</SelectContent>
      </Select>
    </label>
  );
  const anosOpts = ANOS.map((y) => ({ v: String(y), l: String(y) })).reverse();

  return (
    <>
      <PageHeader eyebrow="Painel analítico" title="Gráficos">Visualizações organizadas por tema. Use os filtros para atualizar os gráficos correspondentes.</PageHeader>
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6">
        <DemoNotice />
        <div className="sticky top-16 z-30 grid gap-3 rounded-lg border bg-secondary p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {sel("Ano de análise", ano, setAno, anosOpts)}
          {sel("Comparar com", comp, setComp, anosOpts)}
          {sel("Região", regiao, setRegiao, [{ v: "todas", l: "Município inteiro" }, ...REGIOES.map((r) => ({ v: r.nome, l: r.nome }))])}
          {sel("Seção", secao, setSecao, SECOES.map((s) => ({ v: s.id, l: s.nome })))}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-4"><p className="text-xs text-muted-foreground">Registros em {ano}</p><p className="font-display text-3xl font-semibold text-primary">{fmt(total)}</p></div>
          <div className="rounded-lg border bg-card p-4"><p className="text-xs text-muted-foreground">Registros em {comp}</p><p className="font-display text-3xl font-semibold text-primary">{fmt(totalComp)}</p></div>
          <div className="rounded-lg border bg-card p-4"><p className="text-xs text-muted-foreground">Variação</p><p className="font-display text-3xl font-semibold text-highlight">{totalComp ? `${total >= totalComp ? "+" : ""}${fmt(((total - totalComp) / totalComp) * 100)}%` : "—"}</p></div>
        </div>

        {show("historico") && (
          <Section title="Séries históricas">
            <ChartCard title="Violência, medidas protetivas e atendimentos" periodo="2019–2024 · município" fonte="SSP / TJ / CRM">
              <Lines data={linhas} series={codes.map(([key, nome]) => ({ key, nome }))} />
            </ChartCard>
            <ChartCard title="Feminicídios e tentativas" periodo="2019–2024 · município" fonte={FONTES[0]}>
              <Lines data={letal} series={[{ key: "FEMIN", nome: "Consumados" }, { key: "FEMIN_TENT", nome: "Tentativas" }]} />
            </ChartCard>
          </Section>
        )}

        {show("tipos") && (
          <Section title="Tipos e circunstâncias da violência">
            <ChartCard title={`Tipos de violência — ${ano} x ${comp}`} periodo={`${ano} e ${comp}`}>
              <ComparBar data={comparativo} a={ano} b={comp} />
            </ChartCard>
            <ChartCard title="Distribuição percentual por tipo" periodo={periodo}><Donut data={dist(TIPOS_VIOLENCIA)} /></ChartCard>
            <ChartCard title="Registros por dia da semana" periodo={periodo}><VBar data={dist(DIA_SEMANA)} /></ChartCard>
            <ChartCard title="Registros por faixa de horário" periodo={periodo}><VBar data={dist(FAIXA_HORARIA)} color="var(--chart-2)" /></ChartCard>
          </Section>
        )}

        {show("perfil") && (
          <Section title="Perfil das vítimas">
            <ChartCard title="Vítimas por faixa etária" periodo={periodo}><VBar data={dist(FAIXA_ETARIA)} color="var(--chart-3)" /></ChartCard>
            <ChartCard title="Vítimas por raça/cor" periodo={periodo}><Donut data={dist(RACA_COR)} /></ChartCard>
            <ChartCard title="Vítimas por escolaridade" periodo={periodo} className="lg:col-span-2"><HBar data={dist(ESCOLARIDADE)} /></ChartCard>
          </Section>
        )}

        {show("autor") && (
          <Section title="Autores e distribuição territorial">
            <ChartCard title="Relação entre vítima e autor" periodo={periodo}><HBar data={dist(RELACAO_AUTOR)} color="var(--chart-1)" /></ChartCard>
            <figure className="rounded-lg border bg-card p-5">
              <figcaption className="mb-4"><h3 className="text-lg font-semibold">Mapa municipal — registros por região</h3><p className="text-xs text-muted-foreground">Período: {ano} · agregado por região</p></figcaption>
              <TerritoryMap total={valorDe(lista, "VIOL_REG", a) ?? 0} />
            </figure>
          </Section>
        )}
      </div>
    </>
  );
}

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
function ComparBar({ data, a, b }: { data: Record<string, string | number>[]; a: string; b: string }) {
  const axis = { fontSize: 12, fill: "var(--muted-foreground)" };
  return (
    <ResponsiveContainer>
      <BarChart data={data} margin={{ left: -8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="nome" tick={axis} tickLine={false} axisLine={false} />
        <YAxis tick={axis} tickLine={false} axisLine={false} />
        <Tooltip formatter={(v: number) => fmt(v)} cursor={{ fill: "var(--muted)" }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey={b} fill="var(--chart-5)" radius={[4, 4, 0, 0]} />
        <Bar dataKey={a} fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
