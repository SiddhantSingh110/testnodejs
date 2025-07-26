//app/tabs/upload/styles/UploadReportScreen.styles.js - Enhanced with Health Metrics Styles
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#091429',
    },
    background: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    container: {
      flex: 1,
    },
    contentContainer: {
      padding: 20,
      paddingBottom: 40,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 20,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
    },
    formContainer: {
      marginTop: 10,
    },
    label: {
      color: '#fff',
      marginBottom: 8,
      fontSize: 16,
      fontWeight: '500',
    },
    inputContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: 'rgba(160, 192, 255, 0.2)',
    },
    input: {
      color: '#fff',
      paddingHorizontal: 16,
      paddingVertical: 16,
      fontSize: 16,
    },
    fileSelector: {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(160, 192, 255, 0.2)',
      borderStyle: 'dashed',
      marginBottom: 24,
      overflow: 'hidden',
    },
    chooserContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 36,
    },
    chooserText: {
      fontSize: 16,
      color: '#fff',
      marginTop: 16,
      fontWeight: '500',
    },
    chooserSubtext: {
      fontSize: 14,
      color: '#a0c0ff',
      marginTop: 8,
    },
    selectedFileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    fileIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(56, 191, 167, 0.15)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    fileDetails: {
      flex: 1,
    },
    fileName: {
      fontSize: 15,
      color: '#fff',
      marginBottom: 6,
      fontWeight: '500',
    },
    fileSize: {
      fontSize: 13,
      color: '#a0c0ff',
    },
    changeFileButton: {
      backgroundColor: 'rgba(56, 191, 167, 0.15)',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 16,
    },
    changeFileText: {
      fontSize: 13,
      color: '#38BFA7',
      fontWeight: '500',
    },
    progressContainer: {
      marginBottom: 24,
      backgroundColor: 'rgba(44, 123, 229, 0.1)',
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: 'rgba(44, 123, 229, 0.2)',
    },
    progressHeader: {
      alignItems: 'flex-end',
      marginBottom: 8,
    },
    progressPercent: {
      fontSize: 16,
      fontWeight: '600',
      color: '#38BFA7',
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 12,
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: '#38BFA7',
      borderRadius: 4,
    },
    statusMessage: {
      fontSize: 14,
      color: '#fff',
      marginBottom: 20,
      fontWeight: '500',
      textAlign: 'center',
      marginTop: 8,
    },
    factContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: 12,
      padding: 16,
      marginTop: 8,
      borderWidth: 1,
      borderColor: 'rgba(160, 192, 255, 0.15)',
    },
    factTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#38BFA7',
      marginBottom: 8,
    },
    factText: {
      fontSize: 14,
      color: '#a0c0ff',
      lineHeight: 22,
    },
    buttonGradient: {
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 20,
      elevation: 4,
      shadowColor: '#2C7BE5',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    uploadButton: {
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    uploadButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
      letterSpacing: 0.3,
    },
    
    // ✅ Completed Actions Styles
    completedActions: {
      gap: 16,
      marginBottom: 20,
    },
    secondaryButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(160, 192, 255, 0.3)',
    },
    secondaryButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    secondaryButtonText: {
      color: '#a0c0ff',
      fontSize: 16,
      fontWeight: '600',
    },
    
    helpTextContainer: {
      flexDirection: 'row',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      padding: 16,
      borderRadius: 12,
      marginTop: 20,
      marginBottom: 30,
      borderWidth: 1,
      borderColor: 'rgba(160, 192, 255, 0.15)',
      alignItems: 'flex-start',
    },
    
    helpIcon: {
      marginRight: 12,
      marginTop: 2,
    },
    helpTextContent: {
      flex: 1,
    },
    
    helpText: {
      color: '#a0c0ff',
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 0,
    },
    
    comingSoonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: 'rgba(160, 192, 255, 0.1)',
    },
    
    comingSoonText: {
      color: '#FFC107',
      fontSize: 12,
      marginLeft: 6,
      fontWeight: '500',
    },
    // Compression Modal Styles
    compressionModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    compressionModalContainer: {
      width: '80%',
      maxWidth: 300,
      borderRadius: 20,
      overflow: 'hidden',
    },
    compressionModalContent: {
      padding: 24,
      alignItems: 'center',
    },
    compressionModalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 8,
    },
    compressionModalSubtitle: {
      fontSize: 14,
      color: '#a0c0ff',
      marginBottom: 24,
      textAlign: 'center',
    },
    compressionProgressContainer: {
      width: '100%',
      alignItems: 'center',
    },
    compressionProgressBar: {
      width: '100%',
      height: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 12,
    },
    compressionProgressFill: {
      height: '100%',
      backgroundColor: '#38BFA7',
      borderRadius: 4,
    },
    compressionProgressText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#38BFA7',
    },
    
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'flex-end',
    },
    modalContainer: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      overflow: 'hidden',
      maxHeight: '70%',
    },
    modalGradient: {
      padding: 24,
      paddingBottom: 40,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
    },
    modalSubtitle: {
      fontSize: 14,
      color: '#a0c0ff',
      marginTop: 4,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    optionsContainer: {
      gap: 16,
    },
    optionButton: {
      borderRadius: 20,
      overflow: 'hidden',
    },
    optionGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    optionIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 20,
    },
    optionContent: {
      flex: 1,
    },
    optionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#fff',
      marginBottom: 4,
    },
    optionDescription: {
      fontSize: 14,
      color: '#a0c0ff',
      marginBottom: 2,
    },
    optionSubDescription: {
      fontSize: 12,
      color: '#38BFA7',
      fontWeight: '500',
    },

    // ✨ NEW: Health Metrics Modal Styles
    modalHeaderContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    modalHeaderIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(56, 191, 167, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    modalBody: {
      maxHeight: 400,
      marginBottom: 20,
    },
    modalDescription: {
      fontSize: 14,
      color: '#a0c0ff',
      lineHeight: 20,
      marginBottom: 20,
    },
    categoriesContainer: {
      marginBottom: 20,
    },
    categoriesTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#fff',
      marginBottom: 8,
    },
    categoriesList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    categoryChip: {
      backgroundColor: 'rgba(56, 191, 167, 0.2)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(56, 191, 167, 0.3)',
    },
    categoryChipText: {
      fontSize: 12,
      color: '#38BFA7',
      fontWeight: '500',
    },
    metricPreviewItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
    },
    metricPreviewLeft: {
      flex: 1,
    },
    metricName: {
      fontSize: 14,
      fontWeight: '600',
      color: '#fff',
    },
    metricSource: {
      fontSize: 12,
      color: '#a0c0ff',
      marginTop: 2,
    },
    metricPreviewRight: {
      alignItems: 'flex-end',
    },
    metricValue: {
      fontSize: 14,
      fontWeight: '600',
      color: '#fff',
      marginBottom: 4,
    },
    metricStatusBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
    },
    metricStatusText: {
      fontSize: 10,
      color: '#fff',
      fontWeight: '600',
    },
    moreMetricsText: {
      fontSize: 12,
      color: '#38BFA7',
      textAlign: 'center',
      marginTop: 8,
      fontWeight: '500',
    },
    modalFooter: {
      flexDirection: 'row',
      gap: 12,
      paddingTop: 20,
    },
    modalButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 8,
      gap: 6,
    },
    modalButtonPrimary: {
      backgroundColor: '#38BFA7',
    },
    modalButtonSecondary: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    modalButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#fff',
    },
    modalButtonTextSecondary: {
      fontSize: 14,
      fontWeight: '600',
      color: '#a0c0ff',
    },
  });