// src/components/informative/Badge.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { BaseComponentProps, StyleProps } from '../types/common';


// ============================================================================
// BADGE
// ============================================================================

export type BadgeType = 'number' | 'icon' | 'dot';

export interface BadgeProps extends BaseComponentProps, StyleProps {
  /**
   * Badge type
   */
  type?: BadgeType;
  
  /**
   * Badge content (number or icon name)
   */
  content?: string | number;
  
  /**
   * Badge color
   */
  color?: string;
  
  /**
   * Badge size
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Max number to display (99+)
   */
  maxNumber?: number;
}

/**
 * Badge Component
 * 
 * A small status indicator that can display numbers, icons, or dots.
 * 
 * @example
 * ```tsx
 * <Badge type="number" content={5} color="#FF0000" />
 * <Badge type="icon" content="check" color="#4CAF50" />
 * <Badge type="dot" color="#FF9800" />
 * ```
 */
export const Badge = memo<BadgeProps>(({
  type = 'number',
  content,
  color,
  size = 'md',
  maxNumber = 99,
  style,
  testID = 'badge',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();
  const badgeColor = color || colors.error;

  const sizeMap = {
    sm: { size: 16, fontSize: 10, iconSize: 10 },
    md: { size: 20, fontSize: 12, iconSize: 12 },
    lg: { size: 24, fontSize: 14, iconSize: 14 },
  };

  const dimensions = sizeMap[size];

  // Format number content
  const getDisplayContent = () => {
    if (type === 'number' && typeof content === 'number') {
      return content > maxNumber ? `${maxNumber}+` : content.toString();
    }
    return content;
  };

  const containerStyle: ViewStyle = {
    backgroundColor: badgeColor,
    borderRadius: dimensions.size / 2,
    minWidth: type === 'dot' ? dimensions.size * 0.6 : dimensions.size,
    height: type === 'dot' ? dimensions.size * 0.6 : dimensions.size,
    paddingHorizontal: type === 'number' ? 6 : 0,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const textStyle: TextStyle = {
    fontSize: dimensions.fontSize,
    fontWeight: '600',
    color: '#FFFFFF',
  };

  if (type === 'dot') {
    return (
      <View
        style={[containerStyle, style]}
        testID={testID}
        {...accessibilityProps}
      />
    );
  }

  if (type === 'icon' && typeof content === 'string') {
    return (
      <View
        style={[containerStyle, style]}
        testID={testID}
        {...accessibilityProps}
      >
        <Icon name={content as any} size={dimensions.iconSize} color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View
      style={[containerStyle, style]}
      testID={testID}
      {...accessibilityProps}
    >
      <Text style={textStyle}>{getDisplayContent()}</Text>
    </View>
  );
});

Badge.displayName = 'Badge';
