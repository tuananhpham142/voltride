import React, { memo } from 'react';
import { View } from 'react-native';
import { BaseComponentProps, StyleProps } from '../types/common';
import { Skeleton } from './Skeleton';


// ============================================================================
// SKELETON GROUP
// ============================================================================

export interface SkeletonGroupProps extends BaseComponentProps, StyleProps {
  /**
   * Number of lines
   */
  lines?: number;
  
  /**
   * Show avatar
   */
  avatar?: boolean;
  
  /**
   * Show image
   */
  image?: boolean;
}

/**
 * SkeletonGroup Component
 * 
 * Pre-built skeleton layouts.
 */
export const SkeletonGroup = memo<SkeletonGroupProps>(({
  lines = 3,
  avatar = false,
  image = false,
  style,
  testID = 'skeleton-group',
  ...accessibilityProps
}) => {
  return (
    <View style={[{ padding: 16 }, style]} testID={testID} {...accessibilityProps}>
      {avatar && (
        <View style={{ flexDirection: 'row', marginBottom: 16, alignItems: 'center' }}>
          <Skeleton variant="circle" height={48} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Skeleton width="60%" height={16} style={{ marginBottom: 8 }} />
            <Skeleton width="40%" height={12} />
          </View>
        </View>
      )}

      {image && (
        <Skeleton width="100%" height={200} borderRadius={8} style={{ marginBottom: 16 }} />
      )}

      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? '70%' : '100%'}
          height={16}
          style={{ marginBottom: 12 }}
        />
      ))}
    </View>
  );
});

SkeletonGroup.displayName = 'SkeletonGroup';