// src/components/advanced/ImageViewerModal.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { Modal as RNModal, Text, TouchableOpacity, View } from 'react-native';
import { BaseComponentProps } from '../types/common';
import { fontSize } from '../utils/theme';

// ============================================================================
// IMAGE VIEWER MODAL
// ============================================================================

export interface ImageViewerModalProps extends BaseComponentProps {
  /**
   * Modal visibility
   */
  visible: boolean;
  
  /**
   * On dismiss
   */
  onDismiss: () => void;
  
  /**
   * Image URI
   */
  imageUri: string;
  
  /**
   * Image title
   */
  title?: string;
}

/**
 * ImageViewerModal Component
 * 
 * Full-screen image viewer.
 * For advanced features (pinch-to-zoom), install react-native-image-viewing
 */
export const ImageViewerModal = memo<ImageViewerModalProps>(({
  visible,
  onDismiss,
  imageUri,
  title,
  testID = 'image-viewer-modal',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View style={{ flex: 1, backgroundColor: '#000000' }}>
        {/* Header */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            paddingTop: 48,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          {title && (
            <Text style={{ fontSize: fontSize.lg, fontWeight: '600', color: '#FFFFFF' }}>
              {title}
            </Text>
          )}
          <TouchableOpacity onPress={onDismiss} style={{ padding: 8 }}>
            <Icon name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Image */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <img
            src={imageUri}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            alt={title}
          />
        </View>
      </View>
    </RNModal>
  );
});

ImageViewerModal.displayName = 'ImageViewerModal';
