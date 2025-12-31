// src/components/content/Tag.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius } from '../utils/theme';

// ============================================================================
// TAG
// ============================================================================

export interface TagProps extends BaseComponentProps, StyleProps {
  /**
   * Tag label
   */
  label: string;
  
  /**
   * Tag variant
   */
  variant?: 'filled' | 'outlined';
  
  /**
   * Tag color
   */
  color?: string;
  
  /**
   * On press handler
   */
  onPress?: () => void;
  
  /**
   * On remove handler
   */
  onRemove?: () => void;
  
  /**
   * Tag size
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Left icon
   */
  icon?: string;
}

const tagSizes = {
  sm: { paddingVertical: 4, paddingHorizontal: 8, fontSize: 12, iconSize: 14 },
  md: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 14, iconSize: 16 },
  lg: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 16, iconSize: 18 },
};

/**
 * Tag Component
 * 
 * Chip/label component for categorization.
 */
export const Tag = memo<TagProps>(({
  label,
  variant = 'filled',
  color,
  onPress,
  onRemove,
  size = 'md',
  icon,
  style,
  testID = 'tag',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const tagSize = tagSizes[size];
  const tagColor = color || colors.primary;

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tagSize.paddingVertical,
    paddingHorizontal: tagSize.paddingHorizontal,
    borderRadius: borderRadius.full,
    backgroundColor: variant === 'filled' ? `${tagColor}20` : 'transparent',
    borderWidth: variant === 'outlined' ? 1 : 0,
    borderColor: tagColor,
    gap: 6,
  };

  const textStyle: TextStyle = {
    fontSize: tagSize.fontSize,
    fontWeight: '500',
    color: variant === 'filled' ? tagColor : colors.text,
  };

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[containerStyle, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      testID={testID}
      {...accessibilityProps}
    >
      {icon && <Icon name={icon as any} size={tagSize.iconSize} color={tagColor} />}
      <Text style={textStyle}>{label}</Text>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="close" size={tagSize.iconSize} color={tagColor} />
        </TouchableOpacity>
      )}
    </Wrapper>
  );
});

Tag.displayName = 'Tag';



