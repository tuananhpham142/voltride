// src/components/advanced/ConfirmationModal.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { Button } from '../control/Button';
import { fontSize } from '../utils/theme';
import { EnhancedModal, EnhancedModalProps } from './EnhancedModal';

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

