// app/telaResultadoSessao.tsx
// Redireciona para a tela unificada de análise (sem parâmetro = sessão mais recente)
import { Redirect } from "expo-router";
import React from "react";

export default function TelaResultadoSessao() {
  return <Redirect href="/analiseHidratacao" />;
}
