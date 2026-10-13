import type { ReactNode } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { REGIOES } from "@/data/demo";
import { fmt } from "@/lib/store";

export const PALETTE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--muted-foreground)"];
const tip = { contentStyle: { borderRadius: 8, border: "1px solid var(--border)", fontSize: 12 }, formatter: (v: number) => fmt(v) };
const axis = { fontSize: 12, fill: "var(--muted-foreground)" };

export function ChartCard({ title, periodo, fonte, children, className = "" }: { title: string; periodo: string; fonte?: string; children: ReactNode; className?: string }) {
  return (
    <figure className={`rounded-lg border bg-card p-5 ${className}`}>
      <figcaption className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">Período: {periodo}{fonte ? ` · Fonte: ${fonte}` : ""}</p>
      </figcaption>
      <div className="h-64">{children}</div>
    </figure>
  );
}

type D = { nome: string; valor: number }[];

export function VBar({ data, color = PALETTE[0] }: { data: D; color?: string }) {
  return (
    <ResponsiveContainer>
      <BarChart data={data} margin={{ top: 16, right: 8, left: -8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="nome" tick={axis} tickLine={false} axisLine={false} interval={0} />
        <YAxis tick={axis} tickLine={false} axisLine={false} />
        <Tooltip {...tip} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey="valor" name="Registros" fill={color} radius={[4, 4, 0, 0]} label={{ position: "top", fontSize: 11, fill: "var(--foreground)", formatter: fmt }} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function HBar({ data, color = PALETTE[1] }: { data: D; color?: string }) {
  return (
    <ResponsiveContainer>
      <BarChart data={data} layout="vertical" margin={{ left: 24, right: 40 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" />
        <XAxis type="number" tick={axis} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="nome" tick={axis} width={110} tickLine={false} axisLine={false} />
        <Tooltip {...tip} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey="valor" name="Registros" fill={color} radius={[0, 4, 4, 0]} label={{ position: "right", fontSize: 11, fill: "var(--foreground)", formatter: fmt }} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Lines({ data, series }: { data: Record<string, number | string>[]; series: { key: string; nome: string }[] }) {
  return (
    <ResponsiveContainer>
      <LineChart data={data} margin={{ top: 8, right: 16, left: -8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="ano" tick={axis} tickLine={false} axisLine={false} />
        <YAxis tick={axis} tickLine={false} axisLine={false} />
        <Tooltip {...tip} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {series.map((s, i) => (
          <Line key={s.key} type="monotone" dataKey={s.key} name={s.nome} stroke={PALETTE[i]} strokeWidth={2.5} dot={{ r: 3 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function Donut({ data }: { data: D }) {
  const total = data.reduce((a, b) => a + b.valor, 0) || 1;
  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie data={data} dataKey="valor" nameKey="nome" innerRadius="52%" outerRadius="80%" paddingAngle={2}
          label={({ value }) => `${fmt((value / total) * 100)}%`} labelLine={false} fontSize={11}>
          {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
        </Pie>
        <Tooltip {...tip} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TerritoryMap({ total }: { total: number }) {
  const max = Math.max(...REGIOES.map((r) => r.p));
  return (
    <div>
      <svg viewBox="0 0 420 330" className="w-full" role="img" aria-label="Mapa esquemático das regiões do município com intensidade de registros">
        {REGIOES.map((r) => {
          const op = 0.2 + (r.p / max) * 0.8;
          return (
            <g key={r.nome}>
              <title>{`${r.nome}: ${fmt(Math.round(total * r.p))} registros`}</title>
              <rect x={10 + r.x * 100} y={10 + r.y * 78} width={94} height={72} rx={8} fill="var(--chart-1)" fillOpacity={op} stroke="var(--card)" strokeWidth={2} />
              <text x={57 + r.x * 100} y={40 + r.y * 78} textAnchor="middle" fontSize={10} fill={op > 0.55 ? "var(--primary-foreground)" : "var(--foreground)"}>{r.nome}</text>
              <text x={57 + r.x * 100} y={60 + r.y * 78} textAnchor="middle" fontSize={13} fontWeight={600} fill={op > 0.55 ? "var(--primary-foreground)" : "var(--foreground)"}>{fmt(Math.round(total * r.p))}</text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <span>Menor</span><span className="h-2 w-32 rounded bg-gradient-to-r from-chart-5 to-chart-1" /><span>Maior</span>
        <span className="ml-auto">Representação esquemática — mapa oficial a ser incorporado</span>
      </div>
    </div>
  );
}
