import { useTheme } from '@/hooks/useTheme';
import React, { memo } from 'react';
import { Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize } from '../utils/theme';

// ============================================================================
// CONTENT SWITCHER
// ============================================================================

export interface ContentSwitcherItem {
  key: string;
  title: string;
}

export interface ContentSwitcherProps extends BaseComponentProps, StyleProps {
  /**
   * Switcher items
   */
  items: ContentSwitcherItem[];
  
  /**
   * Selected item key
   */
  selectedKey: string;
  
  /**
   * On selection change
   */
  onChange: (key: string) => void;
}

/**
 * ContentSwitcher Component
 * 
 * Switches between 2-4 content sections.
 */
export const ContentSwitcher = memo<ContentSwitcherProps>(({
  items,
  selectedKey,
  onChange,
  style,
  testID = 'content-switcher',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    backgroundColor: isDark ? colors.surface : '#F5F5F5',
    borderRadius: borderRadius.lg,
    padding: 4,
  };

  const itemStyle = (isSelected: boolean): ViewStyle => ({
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    backgroundColor: isSelected ? (isDark ? colors.primary : '#FFFFFF') : 'transparent',
    alignItems: 'center',
  });

  const textStyle = (isSelected: boolean): TextStyle => ({
    fontSize: fontSize.sm,
    fontWeight: isSelected ? '600' : '500',
    color: isSelected ? (isDark ? '#FFFFFF' : colors.primary) : colors.textSecondary,
  });

  return (
    <View style={[containerStyle, style]} testID={testID} {...accessibilityProps}>
      {items.map((item) => {
        const isSelected = item.key === selectedKey;
        return (
          <TouchableOpacity
            key={item.key}
            style={itemStyle(isSelected)}
            onPress={() => onChange(item.key)}
            activeOpacity={0.7}
          >
            <Text style={textStyle(isSelected)}>{item.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

ContentSwitcher.displayName = 'ContentSwitcher';
