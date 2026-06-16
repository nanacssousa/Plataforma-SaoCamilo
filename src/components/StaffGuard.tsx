// src/components/StaffGuard.tsx
// HOC de proteção de rota para páginas de Staff.
// Uso: envolve o componente de tela e verifica se o usuário logado
// tem permissão para aquela rota. Redireciona silenciosamente caso contrário.

import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { colors } from "../constants/theme";
import { PERFIL_PARA_ROLE, ROTA_INICIAL_STAFF, temAcesso } from "../config/staffPermissions";
import { useAppStore } from "../store/useAppStore";

interface Props {
  rotaAtual: string;
  children?: React.ReactNode;
}

export default function StaffGuard({ rotaAtual, children }: Props) {
  const { state } = useAppStore();

  useEffect(() => {
    if (!state.isInitialized) return;

    // Não autenticado → login
    if (!state.isAuthenticated) {
      router.replace("/telaLogin");
      return;
    }

    const idPerfil = state.idPerfil;
    if (!idPerfil) return;

    const role = PERFIL_PARA_ROLE[idPerfil];

    // id_perfil 1 = atleta → redireciona para a tela do atleta
    if (!role) {
      router.replace("/telaAtleta");
      return;
    }

    // Staff sem permissão para esta rota → vai para o painel inicial do seu perfil
    if (!temAcesso(role, rotaAtual)) {
      router.replace(ROTA_INICIAL_STAFF[role] as any);
    }
  }, [state.isInitialized, state.isAuthenticated, state.idPerfil]);

  if (!state.isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.surface }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}
