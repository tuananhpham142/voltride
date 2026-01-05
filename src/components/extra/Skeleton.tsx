import { useTheme } from '@/hooks/useTheme';
import React, { memo } from 'react';
import { DimensionValue, ViewStyle } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { BaseComponentProps, StyleProps } from '../types/common';

// ============================================================================
// SKELETON LOADER
// ============================================================================

export interface SkeletonProps extends BaseComponentProps, StyleProps {
  /**
   * Skeleton width
   */
  width?: number | string;
  
  /**
   * Skeleton height
   */
  height?: number;
  
  /**
   * Border radius
   */
  borderRadius?: number;
  
  /**
   * Animation speed (ms)
   */
  animationSpeed?: number;
  
  /**
   * Variant
   */
  variant?: 'rect' | 'circle' | 'text';
}

/**
 * Skeleton Component
 * 
 * Loading placeholder with shimmer animation.
 */
export const Skeleton = memo<SkeletonProps>(({
  width = '100%',
  height = 20,
  borderRadius: radius = 4,
  animationSpeed = 1500,
  variant = 'rect',
  style,
  testID = 'skeleton',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const shimmer = useSharedValue(0);

  React.useEffect(() => {
    shimmer.value = withTiming(1, {
      duration: animationSpeed,
    });
    
    const interval = setInterval(() => {
      shimmer.value = 0;
      shimmer.value = withTiming(1, {
        duration: animationSpeed,
      });
    }, animationSpeed);

    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.7, 0.3]),
  }));

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'circle':
        return {
          width: height,
          height: height,
          borderRadius: height / 2,
        };
      case 'text':
        return {
          width: width as DimensionValue,
          height: height * 0.6,
          borderRadius: radius,
        };
      case 'rect':
      default:
        return {
                   width: width as DimensionValue,
          height,
          borderRadius: radius,
        };
    }
  };

  return (
    <Animated.View
      style={[
        {
          backgroundColor: isDark ? '#2A2A2A' : '#E0E0E0',
        },
        getVariantStyle(),
        animatedStyle,
        style,
      ]}
      testID={testID}
      {...accessibilityProps}
    />
  );
});

Skeleton.displayName = 'Skeleton';