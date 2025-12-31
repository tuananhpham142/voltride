
import { useTheme } from '@/hooks/useTheme';
import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BaseComponentProps, StyleProps } from '../types/common';
import { fontSize } from '../utils/theme';
// ============================================================================
// LIST TITLE
// ============================================================================

export interface ListTitleProps extends BaseComponentProps, StyleProps {
  /**
   * Section title
   */
  title: string;
  
  /**
   * Subtitle
   */
  subtitle?: string;
  
  /**
   * Right action
   */
  rightAction?: {
    text: string;
    onPress: () => void;
  };
  
  /**
   * Show divider
   */
  showDivider?: boolean;
}

/**
 * ListTitle Component
 * 
 * Section header for lists.
 */
export const ListTitle = memo<ListTitleProps>(({
  title,
  subtitle,
  rightAction,
  showDivider = true,
  style,
  testID = 'list-title',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();

  return (
    <View testID={testID} {...accessibilityProps}>
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
          },
          style,
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: fontSize.md,
              fontWeight: '600',
              color: colors.text,
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                fontSize: fontSize.sm,
                color: colors.textSecondary,
                marginTop: 2,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {rightAction && (
          <TouchableOpacity onPress={rightAction.onPress} activeOpacity={0.7}>
            <Text
              style={{
                fontSize: fontSize.sm,
                color: colors.primary,
                fontWeight: '500',
              }}
            >
              {rightAction.text}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {showDivider && (
        <View
          style={{
            height: 1,
            backgroundColor: colors.border,
            marginHorizontal: 16,
          }}
        />
      )}
    </View>
  );
});

ListTitle.displayName = 'ListTitle';

