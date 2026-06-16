// src/config/staffPermissions.ts
// Fonte única de verdade para permissões e rotas de Staff.
// Sidebar, guard de rota e cadastro consomem este arquivo.

import { StaffRole } from "../components/RolePicker";

// ─── Mapeamento id_perfil ↔ role ─────────────────────────────────────────────
// Espelha os ids já usados no backend e no telaLogin.tsx
export const PERFIL_PARA_ROLE: Record<number, StaffRole> = {
  3: "treinador",
  4: "medico",
  5: "administrador",
};

export const ROLE_PARA_PERFIL: Record<StaffRole, number> = {
  treinador: 3,
  medico: 4,
  administrador: 5,
};

// ─── Rota home de cada perfil Staff ──────────────────────────────────────────
export const ROTA_INICIAL_STAFF: Record<StaffRole, string> = {
  treinador: "/painelTreinador",
  medico: "/painelMedico",
  administrador: "/painelAdm",
};

// ─── Itens de sidebar por perfil ─────────────────────────────────────────────
export type StaffNavId =
  | "painel"
  | "equipes"
  | "sessoes"
  | "hidratacao"
  | "biomarcadores"
  | "configuracoes"
  | "perfil";

export interface StaffNavItem {
  id: StaffNavId;
  label: string;
  icon: string;
  rota: string;
}

// Catálogo completo de itens de navegação
const CATALOGO: Record<StaffNavId, StaffNavItem> = {
  painel:        { id: "painel",        label: "Painel",        icon: "📊", rota: "" },
  equipes:       { id: "equipes",       label: "Equipes",       icon: "👥", rota: "/telaequipes" },
  sessoes:       { id: "sessoes",       label: "Sessões",       icon: "🏃", rota: "/painelnutricionista" },
  hidratacao:    { id: "hidratacao",    label: "Hidratação",    icon: "💧", rota: "/painelnutricionista" },
  biomarcadores: { id: "biomarcadores", label: "Biomarcadores", icon: "🩻", rota: "/biomarcadores" },
  configuracoes: { id: "configuracoes", label: "Config.",       icon: "⚙️", rota: "/admsistema" },
  perfil:        { id: "perfil",        label: "Perfil",        icon: "👤", rota: "/perfilProfissional" },
};

// Permissões: itens visíveis por role (ordem de exibição)
const PERMISSOES: Record<StaffRole, StaffNavId[]> = {
  treinador:     ["painel", "sessoes",       "equipes",      "perfil"],
  medico:        ["painel", "biomarcadores", "hidratacao",   "perfil"],
  administrador: ["painel", "biomarcadores", "equipes",      "sessoes", "configuracoes", "perfil"],
};

// Retorna itens de nav para um role, com a rota de "painel" correta para o perfil
export function getNavItems(role: StaffRole): StaffNavItem[] {
  return PERMISSOES[role].map((id) => {
    const item = { ...CATALOGO[id] };
    if (id === "painel") item.rota = ROTA_INICIAL_STAFF[role];
    return item;
  });
}

// Verifica se um role tem acesso a uma rota
export function temAcesso(role: StaffRole, rotaAlvo: string): boolean {
  const itens = getNavItems(role);
  return itens.some((i) => i.rota === rotaAlvo) || rotaAlvo === ROTA_INICIAL_STAFF[role];
}

export const TITULO_PAINEL: Record<StaffRole, string> = {
  treinador:     "Painel Treinador",
  medico:        "Painel Médico",
  administrador: "Painel Adm",
};

export const LABEL_ROLE: Record<StaffRole, string> = {
  treinador:     "Treinador",
  medico:        "Médico",
  administrador: "Administrador",
};
