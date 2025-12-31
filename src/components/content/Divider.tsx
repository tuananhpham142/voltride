
import { useTheme } from '@/hooks/useTheme';
import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { BaseComponentProps, StyleProps } from '../types/common';
import { fontSize } from '../utils/theme';
// ============================================================================
// DIVIDER
// ============================================================================

export interface DividerProps extends BaseComponentProps, StyleProps {
  /**
   * Divider orientation
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Divider thickness
   */
  thickness?: number;
  
  /**
   * Divider color
   */
  color?: string;
  
  /**
   * Text label
   */
  label?: string;
  
  /**
   * Spacing
   */
  spacing?: number;
}

/**
 * Divider Component
 * 
 * Visual separator between content.
 */
export const Divider = memo<DividerProps>(({
  orientation = 'horizontal',
  thickness = 1,
  color,
  label,
  spacing = 16,
  style,
  testID = 'divider',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();
  const dividerColor = color || colors.border;

  if (label) {
    return (
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: spacing,
          },
          style,
        ]}
        testID={testID}
        {...accessibilityProps}
      >
        <View style={{ flex: 1, height: thickness, backgroundColor: dividerColor }} />
        <Text
          style={{
            marginHorizontal: 16,
            fontSize: fontSize.sm,
            color: colors.textSecondary,
          }}
        >
          {label}
        </Text>
        <View style={{ flex: 1, height: thickness, backgroundColor: dividerColor }} />
      </View>
    );
  }

  if (orientation === 'vertical') {
    return (
      <View
        style={[
          {
            width: thickness,
            height: '100%',
            backgroundColor: dividerColor,
            marginHorizontal: spacing,
          },
          style,
        ]}
        testID={testID}
        {...accessibilityProps}
      />
    );
  }

  return (
    <View
      style={[
        {
          height: thickness,
          backgroundColor: dividerColor,
          marginVertical: spacing,
        },
        style,
      ]}
      testID={testID}
      {...accessibilityProps}
    />
  );
});

Divider.displayName = 'Divider';