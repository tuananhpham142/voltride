import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { BaseComponentProps, StyleProps } from '../types/common';
import { fontSize } from '../utils/theme';
// ============================================================================
// TIMELINE
// ============================================================================

export interface TimelineItem {
  key: string;
  title: string;
  description?: string;
  timestamp?: string;
  icon?: string;
  iconColor?: string;
  status?: 'completed' | 'active' | 'pending';
}

export interface TimelineProps extends BaseComponentProps, StyleProps {
  /**
   * Timeline items
   */
  items: TimelineItem[];
  
  /**
   * Orientation
   */
  orientation?: 'vertical' | 'horizontal';
}

/**
 * Timeline Component
 * 
 * Vertical or horizontal timeline display.
 */
export const Timeline = memo<TimelineProps>(({
  items,
  orientation = 'vertical',
  style,
  testID = 'timeline',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'active':
        return colors.primary;
      case 'pending':
      default:
        return colors.border;
    }
  };

  if (orientation === 'horizontal') {
    return (
      <View
        style={[{ flexDirection: 'row', alignItems: 'flex-start' }, style]}
        testID={testID}
        {...accessibilityProps}
      >
        {items.map((item, index) => (
          <View key={item.key} style={{ flex: 1, alignItems: 'center' }}>
            {/* Node */}
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: item.iconColor || getStatusColor(item.status),
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {item.icon ? (
                <Icon name={item.icon as any} size={20} color="#FFFFFF" />
              ) : (
                <Text style={{ fontSize: fontSize.sm, fontWeight: '600', color: '#FFFFFF' }}>
                  {index + 1}
                </Text>
              )}
            </View>

            {/* Line */}
            {index < items.length - 1 && (
              <View
                style={{
                  position: 'absolute',
                  top: 20,
                  left: '50%',
                  right: '-50%',
                  height: 2,
                  backgroundColor: getStatusColor(items[index + 1].status),
                }}
              />
            )}

            {/* Content */}
            <View style={{ marginTop: 12, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: fontSize.sm,
                  fontWeight: '600',
                  color: colors.text,
                  textAlign: 'center',
                }}
              >
                {item.title}
              </Text>
              {item.timestamp && (
                <Text
                  style={{
                    fontSize: fontSize.xs,
                    color: colors.textSecondary,
                    marginTop: 2,
                  }}
                >
                  {item.timestamp}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={style} testID={testID} {...accessibilityProps}>
      {items.map((item, index) => (
        <View key={item.key} style={{ flexDirection: 'row' }}>
          {/* Left side */}
          <View style={{ alignItems: 'center', marginRight: 16 }}>
            {/* Node */}
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: item.iconColor || getStatusColor(item.status),
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {item.icon ? (
                <Icon name={item.icon as any} size={20} color="#FFFFFF" />
              ) : (
                <Text style={{ fontSize: fontSize.sm, fontWeight: '600', color: '#FFFFFF' }}>
                  {index + 1}
                </Text>
              )}
            </View>

            {/* Line */}
            {index < items.length - 1 && (
              <View
                style={{
                  width: 2,
                  flex: 1,
                  backgroundColor: getStatusColor(items[index + 1].status),
                  marginVertical: 4,
                }}
              />
            )}
          </View>

          {/* Right side */}
          <View style={{ flex: 1, paddingBottom: 24 }}>
            <Text style={{ fontSize: fontSize.md, fontWeight: '600', color: colors.text }}>
              {item.title}
            </Text>
            {item.description && (
              <Text
                style={{
                  fontSize: fontSize.sm,
                  color: colors.textSecondary,
                  marginTop: 4,
                  lineHeight: 20,
                }}
              >
                {item.description}
              </Text>
            )}
            {item.timestamp && (
              <Text
                style={{
                  fontSize: fontSize.xs,
                  color: colors.textSecondary,
                  marginTop: 8,
                }}
              >
                {item.timestamp}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
});

Timeline.displayName = 'Timeline';