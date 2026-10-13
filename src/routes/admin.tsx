import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Archive, ArchiveRestore, FileUp, History, LayoutDashboard, List, LogOut, Pencil, Plus, RotateCcw, Search } from "lucide-react";
import { toast } from "sonner";
import { Brand, DemoNotice } from "@/components/site/Layout";
import { ANOS, CATEGORIAS, FONTES, TIPOS, nomeCategoria, type Indicador } from "@/data/demo";
import { actions, fmt, useDossie } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Área administrativa — Dossiê da Mulher" },
      { name: "description", content: "Painel demonstrativo de gestão dos indicadores." },
      { property: "og:title", content: "Área administrativa — Dossiê da Mulher" },
      { property: "og:description", content: "Gestão demonstrativa de indicadores do Dossiê da Mulher." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const SESSION = "dossie-admin-demo";

function Admin() {
  const [logado, setLogado] = useState(false);
  useEffect(() => setLogado(sessionStorage.getItem(SESSION) === "1"), []);
  if (!logado) return <Login onEntrar={() => { sessionStorage.setItem(SESSION, "1"); setLogado(true); }} />;
  return <Painel onSair={() => { sessionStorage.removeItem(SESSION); setLogado(false); }} />;
}

function Login({ onEntrar }: { onEntrar: () => void }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  return (
    <div className="grid min-h-screen place-items-center bg-institutional px-4">
      <form
        className="w-full max-w-sm space-y-4 rounded-lg bg-card p-8 shadow-xl"
        onSubmit={(e) => {
          e.preventDefault();
          if (!/^\S+@\S+\.\S+$/.test(email) || !senha) return setErro("Informe um e-mail válido e uma senha.");
          onEntrar();
        }}
      >
        <Brand />
        <div>
          <h1 className="text-2xl font-semibold text-primary">Área administrativa</h1>
          <p className="mt-1 text-xs text-muted-foreground">Acesso demonstrativo: qualquer e-mail e senha permitem a entrada. Não há autenticação real nesta versão.</p>
        </div>
        <div className="space-y-1.5"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-1.5"><Label htmlFor="senha">Senha</Label><Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} /></div>
        {erro && <p className="text-sm text-destructive" role="alert">{erro}</p>}
        <Button type="submit" className="w-full">Entrar (demonstração)</Button>
        <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-primary">← Voltar ao portal</Link>
      </form>
    </div>
  );
}

type Aba = "resumo" | "lista" | "csv" | "historico";
const ABAS: { id: Aba; nome: string; icon: typeof List }[] = [
  { id: "resumo", nome: "Resumo", icon: LayoutDashboard },
  { id: "lista", nome: "Indicadores", icon: List },
  { id: "csv", nome: "Importar CSV", icon: FileUp },
  { id: "historico", nome: "Histórico", icon: History },
];

function Painel({ onSair }: { onSair: () => void }) {
  const [aba, setAba] = useState<Aba>("resumo");
  const [edit, setEdit] = useState<Partial<Indicador> | null>(null);
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="bg-sidebar p-4 text-sidebar-foreground md:w-64 md:shrink-0">
        <Brand light />
        <nav className="mt-6 flex gap-1 overflow-x-auto md:flex-col">
          {ABAS.map((a) => (
            <button key={a.id} onClick={() => setAba(a.id)} className={cn("flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm", aba === a.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/60")}>
              <a.icon className="h-4 w-4" /> {a.nome}
            </button>
          ))}
        </nav>
        <div className="mt-6 space-y-1 border-t border-sidebar-border pt-4 text-sm">
          <Link to="/" className="block rounded-md px-3 py-2 hover:bg-sidebar-accent/60">Ver portal público</Link>
          <button onClick={onSair} className="flex w-full items-center gap-2 rounded-md px-3 py-2 hover:bg-sidebar-accent/60"><LogOut className="h-4 w-4" /> Sair</button>
        </div>
      </aside>
      <div className="flex-1 space-y-6 bg-background p-4 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold text-primary">{ABAS.find((a) => a.id === aba)?.nome}</h1>
          <Button onClick={() => setEdit({})}><Plus className="h-4 w-4" /> Cadastrar indicador</Button>
        </div>
        <DemoNotice />
        {aba === "resumo" && <Resumo />}
        {aba === "lista" && <Lista onEdit={setEdit} />}
        {aba === "csv" && <Csv />}
        {aba === "historico" && <Historico />}
      </div>
      {edit && <Formulario inicial={edit} onClose={() => setEdit(null)} />}
    </div>
  );
}

function Resumo() {
  const { indicadores, historico } = useDossie();
  const ativos = indicadores.filter((i) => !i.arquivado);
  const cards = [
    ["Indicadores ativos", ativos.length],
    ["Arquivados", indicadores.length - ativos.length],
    ["Categorias com dados", new Set(ativos.map((i) => i.categoria)).size],
    ["Alterações registradas", historico.length],
  ] as const;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([l, v]) => <div key={l} className="rounded-lg border bg-card p-5"><p className="text-sm text-muted-foreground">{l}</p><p className="font-display text-4xl font-semibold text-primary">{v}</p></div>)}
      </div>
      <div className="rounded-lg border bg-card p-5">
        <h2 className="text-lg font-semibold">Indicadores por categoria</h2>
        <ul className="mt-3 divide-y text-sm">
          {CATEGORIAS.map((c) => <li key={c.id} className="flex justify-between py-2"><span>{c.nome}</span><span className="font-medium">{ativos.filter((i) => i.categoria === c.id).length}</span></li>)}
        </ul>
      </div>
      <Button variant="outline" onClick={() => { if (confirm("Restaurar a base demonstrativa original? As alterações locais serão perdidas.")) { actions.restaurarDemo(); toast.success("Base demonstrativa restaurada."); } }}>
        <RotateCcw className="h-4 w-4" /> Restaurar dados demonstrativos
      </Button>
    </div>
  );
}

function Lista({ onEdit }: { onEdit: (i: Indicador) => void }) {
  const { indicadores } = useDossie();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("todos");
  const [status, setStatus] = useState("ativos");
  const res = useMemo(() => indicadores.filter((i) =>
    (cat === "todos" || i.categoria === cat) &&
    (status === "todos" || (status === "ativos" ? !i.arquivado : i.arquivado)) &&
    (!q || i.titulo.toLowerCase().includes(q.toLowerCase()))), [indicadores, q, cat, status]);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="bg-card pl-8" placeholder="Buscar por título" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <Select value={cat} onValueChange={setCat}><SelectTrigger className="bg-card"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todos">Todas as categorias</SelectItem>{CATEGORIAS.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}</SelectContent></Select>
        <Select value={status} onValueChange={setStatus}><SelectTrigger className="bg-card"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ativos">Ativos</SelectItem><SelectItem value="arquivados">Arquivados</SelectItem><SelectItem value="todos">Todos</SelectItem></SelectContent></Select>
      </div>
      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Indicador</TableHead><TableHead>Categoria</TableHead><TableHead>Ano</TableHead><TableHead className="text-right">Valor</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
          <TableBody>
            {res.length === 0 && <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">Nenhum indicador encontrado.</TableCell></TableRow>}
            {res.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-medium">{i.titulo}</TableCell>
                <TableCell className="text-muted-foreground">{nomeCategoria(i.categoria)}</TableCell>
                <TableCell>{i.ano}</TableCell>
                <TableCell className="text-right">{fmt(i.valor)} <span className="text-xs text-muted-foreground">{i.unidade}</span></TableCell>
                <TableCell>{i.arquivado ? <Badge variant="secondary">Arquivado</Badge> : <Badge>Ativo</Badge>}</TableCell>
                <TableCell className="whitespace-nowrap text-right">
                  <Button size="icon" variant="ghost" aria-label="Editar" onClick={() => onEdit(i)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label={i.arquivado ? "Restaurar" : "Arquivar"} onClick={() => { actions.alternarArquivo(i.id); toast.success(i.arquivado ? "Indicador restaurado." : "Indicador arquivado."); }}>
                    {i.arquivado ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">{res.length} registro(s)</p>
    </div>
  );
}

type Form = { titulo: string; codigo: string; descricao: string; categoria: string; tipo: string; unidade: string; valor: string; ano: string; fonte: string };

function Formulario({ inicial, onClose }: { inicial: Partial<Indicador>; onClose: () => void }) {
  const [f, setF] = useState<Form>({
    titulo: inicial.titulo ?? "", codigo: inicial.codigo ?? "", descricao: inicial.descricao ?? "", categoria: inicial.categoria ?? "",
    tipo: inicial.tipo ?? "", unidade: inicial.unidade ?? "", valor: inicial.valor != null ? String(inicial.valor) : "",
    ano: inicial.ano ? String(inicial.ano) : "", fonte: inicial.fonte ?? "",
  });
  const [erros, setErros] = useState<Partial<Record<keyof Form, string>>>({});
  const up = (k: keyof Form) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  const salvar = () => {
    const e: typeof erros = {};
    (["titulo", "descricao", "categoria", "tipo", "unidade", "valor", "ano", "fonte"] as const).forEach((k) => { if (!f[k].trim()) e[k] = "Campo obrigatório"; });
    if (f.valor && isNaN(Number(f.valor.replace(",", ".")))) e.valor = "Informe um número";
    if (f.ano && !/^\d{4}$/.test(f.ano)) e.ano = "Ano com 4 dígitos";
    setErros(e);
    if (Object.keys(e).length) { toast.error("Verifique os campos destacados."); return; }
    actions.salvar({
      id: inicial.id, titulo: f.titulo.trim(), codigo: f.codigo.trim() || f.titulo.trim().toUpperCase().slice(0, 12), descricao: f.descricao.trim(),
      categoria: f.categoria, tipo: f.tipo, unidade: f.unidade.trim(), valor: Number(f.valor.replace(",", ".")), ano: Number(f.ano), fonte: f.fonte,
    });
    toast.success(inicial.id ? "Indicador atualizado." : "Indicador cadastrado.");
    onClose();
  };
  const field = (k: keyof Form, label: string, node: React.ReactNode) => (
    <div className="space-y-1.5"><Label className={erros[k] ? "text-destructive" : ""}>{label} {k !== "codigo" && "*"}</Label>{node}{erros[k] && <p className="text-xs text-destructive">{erros[k]}</p>}</div>
  );
  const sel = (k: keyof Form, opts: { v: string; l: string }[]) => (
    <Select value={f[k]} onValueChange={up(k)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{opts.map((o) => <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>)}</SelectContent></Select>
  );
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader><DialogTitle>{inicial.id ? "Editar indicador" : "Cadastrar indicador"}</DialogTitle></DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">{field("titulo", "Título", <Input value={f.titulo} onChange={(e) => up("titulo")(e.target.value)} />)}</div>
          <div className="sm:col-span-2">{field("descricao", "Descrição", <Textarea value={f.descricao} onChange={(e) => up("descricao")(e.target.value)} />)}</div>
          {field("categoria", "Categoria", sel("categoria", CATEGORIAS.map((c) => ({ v: c.id, l: c.nome }))))}
          {field("tipo", "Tipo", sel("tipo", TIPOS.map((t) => ({ v: t, l: t }))))}
          {field("valor", "Valor", <Input inputMode="decimal" value={f.valor} onChange={(e) => up("valor")(e.target.value)} />)}
          {field("unidade", "Unidade", <Input value={f.unidade} placeholder="ex.: registros, %" onChange={(e) => up("unidade")(e.target.value)} />)}
          {field("ano", "Período (ano)", <Input inputMode="numeric" value={f.ano} placeholder={String(ANOS[ANOS.length - 1])} onChange={(e) => up("ano")(e.target.value)} />)}
          {field("codigo", "Código da série (opcional)", <Input value={f.codigo} onChange={(e) => up("codigo")(e.target.value)} />)}
          <div className="sm:col-span-2">{field("fonte", "Fonte", sel("fonte", FONTES.map((x) => ({ v: x, l: x }))))}</div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={salvar}>Salvar</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const COLS = ["titulo", "descricao", "categoria", "tipo", "unidade", "valor", "ano", "fonte"];

function Csv() {
  const [linhas, setLinhas] = useState<Omit<Indicador, "id" | "atualizadoEm" | "arquivado">[]>([]);
  const [erro, setErro] = useState("");
  const ler = async (file: File) => {
    setErro(""); setLinhas([]);
    const txt = await file.text();
    const rows = txt.trim().split(/\r?\n/).map((l) => l.split(";").map((c) => c.trim()));
    const head = rows[0]?.map((h) => h.toLowerCase()) ?? [];
    const falta = COLS.filter((c) => !head.includes(c));
    if (falta.length) return setErro(`Colunas ausentes: ${falta.join(", ")}`);
    const out = rows.slice(1).filter((r) => r.some(Boolean)).map((r) => {
      const o = Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])) as Record<string, string>;
      const g = (k: string) => o[k] ?? "";
      return { titulo: g("titulo"), codigo: g("codigo") || g("titulo").toUpperCase().slice(0, 12), descricao: g("descricao"), categoria: g("categoria"), tipo: g("tipo"), unidade: g("unidade"), valor: Number(g("valor").replace(",", ".")), ano: Number(g("ano")), fonte: g("fonte") };
    });
    const inval = out.findIndex((o) => !o.titulo || isNaN(o.valor) || !o.ano || !CATEGORIAS.some((c) => c.id === o.categoria));
    if (inval >= 0) return setErro(`Linha ${inval + 2} inválida (verifique título, valor, ano e categoria).`);
    setLinhas(out);
  };
  const modelo = `${COLS.join(";")};codigo\nExemplo de indicador;Descrição do indicador;violencia;Absoluto;registros;100;2025;${FONTES[0]};EXEMPLO`;
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">Envie um arquivo CSV separado por ponto e vírgula com as colunas: <code className="rounded bg-muted px-1">{COLS.join("; ")}</code> (e opcionalmente <code className="rounded bg-muted px-1">codigo</code>). Categorias usam os identificadores: {CATEGORIAS.map((c) => c.id).join(", ")}.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <FileUp className="h-4 w-4" /> Selecionar CSV
            <input type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => e.target.files?.[0] && ler(e.target.files[0])} />
          </label>
          <Button variant="outline" asChild><a href={`data:text/csv;charset=utf-8,${encodeURIComponent(modelo)}`} download="modelo-indicadores.csv">Baixar modelo</a></Button>
        </div>
        {erro && <p className="mt-3 text-sm text-destructive" role="alert">{erro}</p>}
      </div>
      {linhas.length > 0 && (
        <div className="space-y-3 rounded-lg border bg-card p-6">
          <p className="font-medium">{linhas.length} linha(s) prontas para importar</p>
          <ul className="max-h-48 overflow-y-auto text-sm text-muted-foreground">{linhas.map((l, i) => <li key={i}>• {l.titulo} — {l.ano}: {fmt(l.valor)} {l.unidade}</li>)}</ul>
          <Button onClick={() => { actions.importar(linhas); toast.success(`${linhas.length} indicador(es) importado(s).`); setLinhas([]); }}>Confirmar importação</Button>
        </div>
      )}
    </div>
  );
}

function Historico() {
  const { historico } = useDossie();
  if (!historico.length) return <div className="rounded-lg border border-dashed bg-card py-16 text-center text-muted-foreground">Nenhuma alteração registrada ainda.</div>;
  return (
    <ol className="space-y-3">
      {historico.map((h) => (
        <li key={h.id} className="flex gap-4 rounded-lg border bg-card p-4">
          <Badge variant={h.acao === "Arquivado" ? "secondary" : "default"} className="h-fit">{h.acao}</Badge>
          <div className="flex-1"><p className="font-medium">{h.titulo}</p><p className="text-sm text-muted-foreground">{h.detalhe}</p></div>
          <time className="text-xs text-muted-foreground">{new Date(h.data).toLocaleString("pt-BR")}</time>
        </li>
      ))}
    </ol>
  );
}
