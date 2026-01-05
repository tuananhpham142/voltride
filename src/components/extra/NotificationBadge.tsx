import { useTheme } from '@/hooks/useTheme';
import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { BaseComponentProps, StyleProps } from '../types/common';

// ============================================================================
// NOTIFICATION BADGE
// ============================================================================

export interface NotificationBadgeProps extends BaseComponentProps, StyleProps {
  /**
   * Badge count
   */
  count: number;
  
  /**
   * Max count to display
   */
  maxCount?: number;
  
  /**
   * Badge color
   */
  color?: string;
  
  /**
   * Badge size
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Show zero
   */
  showZero?: boolean;
  
  /**
   * Children to wrap
   */
  children: React.ReactNode;
}

/**
 * NotificationBadge Component
 * 
 * Badge wrapper for notification counts.
 */
export const NotificationBadge = memo<NotificationBadgeProps>(({
  count,
  maxCount = 99,
  color,
  size = 'md',
  showZero = false,
  children,
  style,
  testID = 'notification-badge',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();
  const badgeColor = color || colors.error;

  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const badgeSize = sizeMap[size];
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  if (count === 0 && !showZero) {
    return <View style={style}>{children}</View>;
  }

  return (
    <View style={[{ position: 'relative' }, style]} testID={testID} {...accessibilityProps}>
      {children}
      <View
        style={{
          position: 'absolute',
          top: -8,
          right: -8,
          minWidth: badgeSize,
          height: badgeSize,
          borderRadius: badgeSize / 2,
          backgroundColor: badgeColor,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 6,
        }}
      >
        <Text
          style={{
            fontSize: size === 'sm' ? 10 : size === 'md' ? 11 : 12,
            fontWeight: '700',
            color: '#FFFFFF',
          }}
        >
          {displayCount}
        </Text>
      </View>
    </View>
  );
});

NotificationBadge.displayName = 'NotificationBadge';
