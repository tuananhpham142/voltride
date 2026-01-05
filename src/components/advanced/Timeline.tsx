// src/components/content/Timeline.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BaseComponentProps, StyleProps } from '../types/common';
import { fontSize } from '../utils/theme';

// ============================================================================
// TIMELINE ITEM
// ============================================================================

export type TimelineItemStatus = 'completed' | 'active' | 'pending' | 'error';

export interface TimelineItemData {
  /**
   * Unique key
   */
  key: string;
  
  /**
   * Title/heading
   */
  title: string;
  
  /**
   * Description/details
   */
  description?: string;
  
  /**
   * Timestamp
   */
  timestamp?: string;
  
  /**
   * Status
   */
  status: TimelineItemStatus;
  
  /**
   * Custom icon name
   */
  icon?: string;
  
  /**
   * Additional metadata
   */
  metadata?: string;
  
  /**
   * Custom content render
   */
  content?: React.ReactNode;
}

// ============================================================================
// TIMELINE
// ============================================================================

export interface TimelineProps extends BaseComponentProps, StyleProps {
  /**
   * Timeline items
   */
  items: TimelineItemData[];
  
  /**
   * Show timestamp
   */
  showTimestamp?: boolean;
  
  /**
   * Show connecting line
   */
  showLine?: boolean;
  
  /**
   * Dot size
   */
  dotSize?: 'sm' | 'md' | 'lg';
  
  /**
   * Line style
   */
  lineStyle?: 'solid' | 'dashed';
  
  /**
   * Alternate layout (timestamp on side)
   */
  alternateLayout?: boolean;
  
  /**
   * Compact mode (less spacing)
   */
  compact?: boolean;
}

/**
 * Timeline Component
 * 
 * Vertical timeline for tracking logs, order history, activity feeds.
 * 
 * @example
 * ```tsx
 * <Timeline
 *   items={[
 *     {
 *       key: '1',
 *       title: 'Order Placed',
 *       description: 'Your order has been received',
 *       timestamp: '2024-01-15 10:30 AM',
 *       status: 'completed',
 *       icon: 'check-circle',
 *     },
 *     {
 *       key: '2',
 *       title: 'Processing',
 *       description: 'Order is being prepared',
 *       timestamp: '2024-01-15 11:00 AM',
 *       status: 'active',
 *       icon: 'hourglass-empty',
 *     },
 *     {
 *       key: '3',
 *       title: 'Shipped',
 *       description: 'Order is on the way',
 *       status: 'pending',
 *       icon: 'local-shipping',
 *     },
 *   ]}
 *   showTimestamp
 * />
 * ```
 */
export const Timeline = memo<TimelineProps>(({
  items,
  showTimestamp = true,
  showLine = true,
  dotSize = 'md',
  lineStyle = 'solid',
  alternateLayout = false,
  compact = false,
  style,
  testID = 'timeline',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();

  const getDotSize = () => {
    switch (dotSize) {
      case 'sm':
        return 24;
      case 'lg':
        return 40;
      case 'md':
      default:
        return 32;
    }
  };

  const getIconSize = () => {
    switch (dotSize) {
      case 'sm':
        return 14;
      case 'lg':
        return 22;
      case 'md':
      default:
        return 18;
    }
  };

  const getStatusColor = (status: TimelineItemStatus) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'active':
        return colors.primary;
      case 'error':
        return colors.error;
      case 'pending':
      default:
        return colors.textSecondary;
    }
  };

  const getDefaultIcon = (status: TimelineItemStatus) => {
    switch (status) {
      case 'completed':
        return 'check-circle';
      case 'active':
        return 'radio-button-checked';
      case 'error':
        return 'error';
      case 'pending':
      default:
        return 'radio-button-unchecked';
    }
  };

  const renderTimelineItem = (item: TimelineItemData, index: number) => {
    const isLast = index === items.length - 1;
    const statusColor = getStatusColor(item.status);
    const iconName = item.icon || getDefaultIcon(item.status);
    const size = getDotSize();

    if (alternateLayout) {
      return (
        <View
          key={item.key}
          style={[
            styles.itemContainerAlternate,
            compact && styles.itemContainerCompact,
          ]}
        >
          {/* Timestamp */}
          {showTimestamp && item.timestamp && (
            <View style={styles.timestampContainerAlternate}>
              <Text
                style={[
                  styles.timestampAlternate,
                  { color: colors.textSecondary },
                ]}
              >
                {item.timestamp}
              </Text>
            </View>
          )}

          {/* Dot and Line */}
          <View style={styles.lineContainerAlternate}>
            <View
              style={[
                styles.dot,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor: statusColor,
                },
              ]}
            >
              <Icon
                name={iconName as any}
                size={getIconSize()}
                color="#FFFFFF"
              />
            </View>
            {!isLast && showLine && (
              <View
                style={[
                  styles.line,
                  {
                    backgroundColor:
                      lineStyle === 'dashed' ? 'transparent' : colors.border,
                    borderLeftWidth: lineStyle === 'dashed' ? 2 : 0,
                    borderLeftColor: colors.border,
                    borderStyle: lineStyle === 'dashed' ? 'dashed' : 'solid',
                  },
                ]}
              />
            )}
          </View>

          {/* Content */}
          <View style={styles.contentContainerAlternate}>
            <Text style={[styles.title, { color: colors.text }]}>
              {item.title}
            </Text>
            {item.description && (
              <Text
                style={[styles.description, { color: colors.textSecondary }]}
              >
                {item.description}
              </Text>
            )}
            {item.metadata && (
              <Text style={[styles.metadata, { color: colors.textSecondary }]}>
                {item.metadata}
              </Text>
            )}
            {item.content}
          </View>
        </View>
      );
    }

    return (
      <View
        key={item.key}
        style={[
          styles.itemContainer,
          compact && styles.itemContainerCompact,
        ]}
      >
        {/* Dot and Line */}
        <View style={styles.lineContainer}>
          <View
            style={[
              styles.dot,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: statusColor,
              },
            ]}
          >
            <Icon
              name={iconName as any}
              size={getIconSize()}
              color="#FFFFFF"
            />
          </View>
          {!isLast && showLine && (
            <View
              style={[
                styles.line,
                {
                  backgroundColor:
                    lineStyle === 'dashed' ? 'transparent' : colors.border,
                  borderLeftWidth: lineStyle === 'dashed' ? 2 : 0,
                  borderLeftColor: colors.border,
                  borderStyle: lineStyle === 'dashed' ? 'dashed' : 'solid',
                },
              ]}
            />
          )}
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {item.title}
            </Text>
            {showTimestamp && item.timestamp && (
              <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
                {item.timestamp}
              </Text>
            )}
          </View>

          {/* Description */}
          {item.description && (
            <Text
              style={[styles.description, { color: colors.textSecondary }]}
            >
              {item.description}
            </Text>
          )}

          {/* Metadata */}
          {item.metadata && (
            <Text style={[styles.metadata, { color: colors.textSecondary }]}>
              {item.metadata}
            </Text>
          )}

          {/* Custom content */}
          {item.content}
        </View>
      </View>
    );
  };

  return (
    <View
      style={[styles.container, style]}
      testID={testID}
      {...accessibilityProps}
    >
      {items.map((item, index) => renderTimelineItem(item, index))}
    </View>
  );
});

Timeline.displayName = 'Timeline';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  itemContainerCompact: {
    marginBottom: 16,
  },
  itemContainerAlternate: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  lineContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  lineContainerAlternate: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  dot: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  line: {
    position: 'absolute',
    top: 32,
    bottom: -24,
    width: 2,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 8,
  },
  contentContainerAlternate: {
    flex: 1,
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: fontSize.sm,
    fontWeight: '400',
  },
  timestampContainerAlternate: {
    width: 100,
    paddingTop: 4,
  },
  timestampAlternate: {
    fontSize: fontSize.sm,
    fontWeight: '400',
    textAlign: 'right',
  },
  description: {
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginTop: 4,
  },
  metadata: {
    fontSize: fontSize.xs,
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default Timeline;