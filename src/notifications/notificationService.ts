// src/notifications/notificationService.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('hidratacao', {
      name: 'Hidratação',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function schedulePreTreinoNotification(minutosAntes: number): Promise<string | null> {
  try {
    await cancelNotificationByTag('pre-treino');
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 Hora de se hidratar!',
        body: `Treino em ${minutosAntes} minutos. Beba pelo menos 500ml agora.`,
        data: { tag: 'pre-treino' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: minutosAntes * 60,
        repeats: false,
      },
    });
    return id;
  } catch (e) {
    console.warn('[notifications] schedule error', e);
    return null;
  }
}

export async function scheduleDesidratacaoAlert(nivel: string): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚠️ Risco de Desidratação',
        body: `Nível ${nivel} detectado. Reponha líquidos imediatamente.`,
        data: { tag: 'desidratacao' },
      },
      trigger: null, // imediato
    });
  } catch (e) {
    console.warn('[notifications] desidratacao alert error', e);
  }
}

export async function sendHydrationReminder(metaML: number, consumidoML: number): Promise<void> {
  const restante = metaML - consumidoML;
  if (restante <= 0) return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 Meta diária',
        body: `Você ainda precisa de ${Math.round(restante)}ml para atingir sua meta.`,
      },
      trigger: null,
    });
  } catch {}
}

async function cancelNotificationByTag(tag: string): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const toCancel = scheduled.filter(n => n.content.data?.tag === tag);
  await Promise.all(toCancel.map(n => Notifications.cancelScheduledNotificationAsync(n.identifier)));
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
