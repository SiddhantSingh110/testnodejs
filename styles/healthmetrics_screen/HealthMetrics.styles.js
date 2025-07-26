// app/tabs/health/styles/HealthMetrics.styles.js - Enhanced with improved color scheme
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1C', // Darker, more comfortable background
    paddingTop: 8,
    width: '100%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 120, // Extra padding at the bottom
    width: '100%',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0F1C',
  },
  loaderText: {
    fontSize: 16,
    color: '#8BB9E8', // Softer blue
    marginTop: 12,
  },

  // ✨ Recent Updates Section - Improved colors
  recentUpdatesCard: {
    backgroundColor: 'rgba(30, 40, 60, 0.6)', // More neutral dark blue
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(100, 150, 200, 0.2)', // Softer border
  },
  recentUpdatesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentUpdatesHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentUpdatesIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(34, 197, 94, 0.15)', // Softer green
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  recentUpdatesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E2E8F0', // Softer white
  },
  dismissButton: {
    padding: 4,
  },
  recentUpdateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  recentUpdateIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentUpdateContent: {
    flex: 1,
  },
  recentUpdateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  recentUpdateSubtitle: {
    fontSize: 12,
    color: '#94A3B8', // Neutral gray-blue
    marginTop: 2,
  },
  recentUpdateDate: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  reviewBadge: {
    backgroundColor: '#22C55E', // Softer green
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  reviewBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  reviewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  reviewAllButtonText: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '500',
    marginLeft: 6,
  },
  
  // Category Selectors - Improved colors
  categorySelector: {
    padding: 15,
    paddingBottom: 10,
    maxWidth: '100%',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 10, 
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
    minWidth: 80,
  },
  categoryButtonActive: {
    backgroundColor: '#3B82F6', // Professional blue
    borderColor: '#3B82F6',
  },
  categoryButtonText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#94A3B8',
  },
  categoryButtonTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  
  // Subcategory selector
  subCategorySelector: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    maxWidth: '100%',
  },
  subCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(51, 65, 85, 0.4)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10, 
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.2)',
    minWidth: 70,
  },
  subCategoryButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#CBD5E1',
  },
  
  // Metric selector
  metricSelector: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    maxWidth: '100%',
  },
  metricTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
    minWidth: 90,
  },
  metricTypeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#CBD5E1',
  },
  
  // Current Value Card - Improved gradient approach
  currentValueCard: {
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.8)', // Neutral background
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.2)',
  },
  currentValueHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentValueLabel: {
    fontSize: 14,
    color: '#94A3B8',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  refreshButton: {
    padding: 4,
  },
  infoButton: {
    padding: 4,
  },
  currentValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 10,
  },
  currentValue: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  currentValueUnit: {
    fontSize: 16,
    color: '#64748B',
    marginLeft: 5,
  },

  // ✨ Enhanced: Reference range in Level 1
  referenceRange: {
    fontSize: 12,
    color: '#8BB9E8', // Softer blue
    marginTop: 4,
    marginBottom: 8,
    textAlign: 'center',
  },

  // ✨ Enhanced: No data states
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },

  // ✨ Enhanced: Status indicators - Improved colors
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusNormal: {
    backgroundColor: '#22C55E', // Softer green
  },
  statusBorderline: {
    backgroundColor: '#F59E0B', // Softer amber
  },
  statusHigh: {
    backgroundColor: '#EF4444', // Softer red
  },
  statusText: {
    fontSize: 12,
    color: '#E2E8F0',
    fontWeight: '500',
  },

  // ✨ Enhanced: Change indicators
  changeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  changeLabel: {
    fontSize: 12,
    color: '#8BB9E8',
    marginRight: 6,
  },
  changeValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  increaseValue: {
    color: '#22C55E',
  },
  decreaseValue: {
    color: '#EF4444',
  },
  unchangedValue: {
    color: '#94A3B8',
  },

  // ✨ Enhanced: Measurement info with source
  measurementInfoContainer: {
    marginTop: 8,
  },
  measurementDate: {
    fontSize: 13,
    color: '#8BB9E8',
    marginBottom: 4,
  },
  measurementSourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  measurementSource: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 4,
  },
  needsReviewBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    marginLeft: 8,
  },
  needsReviewText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '600',
  },

  // ✨ Enhanced: Button styles
  metricButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  goalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
  },
  goalButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Percentile display
  percentileContainer: {
    width: '100%',
    marginTop: 15,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.2)',
  },
  percentileTitle: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  percentileBarContainer: {
    marginVertical: 5,
  },
  percentileBar: {
    height: 8,
    backgroundColor: 'rgba(100, 116, 139, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  percentileFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 4,
  },
  percentileTarget: {
    position: 'absolute',
    top: -3,
    width: 2,
    height: 14,
    backgroundColor: '#F59E0B',
  },
  recommendationsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  recommendationsButtonText: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  
  // ✨ Enhanced: Insights card
  insightsCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 16,
    padding: 16,
    margin: 15,
    marginTop: 0,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.2)',
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 12,
  },
  insightItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  insightWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderLeftColor: '#F59E0B',
  },
  insightAttention: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderLeftColor: '#EF4444',
  },
  insightPositive: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderLeftColor: '#22C55E',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
    marginLeft: 8,
  },
  insightDescription: {
    fontSize: 13,
    color: '#8BB9E8',
    lineHeight: 18,
  },
  insightDate: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  
  // Chart Card - Improved background
  chartCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.2)',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E2E8F0',
  },
  timeframeButtons: {
    flexDirection: 'row',
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
  },
  timeframeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  timeframeButtonActive: {
    backgroundColor: '#3B82F6',
  },
  timeframeButtonText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  timeframeButtonTextActive: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  chartPlaceholder: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width: '100%',
  },
  noChartDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noChartDataText: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
  },
  noChartDataSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  annotation: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.2)',
  },
  annotationTitle: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  annotationText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  
  // History Card - Improved background
  historyCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.2)',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E2E8F0',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 5,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100, 116, 139, 0.2)',
  },
  historyItemLeft: {
    flex: 1,
  },
  historyItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDate: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 2,
  },

  // ✨ Enhanced: History source container
  historySourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  historySource: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  historySourceText: {
    fontSize: 11,
    color: '#94A3B8',
    marginLeft: 3,
  },
  historyContext: {
    fontSize: 10,
    color: '#64748B',
    marginLeft: 8,
  },

  // ✨ Enhanced: History review badge
  historyReviewBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  historyReviewText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '600',
  },

  historyValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  historyValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E2E8F0',
  },
  historyValueBorderline: {
    color: '#F59E0B',
  },
  historyValueHigh: {
    color: '#EF4444',
  },
  historyUnit: {
    fontWeight: 'normal',
    color: '#94A3B8',
    fontSize: 12,
    marginLeft: 2,
  },
  historyStatusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
    marginLeft: 10,
  },
  
  // ✨ Shared styles
  bottomPadding: {
    height: 80,
  },
  
  // Modal styles - Add New Measurement - Improved colors
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E2E8F0',
  },
  modalScrollView: {
    maxHeight: '60%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 8,
  },
  valueInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
  },
  valueInput: {
    flex: 1,
    color: '#E2E8F0',
    paddingVertical: 12,
    fontSize: 16,
  },
  valueUnit: {
    color: '#94A3B8',
    fontSize: 16,
  },
  notesInput: {
    color: '#E2E8F0',
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    borderRadius: 8,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
  },
  contextButton: {
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
  },
  contextButtonText: {
    color: '#CBD5E1',
    fontSize: 13,
  },
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
  },
  dateButtonText: {
    color: '#E2E8F0',
    fontSize: 14,
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Modal styles - Metric Info
  infoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoModalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
  },
  infoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E2E8F0',
  },
  infoModalBody: {
    maxHeight: '70%',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  infoSectionText: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 20,
  },
  rangeContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  rangeIndicator: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  rangeLow: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  rangeOptimal: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  rangeHigh: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  rangeText: {
    color: '#E2E8F0',
    fontSize: 12,
  },
  rangeDetails: {
    marginTop: 12,
  },
  rangeDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rangeDetailDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  rangeDetailText: {
    color: '#CBD5E1',
    fontSize: 13,
  },
  rangeDetailTitle: {
    fontWeight: '500',
  },
  factorsList: {
    marginTop: 5,
  },
  factorItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  factorIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  factorContent: {
    flex: 1,
  },
  factorTitle: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 3,
  },
  factorDescription: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
  },
  concernsList: {
    marginTop: 5,
  },
  concernItem: {
    padding: 10,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.2)',
  },
  concernTitle: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  concernDescription: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
  },
  resourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  resourceLinkText: {
    color: '#3B82F6',
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
  infoSourceText: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  closeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Modal styles - Goal Setting
  goalCurrentValue: {
    alignItems: 'center',
    marginBottom: 20,
  },
  goalCurrentValueLabel: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 5,
  },
  goalCurrentValueText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  reminderToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleButton: {
    width: 50,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(100, 116, 139, 0.3)',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.5)',
  },
  toggleHandle: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E2E8F0',
    top: 2,
  },
  goalSuggestion: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  goalSuggestionText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 10,
    flex: 1,
  },
  
  // Modal styles - Recommendations
  recommendationsContainer: {
    maxHeight: '70%',
  },
  recommendationItem: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.2)',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recommendationIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  recommendationTitle: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '500',
  },
  recommendationDescription: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  recommendationSteps: {
    backgroundColor: 'rgba(51, 65, 85, 0.4)',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.2)',
  },
  recommendationStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendationStepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  recommendationStepNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recommendationStepText: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  recommendationSourceInfo: {
    marginTop: 20,
    marginBottom: 10,
  },
  recommendationSourceText: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  // Enhanced Goal Modal Styles
  goalCurrentRange: {
    fontSize: 12,
    color: '#8BB9E8',
    marginTop: 4,
    textAlign: 'center',
  },

  // Smart Suggestions Styles
  suggestionsContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E2E8F0',
    marginLeft: 8,
  },
  suggestionCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
    position: 'relative',
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  suggestionTypeContainer: {
    flex: 1,
  },
  suggestionType: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  suggestionTarget: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E2E8F0',
  },
  suggestionTimeframe: {
    fontSize: 12,
    color: '#94A3B8',
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  suggestionReasoning: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  // Timeline Options
  timelineOption: {
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
  },
  timelineOptionText: {
    fontSize: 13,
    color: '#CBD5E1',
  },

  // Advanced Options
  advancedToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  advancedToggleText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  advancedOptions: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.2)',
  },

  // Medical Information
  medicalInfoContainer: {
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
    borderRadius: 10,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  medicalInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22C55E',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicalInfoText: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 18,
    marginBottom: 12,
  },

  // Improvement Tips
  improvementTips: {
    marginTop: 8,
  },
  improvementTipsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  improvementTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    paddingLeft: 4,
  },
  improvementTipText: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 16,
    marginLeft: 8,
    flex: 1,
  },
  improvementTipType: {
    fontWeight: '600',
    color: '#E2E8F0',
    textTransform: 'capitalize',
  },
});