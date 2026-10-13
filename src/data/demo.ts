// Base de dados DEMONSTRATIVA. Substituir por registros oficiais (PostgreSQL/API) futuramente.
export const DEMO_NOTICE =
  "Dados demonstrativos para prototipagem. Não representam estatísticas oficiais de Itaquaquecetuba.";
export const ULTIMA_ATUALIZACAO = "13/10/2026";

export const CATEGORIAS = [
  { id: "violencia", nome: "Violência contra a mulher" },
  { id: "feminicidio", nome: "Feminicídio e letalidade" },
  { id: "tipos", nome: "Tipos de violência" },
  { id: "vitimas", nome: "Perfil das vítimas" },
  { id: "territorial", nome: "Distribuição territorial" },
  { id: "autores", nome: "Perfil dos autores e relação com as vítimas" },
  { id: "protetivas", nome: "Medidas protetivas e atendimentos" },
  { id: "saude", nome: "Saúde e notificações" },
  { id: "social", nome: "Indicadores sociais e demográficos" },
  { id: "educacao", nome: "Educação e mercado de trabalho" },
  { id: "igualdade", nome: "Igualdade de gênero e participação política" },
  { id: "politicas", nome: "Políticas públicas e atendimento municipal" },
] as const;
export type CategoriaId = (typeof CATEGORIAS)[number]["id"];
export const nomeCategoria = (id: string) => CATEGORIAS.find((c) => c.id === id)?.nome ?? id;

export const FONTES = [
  "Secretaria de Segurança Pública (demonstrativo)",
  "Secretaria Municipal de Saúde (demonstrativo)",
  "Centro de Referência da Mulher (demonstrativo)",
  "Tribunal de Justiça (demonstrativo)",
  "Censo / IBGE (demonstrativo)",
  "Tribunal Superior Eleitoral (demonstrativo)",
  "Secretaria Municipal de Assistência Social (demonstrativo)",
] as const;
export const TIPOS = ["Absoluto", "Percentual", "Taxa"] as const;
export const ANOS: number[] = [2019, 2020, 2021, 2022, 2023, 2024];

export type Indicador = {
  id: string;
  codigo: string;
  titulo: string;
  descricao: string;
  categoria: string;
  tipo: string;
  unidade: string;
  valor: number;
  ano: number;
  fonte: string;
  arquivado: boolean;
  atualizadoEm: string;
};

type Serie = Omit<Indicador, "id" | "valor" | "ano" | "arquivado" | "atualizadoEm"> & { valores: number[] };

const SERIES: Serie[] = [
  { codigo: "VIOL_REG", titulo: "Registros de violência contra a mulher", descricao: "Total de ocorrências registradas envolvendo mulheres como vítimas.", categoria: "violencia", tipo: "Absoluto", unidade: "registros", fonte: FONTES[0], valores: [2140, 2310, 2485, 2602, 2718, 2655] },
  { codigo: "VIOL_TAXA", titulo: "Taxa de violência por 100 mil mulheres", descricao: "Registros de violência por 100 mil habitantes do sexo feminino.", categoria: "violencia", tipo: "Taxa", unidade: "por 100 mil", fonte: FONTES[0], valores: [1166, 1252, 1338, 1392, 1443, 1402] },
  { codigo: "FEMIN", titulo: "Feminicídios consumados", descricao: "Homicídios de mulheres por razões da condição de sexo feminino.", categoria: "feminicidio", tipo: "Absoluto", unidade: "vítimas", fonte: FONTES[0], valores: [6, 5, 8, 7, 9, 6] },
  { codigo: "FEMIN_TENT", titulo: "Tentativas de feminicídio", descricao: "Tentativas registradas de feminicídio no município.", categoria: "feminicidio", tipo: "Absoluto", unidade: "vítimas", fonte: FONTES[0], valores: [18, 21, 24, 22, 27, 25] },
  { codigo: "LESAO", titulo: "Lesão corporal dolosa", descricao: "Registros de lesão corporal dolosa contra mulheres.", categoria: "tipos", tipo: "Absoluto", unidade: "registros", fonte: FONTES[0], valores: [820, 870, 905, 940, 972, 948] },
  { codigo: "AMEACA", titulo: "Ameaça", descricao: "Registros de ameaça contra mulheres.", categoria: "tipos", tipo: "Absoluto", unidade: "registros", fonte: FONTES[0], valores: [760, 812, 866, 901, 935, 920] },
  { codigo: "ESTUPRO", titulo: "Estupro e estupro de vulnerável", descricao: "Registros de violência sexual contra mulheres e meninas.", categoria: "tipos", tipo: "Absoluto", unidade: "registros", fonte: FONTES[0], valores: [142, 128, 151, 166, 174, 169] },
  { codigo: "VIT_JOVEM", titulo: "Vítimas entre 18 e 29 anos", descricao: "Participação de mulheres de 18 a 29 anos no total de vítimas.", categoria: "vitimas", tipo: "Percentual", unidade: "%", fonte: FONTES[0], valores: [34.1, 33.6, 35.2, 34.8, 33.9, 34.4] },
  { codigo: "VIT_NEGRA", titulo: "Vítimas pretas e pardas", descricao: "Participação de mulheres pretas e pardas no total de vítimas.", categoria: "vitimas", tipo: "Percentual", unidade: "%", fonte: FONTES[0], valores: [55.2, 56.0, 57.1, 57.8, 58.3, 58.9] },
  { codigo: "TERR_CONC", titulo: "Concentração nas 3 regiões com mais registros", descricao: "Parcela dos registros concentrada nas três regiões com maior volume.", categoria: "territorial", tipo: "Percentual", unidade: "%", fonte: FONTES[0], valores: [41.0, 42.3, 41.8, 43.5, 44.1, 43.2] },
  { codigo: "AUT_PARCEIRO", titulo: "Autor companheiro ou ex-companheiro", descricao: "Casos em que o autor é companheiro ou ex-companheiro da vítima.", categoria: "autores", tipo: "Percentual", unidade: "%", fonte: FONTES[0], valores: [61.4, 63.0, 62.2, 64.1, 63.7, 64.5] },
  { codigo: "AUT_RESID", titulo: "Ocorrências na residência", descricao: "Parcela dos casos ocorridos no ambiente doméstico.", categoria: "autores", tipo: "Percentual", unidade: "%", fonte: FONTES[0], valores: [66.0, 71.2, 69.4, 67.8, 67.1, 66.5] },
  { codigo: "MPU", titulo: "Medidas protetivas de urgência concedidas", descricao: "Medidas protetivas deferidas pelo Judiciário.", categoria: "protetivas", tipo: "Absoluto", unidade: "medidas", fonte: FONTES[3], valores: [610, 680, 742, 815, 890, 934] },
  { codigo: "ATEND_CRM", titulo: "Atendimentos no Centro de Referência da Mulher", descricao: "Atendimentos psicossociais e jurídicos realizados.", categoria: "protetivas", tipo: "Absoluto", unidade: "atendimentos", fonte: FONTES[2], valores: [1320, 1105, 1410, 1588, 1702, 1810] },
  { codigo: "NOTIF", titulo: "Notificações de violência na saúde", descricao: "Notificações compulsórias de violência interpersonal contra mulheres.", categoria: "saude", tipo: "Absoluto", unidade: "notificações", fonte: FONTES[1], valores: [390, 352, 418, 456, 489, 503] },
  { codigo: "POP_FEM", titulo: "População feminina estimada", descricao: "Estimativa da população residente do sexo feminino.", categoria: "social", tipo: "Absoluto", unidade: "habitantes", fonte: FONTES[4], valores: [183500, 184500, 185700, 186900, 188300, 189400] },
  { codigo: "CHEFIA", titulo: "Domicílios chefiados por mulheres", descricao: "Parcela dos domicílios com mulher como responsável.", categoria: "social", tipo: "Percentual", unidade: "%", fonte: FONTES[4], valores: [42.1, 43.0, 44.2, 45.1, 46.0, 46.8] },
  { codigo: "ENS_SUP", titulo: "Mulheres com ensino superior completo", descricao: "Mulheres de 25 anos ou mais com ensino superior completo.", categoria: "educacao", tipo: "Percentual", unidade: "%", fonte: FONTES[4], valores: [9.8, 10.4, 11.1, 11.9, 12.6, 13.2] },
  { codigo: "PART_TRAB", titulo: "Participação no mercado de trabalho", descricao: "Taxa de participação feminina na força de trabalho.", categoria: "educacao", tipo: "Percentual", unidade: "%", fonte: FONTES[4], valores: [48.2, 45.1, 46.7, 49.0, 50.3, 51.1] },
  { codigo: "VEREAD", titulo: "Mulheres na Câmara Municipal", descricao: "Participação de mulheres entre as cadeiras da Câmara.", categoria: "igualdade", tipo: "Percentual", unidade: "%", fonte: FONTES[5], valores: [10.5, 10.5, 15.8, 15.8, 15.8, 21.1] },
  { codigo: "SERV_REDE", titulo: "Equipamentos da rede de atendimento", descricao: "Serviços municipais de acolhimento e atendimento à mulher.", categoria: "politicas", tipo: "Absoluto", unidade: "equipamentos", fonte: FONTES[6], valores: [3, 3, 4, 5, 5, 6] },
];

export const SEED: Indicador[] = SERIES.flatMap(({ valores, ...s }) =>
  valores.map((valor, i) => ({
    ...s,
    id: `${s.codigo}-${ANOS[i]}`,
    valor,
    ano: ANOS[i]!,
    arquivado: false,
    atualizadoEm: "2026-10-13T12:00:00.000Z",
  })),
);

export const DESTAQUES = ["VIOL_REG", "FEMIN", "MPU", "ATEND_CRM"];

// Distribuições de referência (proporções) — escaladas pelo total do ano selecionado.
export const FAIXA_ETARIA = [
  { nome: "0–11", p: 0.04 }, { nome: "12–17", p: 0.08 }, { nome: "18–29", p: 0.34 },
  { nome: "30–44", p: 0.33 }, { nome: "45–59", p: 0.15 }, { nome: "60+", p: 0.06 },
];
export const RACA_COR = [
  { nome: "Parda", p: 0.44 }, { nome: "Branca", p: 0.38 }, { nome: "Preta", p: 0.15 }, { nome: "Outras / n.i.", p: 0.03 },
];
export const ESCOLARIDADE = [
  { nome: "Fundamental incompleto", p: 0.22 }, { nome: "Fundamental completo", p: 0.18 },
  { nome: "Médio completo", p: 0.39 }, { nome: "Superior completo", p: 0.12 }, { nome: "Não informado", p: 0.09 },
];
export const DIA_SEMANA = [
  { nome: "Dom", p: 0.21 }, { nome: "Seg", p: 0.13 }, { nome: "Ter", p: 0.12 }, { nome: "Qua", p: 0.12 },
  { nome: "Qui", p: 0.11 }, { nome: "Sex", p: 0.13 }, { nome: "Sáb", p: 0.18 },
];
export const FAIXA_HORARIA = [
  { nome: "00h–05h59", p: 0.17 }, { nome: "06h–11h59", p: 0.2 }, { nome: "12h–17h59", p: 0.26 }, { nome: "18h–23h59", p: 0.37 },
];
export const RELACAO_AUTOR = [
  { nome: "Companheiro", p: 0.38 }, { nome: "Ex-companheiro", p: 0.26 }, { nome: "Familiar", p: 0.16 },
  { nome: "Conhecido", p: 0.11 }, { nome: "Desconhecido", p: 0.09 },
];
export const TIPOS_VIOLENCIA = [
  { nome: "Física", p: 0.36 }, { nome: "Psicológica", p: 0.33 }, { nome: "Sexual", p: 0.07 },
  { nome: "Patrimonial", p: 0.09 }, { nome: "Moral", p: 0.15 },
];
// Regiões em representação esquemática (x, y em grade 0–5)
export const REGIOES = [
  { nome: "Jardim Caiuby", x: 1, y: 0, p: 0.08 },
  { nome: "Pium", x: 2, y: 0, p: 0.06 },
  { nome: "Monte Belo", x: 3, y: 0, p: 0.05 },
  { nome: "Vila Zeferina", x: 0, y: 1, p: 0.09 },
  { nome: "Centro", x: 1, y: 1, p: 0.14 },
  { nome: "Vila Virgínia", x: 2, y: 1, p: 0.13 },
  { nome: "Jardim Odete", x: 3, y: 1, p: 0.1 },
  { nome: "Quinta da Boa Vista", x: 1, y: 2, p: 0.12 },
  { nome: "Jardim Algarve", x: 2, y: 2, p: 0.08 },
  { nome: "Parque Piratininga", x: 3, y: 2, p: 0.09 },
  { nome: "Jardim Mônica", x: 2, y: 3, p: 0.06 },
];
