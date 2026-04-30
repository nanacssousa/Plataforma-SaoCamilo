// Coloque em: app/_layout.tsx
// Substitui o _layout.tsx gerado pelo Expo Router

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

// Instale as fontes:
// npx expo install @expo-google-fonts/newsreader @expo-google-fonts/inter @expo-google-fonts/source-sans-3

import {
    Newsreader_300Light,
    Newsreader_300Light_Italic,
    Newsreader_400Regular,
    Newsreader_400Regular_Italic,
    Newsreader_700Bold,
} from '@expo-google-fonts/newsreader';

import {
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
} from '@expo-google-fonts/inter';

import {
    SourceSans3_400Regular,
    SourceSans3_600SemiBold,
    SourceSans3_700Bold,
} from '@expo-google-fonts/source-sans-3';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Newsreader_300Light,
    Newsreader_400Regular,
    Newsreader_700Bold,
    Newsreader_300Light_Italic,
    Newsreader_400Regular_Italic,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    SourceSans3_400Regular,
    SourceSans3_600SemiBold,
    SourceSans3_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}