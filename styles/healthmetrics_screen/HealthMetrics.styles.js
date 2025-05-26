// app/tabs/health/styles/HealthMetrics.styles.js - Enhanced with new features
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Extra padding at the bottom
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
    backgroundColor: '#0B1426',
  },
  loaderText: {
    fontSize: 16,
    color: '#a0c0ff',
    marginTop: 12,
  },

  // ✨ Recent Updates Section
  recentUpdatesCard: {
    backgroundColor: 'rgba(56, 191, 167, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 191, 167, 0.2)',
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
    backgroundColor: 'rgba(56, 191, 167, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  recentUpdatesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
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
    color: '#fff',
  },
  recentUpdateSubtitle: {
    fontSize: 12,
    color: '#a0c0ff',
    marginTop: 2,
  },
  recentUpdateDate: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 2,
  },
  reviewBadge: {
    backgroundColor: '#38BFA7',
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
    backgroundColor: 'rgba(56, 191, 167, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 191, 167, 0.3)',
  },
  reviewAllButtonText: {
    fontSize: 12,
    color: '#38BFA7',
    fontWeight: '500',
    marginLeft: 6,
  },
  
  // Category Selectors
  categorySelector: {
    padding: 15,
    paddingBottom: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#38BFA7',
  },
  categoryButtonText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#aaa',
  },
  categoryButtonTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  
  // Subcategory selector
  subCategorySelector: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  subCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  subCategoryButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#ddd',
  },
  
  // Metric selector
  metricSelector: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  metricTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricTypeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#ddd',
  },
  
  // Current Value Card
  currentValueCard: {
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  currentValueHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentValueLabel: {
    fontSize: 14,
    color: '#bbb',
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
    color: '#aaa',
    marginLeft: 5,
  },

  // ✨ Enhanced: Reference range in Level 1
  referenceRange: {
    fontSize: 12,
    color: '#a0c0ff',
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
    color: '#aaa',
    fontWeight: '500',
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },

  // ✨ Enhanced: Status indicators
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusNormal: {
    backgroundColor: '#4CAF50',
  },
  statusBorderline: {
    backgroundColor: '#FFC107',
  },
  statusHigh: {
    backgroundColor: '#F44336',
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
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
    color: '#a0c0ff',
    marginRight: 6,
  },
  changeValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  increaseValue: {
    color: '#4CAF50',
  },
  decreaseValue: {
    color: '#F44336',
  },
  unchangedValue: {
    color: '#aaa',
  },

  // ✨ Enhanced: Measurement info with source
  measurementInfoContainer: {
    marginTop: 8,
  },
  measurementDate: {
    fontSize: 13,
    color: '#a0c0ff',
    marginBottom: 4,
  },
  measurementSourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  measurementSource: {
    fontSize: 12,
    color: '#aaa',
    marginLeft: 4,
  },
  needsReviewBadge: {
    backgroundColor: '#38BFA7',
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  goalButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Percentile display
  percentileContainer: {
    width: '100%',
    marginTop: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    padding: 12,
  },
  percentileTitle: {
    color: '#eee',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  percentileBarContainer: {
    marginVertical: 5,
  },
  percentileBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  percentileFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  percentileTarget: {
    position: 'absolute',
    top: -3,
    width: 2,
    height: 14,
    backgroundColor: '#FFC107',
  },
  recommendationsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  recommendationsButtonText: {
    color: '#ddd',
    fontSize: 12,
  },
  
  // ✨ Enhanced: Insights card
  insightsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    margin: 15,
    marginTop: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  insightItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#38BFA7',
  },
  insightWarning: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderLeftColor: '#FFC107',
  },
  insightAttention: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderLeftColor: '#F44336',
  },
  insightPositive: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderLeftColor: '#4CAF50',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  insightDescription: {
    fontSize: 13,
    color: '#a0c0ff',
    lineHeight: 18,
  },
  insightDate: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 4,
  },
  
  // Chart Card
  chartCard: {
    backgroundColor: '#1E1E1E',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 16,
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
    color: '#fff',
  },
  timeframeButtons: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  timeframeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  timeframeButtonActive: {
    backgroundColor: '#38BFA7',
  },
  timeframeButtonText: {
    fontSize: 12,
    color: '#aaa',
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
    color: '#aaa',
    marginTop: 8,
  },
  noChartDataSubtext: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    textAlign: 'center',
  },
  annotation: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    borderLeftWidth: 3,
  },
  annotationTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  annotationText: {
    color: '#aaa',
    fontSize: 12,
  },
  
  // History Card
  historyCard: {
    backgroundColor: '#1E1E1E',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 16,
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
    color: '#fff',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  filterButtonText: {
    fontSize: 12,
    color: '#aaa',
    marginLeft: 5,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
    color: '#aaa',
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
    color: '#aaa',
    marginLeft: 3,
  },
  historyContext: {
    fontSize: 10,
    color: '#888',
    marginLeft: 8,
  },

  // ✨ Enhanced: History review badge
  historyReviewBadge: {
    backgroundColor: '#38BFA7',
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
    color: '#fff',
  },
  historyValueBorderline: {
    color: '#FFC107',
  },
  historyValueHigh: {
    color: '#F44336',
  },
  historyUnit: {
    fontWeight: 'normal',
    color: '#aaa',
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
  
  // Modal styles - Add New Measurement
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
    maxHeight: '80%',
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
    color: '#fff',
  },
  modalScrollView: {
    maxHeight: '60%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  valueInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  valueInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 12,
    fontSize: 16,
  },
  valueUnit: {
    color: '#aaa',
    fontSize: 16,
  },
  notesInput: {
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
  },
  contextButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  contextButtonText: {
    color: '#ddd',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  dateButtonText: {
    color: '#fff',
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoModalContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
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
    color: '#fff',
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
    color: '#fff',
    marginBottom: 8,
  },
  infoSectionText: {
    color: '#ddd',
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
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  rangeOptimal: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  rangeHigh: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  rangeText: {
    color: '#fff',
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
    color: '#ddd',
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
    backgroundColor: '#38BFA7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  factorContent: {
    flex: 1,
  },
  factorTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 3,
  },
  factorDescription: {
    color: '#aaa',
    fontSize: 13,
    lineHeight: 18,
  },
  concernsList: {
    marginTop: 5,
  },
  concernItem: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
  },
  concernTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  concernDescription: {
    color: '#aaa',
    fontSize: 13,
    lineHeight: 18,
  },
  resourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  resourceLinkText: {
    color: '#38BFA7',
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
  infoSourceText: {
    color: '#777',
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
    color: '#aaa',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  toggleHandle: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    top: 2,
  },
  goalSuggestion: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#FFC107',
  },
  goalSuggestionText: {
    color: '#ddd',
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  recommendationDescription: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  recommendationSteps: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 10,
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
    backgroundColor: '#38BFA7',
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
    color: '#ddd',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  recommendationSourceInfo: {
    marginTop: 20,
    marginBottom: 10,
  },
  recommendationSourceText: {
    color: '#777',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});