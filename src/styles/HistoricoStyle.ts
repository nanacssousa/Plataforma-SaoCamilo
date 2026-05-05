// src/styles/HistoricoStyle.ts
import { StyleSheet } from 'react-native';
import { colors, fontFamilies } from '../constants/theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.surface,
  },
  headerMenu: {
    fontSize: 20,
    color: colors.onSurface,
  },
  headerTitle: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.primary,
  },
  headerFilter: {
    fontSize: 20,
    color: colors.onSurface,
  },

  // Search
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchIcon: {
    fontSize: 16,
    color: colors.onSurfaceVariant,
  },
  searchInput: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    flex: 1,
  },

  // Export Button
  exportButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  exportButtonText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 13,
    color: colors.white,
    letterSpacing: 0.5,
  },

  // List
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  // Session Card
  sessionCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardBadge: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.onSurfaceVariant,
  },
  cardBadgeHigh: {
    color: colors.primary,
  },
  cardBadgeResist: {
    color: colors.secondary,
  },
  cardDateContainer: {
    alignItems: 'flex-end',
  },
  cardDateDay: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 18,
    color: colors.onSurface,
    lineHeight: 20,
  },
  cardDateMonth: {
    fontFamily: fontFamilies.technical,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardTitle: {
    fontFamily: fontFamilies.headline,
    fontSize: 22,
    color: colors.onSurface,
    marginBottom: 14,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.outlineVariant,
    marginBottom: 14,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardStatsLeft: {
    flex: 1,
    gap: 12,
  },
  statItem: {
    gap: 2,
  },
  statLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.onSurfaceVariant,
  },
  statValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  statText: {
    fontFamily: fontFamilies.body,
    fontSize: 15,
    color: colors.onSurface,
    fontWeight: '600',
  },
  dehydrationNormal: {
    color: colors.secondary,
  },
  dehydrationHigh: {
    color: colors.primary,
  },
  dehydrationIcon: {
    fontSize: 13,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 16,
    color: colors.onSurface,
  },

  // Bottom Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLow,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    paddingVertical: 8,
    paddingBottom: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabIconActive: {
    backgroundColor: colors.primary,
  },
  tabIcon: { fontSize: 16 },
  tabLabel: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.onSurfaceVariant,
  },
  tabLabelActive: {
    color: colors.primary,
  },
});