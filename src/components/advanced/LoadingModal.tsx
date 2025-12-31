// src/components/advanced/LoadingModal.tsx
import { useTheme } from '@/hooks/useTheme';
import React, { memo } from 'react';
import { Modal as RNModal, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { BaseComponentProps } from '../types/common';
import { borderRadius, fontSize, shadows } from '../utils/theme';
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
