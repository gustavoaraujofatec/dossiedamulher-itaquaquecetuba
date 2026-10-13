import { useSyncExternalStore } from "react";
import { SEED, type Indicador } from "@/data/demo";

// Persistência local (navegador) para demonstração. Substituível por backend.
export type Alteracao = { id: string; data: string; acao: "Criado" | "Editado" | "Arquivado" | "Restaurado" | "Importado"; titulo: string; detalhe: string };
type State = { indicadores: Indicador[]; historico: Alteracao[] };

const KEY = "dossie-mulher:v1";
const SERVER: State = { indicadores: SEED, historico: [] };
let state: State | null = null;
const listeners = new Set<() => void>();

function get(): State {
  if (typeof window === "undefined") return SERVER;
  if (!state) {
    try {
      const raw = localStorage.getItem(KEY);
      state = raw ? (JSON.parse(raw) as State) : SERVER;
    } catch {
      state = SERVER;
    }
  }
  return state;
}
function set(next: State) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  listeners.forEach((l) => l());
}
function log(acao: Alteracao["acao"], titulo: string, detalhe: string): Alteracao {
  return { id: crypto.randomUUID(), data: new Date().toISOString(), acao, titulo, detalhe };
}

export function useDossie() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    get,
    () => SERVER,
  );
}
export function useIndicadoresAtivos() {
  return useDossie().indicadores.filter((i) => !i.arquivado);
}

export const actions = {
  salvar(ind: Omit<Indicador, "id" | "atualizadoEm" | "arquivado"> & { id?: string | undefined }) {
    const s = get();
    const now = new Date().toISOString();
    if (ind.id) {
      set({
        indicadores: s.indicadores.map((i) => (i.id === ind.id ? { ...i, ...ind, id: i.id, atualizadoEm: now } : i)),
        historico: [log("Editado", ind.titulo, `${ind.ano} · ${ind.valor} ${ind.unidade}`), ...s.historico],
      });
    } else {
      const novo: Indicador = { ...ind, id: crypto.randomUUID(), arquivado: false, atualizadoEm: now };
      set({ indicadores: [novo, ...s.indicadores], historico: [log("Criado", ind.titulo, `${ind.ano} · ${ind.valor} ${ind.unidade}`), ...s.historico] });
    }
  },
  alternarArquivo(id: string) {
    const s = get();
    const alvo = s.indicadores.find((i) => i.id === id);
    if (!alvo) return;
    set({
      indicadores: s.indicadores.map((i) => (i.id === id ? { ...i, arquivado: !i.arquivado, atualizadoEm: new Date().toISOString() } : i)),
      historico: [log(alvo.arquivado ? "Restaurado" : "Arquivado", alvo.titulo, String(alvo.ano)), ...s.historico],
    });
  },
  importar(lista: Omit<Indicador, "id" | "atualizadoEm" | "arquivado">[]) {
    const s = get();
    const now = new Date().toISOString();
    const novos = lista.map((i) => ({ ...i, id: crypto.randomUUID(), arquivado: false, atualizadoEm: now }));
    set({ indicadores: [...novos, ...s.indicadores], historico: [log("Importado", `${novos.length} indicador(es)`, "Importação via CSV"), ...s.historico] });
  },
  restaurarDemo() {
    set({ indicadores: SEED, historico: [] });
  },
};

export function serieDe(lista: Indicador[], codigo: string) {
  return lista.filter((i) => i.codigo === codigo).sort((a, b) => a.ano - b.ano);
}
export function valorDe(lista: Indicador[], codigo: string, ano: number) {
  return lista.find((i) => i.codigo === codigo && i.ano === ano)?.valor;
}
export const fmt = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
