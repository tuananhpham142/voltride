import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Badge } from '../informative/Badge';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize } from '../utils/theme';
// ============================================================================
// FILTER
// ============================================================================

export interface FilterProps extends BaseComponentProps, StyleProps {
  /**
   * Filter label
   */
  label: string;
  
  /**
   * Active filter count
   */
  count?: number;
  
  /**
   * On press handler
   */
  onPress: () => void;
  
  /**
   * Active state
   */
  active?: boolean;
}

/**
 * Filter Component
 * 
 * Filter button with count badge.
 */
export const Filter = memo<FilterProps>(({
  label,
  count = 0,
  onPress,
  active = false,
  style,
  testID = 'filter',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: active ? colors.primary : colors.border,
    backgroundColor: active ? `${colors.primary}10` : 'transparent',
    gap: 8,
  };

  return (
    <TouchableOpacity
      style={[containerStyle, style]}
      onPress={onPress}
      activeOpacity={0.7}
      testID={testID}
      {...accessibilityProps}
    >
      <Icon
        name="filter-list"
        size={18}
        color={active ? colors.primary : colors.textSecondary}
      />
      <Text
        style={{
          fontSize: fontSize.sm,
          fontWeight: '500',
          color: active ? colors.primary : colors.text,
        }}
      >
        {label}
      </Text>
      {count > 0 && (
        <Badge type="number" content={count} size="sm" color={colors.primary} />
      )}
      <Icon
        name="keyboard-arrow-down"
        size={18}
        color={active ? colors.primary : colors.textSecondary}
      />
    </TouchableOpacity>
  );
});

Filter.displayName = 'Filter';
