import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import { DemoNotice, PageHeader } from "@/components/site/Layout";
import { ANOS, CATEGORIAS, FONTES, TIPOS, nomeCategoria } from "@/data/demo";
import { fmt, useIndicadoresAtivos } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/indicadores")({
  head: () => ({
    meta: [
      { title: "Indicadores — Dossiê da Mulher Itaquaquecetuba" },
      { name: "description", content: "Consulte indicadores por categoria, período, fonte e tipo." },
      { property: "og:title", content: "Indicadores — Dossiê da Mulher" },
      { property: "og:description", content: "Consulta de indicadores sobre as mulheres de Itaquaquecetuba." },
    ],
  }),
  component: Indicadores,
});

const ALL = "todos";

function Filtro({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) {
  return (
    <label className="block text-xs font-medium text-muted-foreground">
      {label}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-1 bg-card"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todos</SelectItem>
          {options.map((o) => <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>)}
        </SelectContent>
      </Select>
    </label>
  );
}

function Indicadores() {
  const lista = useIndicadoresAtivos();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(ALL);
  const [ano, setAno] = useState("2024");
  const [fonte, setFonte] = useState(ALL);
  const [tipo, setTipo] = useState(ALL);

  const res = useMemo(() => lista.filter((i) =>
    (cat === ALL || i.categoria === cat) && (ano === ALL || String(i.ano) === ano) &&
    (fonte === ALL || i.fonte === fonte) && (tipo === ALL || i.tipo === tipo) &&
    (!q || (i.titulo + i.descricao).toLowerCase().includes(q.toLowerCase())),
  ).sort((a, b) => a.categoria.localeCompare(b.categoria) || b.ano - a.ano), [lista, q, cat, ano, fonte, tipo]);

  const limpar = () => { setQ(""); setCat(ALL); setAno(ALL); setFonte(ALL); setTipo(ALL); };

  return (
    <>
      <PageHeader eyebrow="Consulta" title="Indicadores">Filtre os indicadores disponíveis por categoria, período, fonte e tipo de medida.</PageHeader>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <DemoNotice />
        <div className="grid gap-3 rounded-lg border bg-secondary/50 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block text-xs font-medium text-muted-foreground">
            Buscar
            <div className="relative mt-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="bg-card pl-8" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Palavra-chave" />
            </div>
          </label>
          <Filtro label="Categoria" value={cat} onChange={setCat} options={CATEGORIAS.map((c) => ({ v: c.id, l: c.nome }))} />
          <Filtro label="Ano" value={ano} onChange={setAno} options={[...new Set([...ANOS, ...lista.map((i) => i.ano)])].sort().reverse().map((a) => ({ v: String(a), l: String(a) }))} />
          <Filtro label="Fonte" value={fonte} onChange={setFonte} options={FONTES.map((f) => ({ v: f, l: f }))} />
          <Filtro label="Tipo" value={tipo} onChange={setTipo} options={TIPOS.map((t) => ({ v: t, l: t }))} />
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{res.length} indicador(es) encontrado(s)</span>
          <Button variant="ghost" size="sm" onClick={limpar}>Limpar filtros</Button>
        </div>
        {res.length === 0 ? (
          <div className="flex flex-col items-center rounded-lg border border-dashed bg-card py-16 text-center">
            <SearchX className="h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-medium">Nenhum indicador corresponde aos filtros.</p>
            <Button variant="outline" className="mt-4" onClick={limpar}>Limpar filtros</Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {res.map((i) => (
              <article key={i.id} className="flex flex-col rounded-lg border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-highlight">{nomeCategoria(i.categoria)}</p>
                <h3 className="mt-2 font-sans text-base font-semibold">{i.titulo}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{i.descricao}</p>
                <p className="mt-4 font-display text-3xl font-semibold text-primary">{fmt(i.valor)} <span className="font-sans text-sm font-normal text-muted-foreground">{i.unidade}</span></p>
                <dl className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-xs">
                  <div><dt className="text-muted-foreground">Período</dt><dd className="font-medium">{i.ano}</dd></div>
                  <div><dt className="text-muted-foreground">Tipo</dt><dd className="font-medium">{i.tipo}</dd></div>
                  <div className="col-span-3"><dt className="text-muted-foreground">Fonte</dt><dd className="font-medium">{i.fonte}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
