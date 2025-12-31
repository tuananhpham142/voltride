// src/components/advanced/ModalComponents.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { DimensionValue, Modal as RNModal, ScrollView, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { Button } from '../control/Button';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize, shadows } from '../utils/theme';

// Note: Install react-native-modal for enhanced animations
// npm install react-native-modal
// Then import: import Modal from 'react-native-modal';

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

// ============================================================================
// CONFIRMATION MODAL
// ============================================================================

export interface ConfirmationModalProps extends Omit<EnhancedModalProps, 'children' | 'footer'> {
  /**
   * Description text
   */
  description: string;
  
  /**
   * Confirm button text
   */
  confirmText?: string;
  
  /**
   * Cancel button text
   */
  cancelText?: string;
  
  /**
   * On confirm
   */
  onConfirm: () => void;
  
  /**
   * On cancel
   */
  onCancel?: () => void;
  
  /**
   * Confirmation type
   */
  variant?: 'default' | 'destructive' | 'warning';
  
  /**
   * Icon
   */
  icon?: string;
}

/**
 * ConfirmationModal Component
 * 
 * Quick confirmation dialog.
 */
export const ConfirmationModal = memo<ConfirmationModalProps>(({
  visible,
  onDismiss,
  title = 'Confirm',
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  icon,
  ...props
}) => {
  const { colors } = useTheme();

  const getIconConfig = () => {
    switch (variant) {
      case 'destructive':
        return { name: icon || 'warning', color: colors.error };
      case 'warning':
        return { name: icon || 'info', color: colors.warning };
      default:
        return { name: icon || 'help-outline', color: colors.primary };
    }
  };

  const iconConfig = getIconConfig();

  const footer = (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <View style={{ flex: 1 }}>
        <Button
          title={cancelText}
          variant="outline"
          size="md"
          onPress={() => {
            onCancel?.();
            onDismiss();
          }}
          fullWidth
        />
      </View>
      <View style={{ flex: 1 }}>
        <Button
          title={confirmText}
          variant="primary"
          size="md"
          onPress={() => {
            onConfirm();
            onDismiss();
          }}
          fullWidth
          backgroundColor={variant === 'destructive' ? colors.error : undefined}
        />
      </View>
    </View>
  );

  return (
    <EnhancedModal
      {...props}
      visible={visible}
      onDismiss={onDismiss}
      title={title}
      type="center"
      showCloseButton={false}
      footer={footer}
      scrollable={false}
    >
      <View style={{ alignItems: 'center', paddingVertical: 8 }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: `${iconConfig.color}20`,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Icon name={iconConfig.name as any} size={32} color={iconConfig.color} />
        </View>
        <Text
          style={{
            fontSize: fontSize.md,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 22,
          }}
        >
          {description}
        </Text>
      </View>
    </EnhancedModal>
  );
});

ConfirmationModal.displayName = 'ConfirmationModal';

// ============================================================================
// LOADING MODAL
// ============================================================================

export interface LoadingModalProps extends BaseComponentProps {
  /**
   * Loading visibility
   */
  visible: boolean;
  
  /**
   * Loading message
   */
  message?: string;
  
  /**
   * Can dismiss
   */
  dismissible?: boolean;
  
  /**
   * On dismiss
   */
  onDismiss?: () => void;
}

/**
 * LoadingModal Component
 * 
 * Full-screen loading overlay.
 */
export const LoadingModal = memo<LoadingModalProps>(({
  visible,
  message = 'Loading...',
  dismissible = false,
  onDismiss,
  testID = 'loading-modal',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={dismissible ? onDismiss : undefined}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        activeOpacity={1}
        onPress={dismissible ? onDismiss : undefined}
        disabled={!dismissible}
      >
        <Animated.View
          entering={FadeIn}
          style={{
            backgroundColor: isDark ? colors.surface : '#FFFFFF',
            borderRadius: borderRadius.xl,
            padding: 32,
            alignItems: 'center',
            minWidth: 200,
            ...shadows.xl,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              borderWidth: 4,
              borderColor: colors.primary,
              borderTopColor: 'transparent',
            }}
          />
          <Text
            style={{
              marginTop: 16,
              fontSize: fontSize.md,
              color: colors.text,
              textAlign: 'center',
            }}
          >
            {message}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </RNModal>
  );
});

LoadingModal.displayName = 'LoadingModal';

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
