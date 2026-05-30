// src/components/shared/AtletaAvatar.tsx
// Avatar sincronizado — foto real da galeria ou iniciais
// Atualiza automaticamente em TODAS as telas via estado global
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamilies } from '../../constants/theme';
import { useAppStore } from '../../store/useAppStore';

interface AvatarProps {
  size?: number;
  borderRadius?: number;
  fontSize?: number;
}

// ─── Avatar grande (tela de perfil) ──────────────────────────────────────────
export function AtletaAvatar({ size = 90, borderRadius = 12, fontSize = 24 }: AvatarProps) {
  const { state } = useAppStore();
  const { fotoUri, iniciais } = state.perfil;

  const containerStyle = {
    width: size,
    height: size,
    borderRadius,
    backgroundColor: colors.onSurface,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    overflow: 'hidden' as const,
  };

  if (fotoUri) {
    return (
      <View style={containerStyle}>
        <Image
          // key força o Image a recarregar quando a URI muda (cache busting pelo ?t=...)
          key={fotoUri}
          source={{ uri: fotoUri }}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Text style={[styles.iniciais, { fontSize }]}>{iniciais}</Text>
    </View>
  );
}

// ─── Avatar mini (headers de todas as telas) ──────────────────────────────────
export function AtletaAvatarMini({ size = 36 }: { size?: number }) {
  const { state } = useAppStore();
  const { fotoUri, iniciais } = state.perfil;

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    overflow: 'hidden' as const,
  };

  if (fotoUri) {
    return (
      <View style={containerStyle}>
        <Image
          key={fotoUri}
          source={{ uri: fotoUri }}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Text style={[styles.iniciais, { fontSize: size * 0.38, color: colors.onSurface }]}>
        {iniciais}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iniciais: {
    fontFamily: fontFamilies.headlineBold,
    color: colors.white,
  },
});
