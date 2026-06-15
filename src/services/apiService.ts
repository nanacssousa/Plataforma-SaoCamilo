import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.15.5:3000";

const TOKEN_KEY = "@saocamilo:token";
const USER_KEY = "@saocamilo:usuario";

// ─── Persistência do token ────────────────────────────────────────────────────

export async function salvarToken(
  token: string,
  usuario: Record<string, unknown>,
) {
  await Promise.all([
    AsyncStorage.setItem(TOKEN_KEY, token),
    AsyncStorage.setItem(USER_KEY, JSON.stringify(usuario)),
  ]);
}

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getAuthUser(): Promise<Record<string, unknown> | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function clearAuthToken() {
  await Promise.all([
    AsyncStorage.removeItem(TOKEN_KEY),
    AsyncStorage.removeItem(USER_KEY),
  ]);
}

// ─── Fetch autenticado ────────────────────────────────────────────────────────

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  // Sessão expirada — limpa o token local
  if (response.status === 401) {
    await clearAuthToken();
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error((data as any)?.error ?? `Erro ${response.status}`);
  }

  return data as T;
}