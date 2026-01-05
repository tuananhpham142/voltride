// src/components/informative/EmptyState.tsx

import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Heading } from '../content/Heading';
import { Text } from '../content/Text';
import { Button } from '../control/Button';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  variant?: 'default' | 'info' | 'warning' | 'error';
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  actionLabel,
  onActionPress,
  variant = 'default',
  style,
}) => {
  const { colors } = useTheme();

  const variantColors = {
    default: colors.textSecondary,
    info: colors.primary,
    warning: colors.warning,
    error: colors.error,
  };

  const iconColor = variantColors[variant];

  return (
    <View style={[styles.container, style]}>
      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: `${iconColor}15`,
          },
        ]}
      >
        <Icon name={icon as any} size={48} color={iconColor} />
      </View>

      {/* Title */}
      <Heading
        level={4}
        style={{
          color: colors.text,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        {title}
      </Heading>

      {/* Description */}
      {description && (
        <Text
          variant="body2"
          style={{
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: actionLabel ? 24 : 0,
            maxWidth: 300,
          }}
        >
          {description}
        </Text>
      )}

      {/* Action Button */}
      {actionLabel && onActionPress && (
        <Button
          title={actionLabel}
          variant="outline"
          onPress={onActionPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
});

export default EmptyState;
