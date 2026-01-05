import { useTheme } from '@/hooks/useTheme';
import React, { memo } from 'react';
import { ScrollView, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Badge } from '../informative/Badge';
import { BaseComponentProps, StyleProps } from '../types/common';
import { fontSize } from '../utils/theme';

// ============================================================================
// TABS
// ============================================================================

export interface TabItem {
  key: string;
  title: string;
  badge?: number;
}

export interface TabsProps extends BaseComponentProps, StyleProps {
  /**
   * Tab items
   */
  items: TabItem[];

  /**
   * Selected tab key
   */
  selectedKey: string;

  /**
   * On tab change
   */
  onChange: (key: string) => void;

  /**
   * Scrollable tabs
   */
  scrollable?: boolean;
}

/**
 * Tabs Component
 *
 * Horizontal tab navigation.
 */
export const Tabs = memo<TabsProps>(
  ({ items, selectedKey, onChange, scrollable = false, style, testID = 'tabs', ...accessibilityProps }) => {
    const { colors, isDark } = useTheme();

    const containerStyle: ViewStyle = {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    };

    const tabStyle = (isSelected: boolean): ViewStyle => ({
      paddingVertical: 16,
      paddingHorizontal: scrollable ? 20 : 16,
      borderBottomWidth: 2,
      borderBottomColor: isSelected ? colors.primary : 'transparent',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    });

    const textStyle = (isSelected: boolean): TextStyle => ({
      fontSize: fontSize.md,
      fontWeight: isSelected ? '600' : '500',
      color: isSelected ? colors.primary : colors.textSecondary,
    });

    const content = (
      <View style={[containerStyle, style]} testID={testID} {...accessibilityProps}>
        {items.map((item) => {
          const isSelected = item.key === selectedKey;
          return (
            <TouchableOpacity
              key={item.key}
              style={tabStyle(isSelected)}
              onPress={() => onChange(item.key)}
              activeOpacity={0.7}
            >
              <Text style={textStyle(isSelected)}>{item.title}</Text>
              {item.badge && item.badge > 0 ? <Badge type='number' content={item.badge} size='sm' /> : <></>}
            </TouchableOpacity>
          );
        })}
      </View>
    );

    if (scrollable) {
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row' }}>
          {content}
        </ScrollView>
      );
    }

    return <View style={{ flexDirection: 'row' }}>{content}</View>;
  },
);

Tabs.displayName = 'Tabs';
