// src/styles/loginStyle.ts
import { colors, fontFamilies } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // ─── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 8,
    position: "relative",
  },
  headerVoltar: {
    position: "absolute",
    left: 20,
    padding: 6,
  },
  headerVoltarTexto: {
    fontSize: 22,
    color: colors.onSurface,
  },
  headerTitle: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 14,
    letterSpacing: 2,
    color: colors.onSurface,
    textAlign: "center",
  },

  // ─── Scroll content ────────────────────────────────────────────────────────
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
  },

  // ─── Tag / Title / Subtitle ────────────────────────────────────────────────
  tag: {
    backgroundColor: colors.primary,
    color: colors.white,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 10,
    fontFamily: fontFamilies.technicalBold,
    letterSpacing: 1.5,
    borderRadius: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  title: {
    fontSize: 36,
    fontFamily: fontFamilies.headlineBold,
    color: colors.onSurface,
    marginBottom: 12,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: fontFamilies.body,
    color: colors.onSurfaceVariant,
    lineHeight: 23,
    marginBottom: 28,
  },

  // ─── Info card ─────────────────────────────────────────────────────────────
  infoCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 14,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 12,
    fontFamily: fontFamilies.technicalBold,
    color: colors.onSurface,
    marginBottom: 3,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  infoDesc: {
    fontSize: 12,
    fontFamily: fontFamilies.body,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },

  // ─── Form ──────────────────────────────────────────────────────────────────
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 22,
  },
  label: {
    fontSize: 13,
    fontFamily: fontFamilies.technicalBold,
    color: colors.onSurface,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  labelError: {
    fontSize: 11,
    fontFamily: fontFamilies.body,
    color: colors.error,
    marginTop: 5,
  },

  // ─── Inputs ────────────────────────────────────────────────────────────────
  inputContainer: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  inputContainerError: {
    borderColor: colors.error,
    backgroundColor: "#FFF5F5",
  },
  inputContainerFilled: {
    borderColor: colors.success,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: fontFamilies.body,
    color: colors.onSurface,
  },
  olhoBtn: {
    paddingLeft: 10,
  },
  olhoIcon: {
    fontSize: 18,
  },

  // ─── Botão principal ───────────────────────────────────────────────────────
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 10,
  },
  btnPrimaryDisabled: {
    backgroundColor: colors.gray200,
  },
  btnPrimaryText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fontFamilies.technicalBold,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  btnPrimaryTextDisabled: {
    color: colors.gray400,
  },

  // ─── Esqueci a senha ───────────────────────────────────────────────────────
  esqueciBtn: {
    alignSelf: "flex-end",
    marginTop: -14,
    marginBottom: 22,
  },
  esqueciTexto: {
    fontSize: 12,
    fontFamily: fontFamilies.technicalBold,
    color: colors.primary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // ─── Divisor ───────────────────────────────────────────────────────────────
  divisorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    gap: 12,
  },
  divisorLinha: {
    flex: 1,
    height: 1,
    backgroundColor: colors.outlineVariant,
  },
  divisorTexto: {
    fontSize: 11,
    fontFamily: fontFamilies.technicalBold,
    color: colors.onSurfaceVariant,
    letterSpacing: 1.5,
  },

  // ─── Link de cadastro ──────────────────────────────────────────────────────
  cadastroRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  cadastroTexto: {
    fontSize: 13,
    fontFamily: fontFamilies.body,
    color: colors.onSurfaceVariant,
  },
  cadastroLink: {
    fontSize: 13,
    fontFamily: fontFamilies.technicalBold,
    color: colors.primary,
    letterSpacing: 0.3,
    textDecorationLine: "underline",
  },

  // ─── Footer ────────────────────────────────────────────────────────────────
  footerText: {
    textAlign: "center",
    fontSize: 10,
    color: colors.onSurfaceVariant,
    marginTop: 24,
    fontFamily: fontFamilies.technicalBold,
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});