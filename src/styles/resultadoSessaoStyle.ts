import { StyleSheet } from "react-native";
import { fontFamilies } from "../constants/theme";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FDFCF8" },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 1, borderColor: "#EAE9E4" },
  topTitle: { fontFamily: fontFamilies.technicalBold, fontSize: 14, letterSpacing: 2 },
  topIcon: { fontSize: 20 },
  avatarMini: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#1A1A1A", justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 16 },
  sectionHeader: { fontFamily: fontFamilies.technicalBold, fontSize: 10, color: "#1976D2", letterSpacing: 1, marginBottom: 8 },
  pageTitle: { fontFamily: fontFamilies.headlineBold, fontSize: 28, color: "#1A1A1A", lineHeight: 34, marginBottom: 8 },
  pageDate: { fontFamily: fontFamilies.body, fontSize: 12, color: "#6A6A6A", marginBottom: 24 },
  
  cardLight: { backgroundColor: "#FFF", padding: 20, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: "#EAE9E4" },
  cardWarm: { backgroundColor: "#F5EFEA", padding: 20, borderRadius: 12, marginBottom: 16 },
  cardLabel: { fontFamily: fontFamilies.technicalBold, fontSize: 10, color: "#6A6A6A", letterSpacing: 1, marginBottom: 4 },
  mainValue: { fontFamily: fontFamilies.headlineBold, fontSize: 42, color: "#1A1A1A" },
  unitText: { fontSize: 18, fontFamily: fontFamilies.body },
  rowAlign: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginBottom: 12 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  alertBadge: { backgroundColor: "#FCE8E8", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginLeft: 12 },
  alertBadgeText: { color: "#D32F2F", fontFamily: fontFamilies.technicalBold, fontSize: 10 },
  cardDesc: { fontFamily: fontFamilies.body, fontSize: 12, color: "#4A4A4A", lineHeight: 18, marginBottom: 16 },
  
  zonesBarRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 4, marginBottom: 4 },
  zoneText: { fontFamily: fontFamilies.technicalBold, fontSize: 8, color: "#1A1A1A" },
  zoneColors: { flexDirection: "row", height: 8, borderRadius: 4, overflow: "hidden" },
  zoneBox: { flex: 1, marginHorizontal: 1 },
  
  iconRed: { fontSize: 18, color: "#D32F2F" },
  badgeGray: { backgroundColor: "#EAE9E4", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeGrayText: { fontFamily: fontFamilies.technicalBold, fontSize: 10, color: "#1A1A1A" },

  cardDarkRed: { backgroundColor: "#8C0000", padding: 24, borderRadius: 12, marginBottom: 24 },
  darkTitle: { fontFamily: fontFamilies.headlineBold, fontSize: 18, color: "#FFF", marginBottom: 8 },
  darkDesc: { fontFamily: fontFamilies.body, fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 18, marginBottom: 20 },
  darkHighlightBox: { backgroundColor: "rgba(0,0,0,0.15)", padding: 16, borderRadius: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  darkHighlightLabel: { fontFamily: fontFamilies.technicalBold, fontSize: 10, color: "#FFF", letterSpacing: 1, marginBottom: 4 },
  darkHighlightValue: { fontFamily: fontFamilies.headlineBold, fontSize: 32, color: "#FFF" },
  darkHighlightUnit: { fontSize: 14, fontFamily: fontFamilies.body },
});