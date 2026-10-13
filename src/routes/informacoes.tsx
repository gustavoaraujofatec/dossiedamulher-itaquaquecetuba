import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { DemoNotice, PageHeader } from "@/components/site/Layout";
import { CATEGORIAS, FONTES } from "@/data/demo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/informacoes")({
  head: () => ({
    meta: [
      { title: "Informações — Dossiê da Mulher Itaquaquecetuba" },
      { name: "description", content: "Objetivos, metodologia, glossário e fontes do Dossiê da Mulher." },
      { property: "og:title", content: "Informações — Dossiê da Mulher" },
      { property: "og:description", content: "Metodologia, glossário e fontes do Dossiê da Mulher Itaquaquecetubense." },
    ],
  }),
  component: Info,
});

const GLOSSARIO: [string, string][] = [
  ["Feminicídio", "Homicídio de mulher por razões da condição de sexo feminino (Lei nº 13.104/2015)."],
  ["Medida protetiva de urgência", "Determinação judicial para proteger a mulher em situação de violência (Lei Maria da Penha)."],
  ["Violência psicológica", "Conduta que cause dano emocional, humilhação, controle ou diminuição da autoestima."],
  ["Violência patrimonial", "Retenção, subtração ou destruição de bens, documentos ou recursos da mulher."],
  ["Violência moral", "Calúnia, difamação ou injúria contra a mulher."],
  ["Taxa por 100 mil", "Número de casos dividido pela população feminina, multiplicado por 100 mil."],
  ["Notificação compulsória", "Comunicação obrigatória de casos de violência atendidos pelos serviços de saúde."],
];

function Bloco({ t, children }: { t: string; children: React.ReactNode }) {
  return <section className="rounded-lg border bg-card p-6"><h2 className="text-2xl font-semibold text-primary">{t}</h2><div className="mt-3 space-y-3 text-muted-foreground">{children}</div></section>;
}

function Info() {
  return (
    <>
      <PageHeader eyebrow="Sobre o projeto" title="Informações">Apresentação, metodologia e orientações para leitura dos dados.</PageHeader>
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex gap-3 rounded-lg border-l-4 border-highlight bg-accent p-4 text-accent-foreground">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="text-sm">Esta é uma versão de prototipagem. Os dados oficiais serão incorporados posteriormente pela equipe responsável da Prefeitura de Itaquaquecetuba.</p>
        </div>
        <Bloco t="Apresentação">
          <p>O Dossiê da Mulher Itaquaquecetubense é uma plataforma de indicadores públicos desenvolvida em parceria entre a Prefeitura de Itaquaquecetuba e uma instituição de ensino. Reúne informações sobre violência, saúde, educação, trabalho e participação política das mulheres do município.</p>
        </Bloco>
        <Bloco t="Objetivos">
          <ul className="list-disc space-y-1 pl-5">
            <li>Dar transparência a dados sobre a situação das mulheres no município.</li>
            <li>Subsidiar o planejamento e a avaliação de políticas públicas.</li>
            <li>Apoiar pesquisas acadêmicas e o controle social.</li>
            <li>Acompanhar a evolução dos indicadores ao longo do tempo.</li>
          </ul>
        </Bloco>
        <Bloco t="Metodologia">
          <p>Cada indicador possui título, descrição, valor, unidade de medida, período de referência, fonte e tipo (absoluto, percentual ou taxa). Os indicadores são organizados nas seguintes categorias:</p>
          <ol className="grid list-decimal gap-1 pl-5 sm:grid-cols-2">{CATEGORIAS.map((c) => <li key={c.id}>{c.nome}</li>)}</ol>
          <p>Dados pessoais de vítimas não são publicados. Toda informação é apresentada de forma agregada.</p>
        </Bloco>
        <Bloco t="Glossário">
          <Accordion type="multiple">
            {GLOSSARIO.map(([t, d]) => (
              <AccordionItem key={t} value={t}><AccordionTrigger className="text-foreground">{t}</AccordionTrigger><AccordionContent>{d}</AccordionContent></AccordionItem>
            ))}
          </Accordion>
        </Bloco>
        <Bloco t="Fontes de dados"><ul className="list-disc space-y-1 pl-5">{FONTES.map((f) => <li key={f}>{f}</li>)}</ul></Bloco>
        <Bloco t="Atualização e interpretação">
          <p>Os dados serão atualizados periodicamente conforme a disponibilização pelos órgãos de origem. Variações entre anos podem refletir mudanças no registro e na procura por serviços, e não apenas na ocorrência dos fatos.</p>
          <p>Números pequenos (como feminicídios) oscilam bastante de um ano para outro; recomenda-se analisar a série histórica completa.</p>
        </Bloco>
        <DemoNotice />
      </div>
    </>
  );
}
