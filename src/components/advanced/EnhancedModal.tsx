// src/components/advanced/EnhancedModal.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { DimensionValue, Modal as RNModal, ScrollView, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize, shadows } from '../utils/theme';

// ============================================================================
// ENHANCED MODAL
// ============================================================================

export interface EnhancedModalProps extends BaseComponentProps, StyleProps {
  /**
   * Modal visibility
   */
  visible: boolean;
  
  /**
   * On dismiss (backdrop press or back button)
   */
  onDismiss: () => void;
  
  /**
   * Modal title
   */
  title?: string;
  
  /**
   * Modal type
   */
  type?: 'center' | 'bottom' | 'fullScreen' | 'slide';
  
  /**
   * Animation type
   */
  animationType?: 'fade' | 'slide' | 'none';
  
  /**
   * Show close button
   */
  showCloseButton?: boolean;
  
  /**
   * Backdrop opacity
   */
  backdropOpacity?: number;
  
  /**
   * Backdrop dismissible
   */
  backdropDismissible?: boolean;
  
  /**
   * Children content
   */
  children: React.ReactNode;
  
  /**
   * Footer buttons
   */
  footer?: React.ReactNode;
  
  /**
   * Max height
   */
  maxHeight?: number | string;
  
  /**
   * Enable scroll
   */
  scrollable?: boolean;
}

/**
 * EnhancedModal Component
 * 
 * Feature-rich modal with multiple presentation styles.
 * 
 * @example
 * ```tsx
 * <EnhancedModal
 *   visible={showModal}
 *   onDismiss={() => setShowModal(false)}
 *   title="Modal Title"
 *   type="center"
 *   showCloseButton
 * >
 *   <Text>Modal content</Text>
 * </EnhancedModal>
 * ```
 */
export const EnhancedModal = memo<EnhancedModalProps>(({
  visible,
  onDismiss,
  title,
  type = 'center',
  animationType = 'fade',
  showCloseButton = true,
  backdropOpacity = 0.5,
  backdropDismissible = true,
  children,
  footer,
  maxHeight = '80%',
  scrollable = true,
  style,
  testID = 'enhanced-modal',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();

  const getModalStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: isDark ? colors.surface : '#FFFFFF',
      borderRadius: borderRadius.xl,
      maxHeight: maxHeight as DimensionValue,
    };

    switch (type) {
      case 'bottom':
        return {
          ...baseStyle,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          maxHeight: '90%',
        };
      case 'fullScreen':
        return {
          flex: 1,
          backgroundColor: isDark ? colors.surface : '#FFFFFF',
          borderRadius: 0,
        };
      case 'slide':
        return {
          ...baseStyle,
          width: '90%',
        };
      case 'center':
      default:
        return {
          ...baseStyle,
          maxWidth: 400,
          width: '90%',
        };
    }
  };

  const getContainerStyle = (): ViewStyle => {
    switch (type) {
      case 'bottom':
        return {
          flex: 1,
          justifyContent: 'flex-end',
        };
      case 'fullScreen':
        return {
          flex: 1,
        };
      default:
        return {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        };
    }
  };

  const ContentWrapper = scrollable && type !== 'fullScreen' ? ScrollView : View;

  return (
    <RNModal
      visible={visible}
      transparent={type !== 'fullScreen'}
      animationType={animationType}
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: type === 'fullScreen' ? 'transparent' : `rgba(0,0,0,${backdropOpacity})`,
        }}
      >
        <TouchableOpacity
          style={{ flex: type === 'fullScreen' ? 0 : 1 }}
          activeOpacity={1}
          onPress={backdropDismissible ? onDismiss : undefined}
          disabled={!backdropDismissible}
        />

        <View style={getContainerStyle()}>
          <Animated.View
            entering={type === 'bottom' ? SlideInDown : FadeIn}
            exiting={type === 'bottom' ? SlideOutDown : FadeOut}
            style={[
              getModalStyle(),
              type !== 'fullScreen' && shadows.xl,
              style,
            ]}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSize.xl,
                    fontWeight: '700',
                    color: colors.text,
                    flex: 1,
                  }}
                >
                  {title}
                </Text>
                {showCloseButton && (
                  <TouchableOpacity onPress={onDismiss} style={{ padding: 4 }}>
                    <Icon name="close" size={24} color={colors.text} />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Content */}
            <ContentWrapper
              style={{ flex: type === 'fullScreen' ? 1 : undefined }}
              contentContainerStyle={scrollable ? { padding: 20 } : undefined}
            >
              <View style={!scrollable ? { padding: 20 } : undefined}>
                {children}
              </View>
            </ContentWrapper>

            {/* Footer */}
            {footer && (
              <View
                style={{
                  padding: 20,
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                }}
              >
                {footer}
              </View>
            )}
          </Animated.View>
        </View>
      </View>
    </RNModal>
  );
});

EnhancedModal.displayName = 'EnhancedModal';
