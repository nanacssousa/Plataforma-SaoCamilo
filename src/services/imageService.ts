// src/services/imageService.ts
// Sem expo-file-system — usa apenas expo-image-picker
// O URI retornado pelo picker é persistido via AsyncStorage no store
import * as ImagePicker from 'expo-image-picker';

export interface PickResult {
  success: boolean;
  uri?: string;
  error?: string;
}

export async function pickFromGallery(): Promise<PickResult> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    return {
      success: false,
      error: 'Permissão negada. Habilite o acesso à galeria nas configurações.',
    };
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.85,
  });

  if (result.canceled) return { success: false, error: 'Cancelado' };

  return { success: true, uri: result.assets[0].uri };
}

export async function pickFromCamera(): Promise<PickResult> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    return {
      success: false,
      error: 'Permissão negada. Habilite o acesso à câmera nas configurações.',
    };
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.85,
  });

  if (result.canceled) return { success: false, error: 'Cancelado' };

  return { success: true, uri: result.assets[0].uri };
}

export async function removeProfilePhoto(): Promise<void> {
  // Nada a fazer no sistema de arquivos — o store limpa o URI
}
