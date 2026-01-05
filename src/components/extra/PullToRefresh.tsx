import { useTheme } from '@/hooks/useTheme';
import React, { memo } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { BaseComponentProps, StyleProps } from '../types/common';

// ============================================================================
// PULL TO REFRESH CONTAINER
// ============================================================================

export interface PullToRefreshProps extends BaseComponentProps, StyleProps {
  /**
   * Refreshing state
   */
  refreshing: boolean;
  
  /**
   * On refresh callback
   */
  onRefresh: () => void;
  
  /**
   * Children content
   */
  children: React.ReactNode;
  
  /**
   * Pull distance
   */
  pullDistance?: number;
}

/**
 * PullToRefresh Component
 * 
 * Container with pull-to-refresh functionality.
 * Note: For ScrollView, use built-in RefreshControl instead.
 */
export const PullToRefresh = memo<PullToRefreshProps>(({
  refreshing,
  onRefresh,
  children,
  pullDistance = 80,
  style,
  testID = 'pull-to-refresh',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();
  const translateY = useSharedValue(0);
  const isRefreshing = useSharedValue(false);

  React.useEffect(() => {
    if (refreshing) {
      isRefreshing.value = true;
      translateY.value = withSpring(pullDistance);
    } else {
      isRefreshing.value = false;
      translateY.value = withSpring(0);
    }
  }, [refreshing]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0 && !isRefreshing.value) {
        translateY.value = event.translationY * 0.5;
      }
    })
    .onEnd(() => {
      if (translateY.value > pullDistance && !isRefreshing.value) {
        runOnJS(onRefresh)();
      } else if (!isRefreshing.value) {
        translateY.value = withSpring(0);
      }
    });

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [0, pullDistance],
      [0, 1],
      Extrapolate.CLAMP
    ),
    transform: [
      {
        rotate: `${interpolate(
          translateY.value,
          [0, pullDistance],
          [0, 360],
          Extrapolate.CLAMP
        )}deg`,
      },
    ],
  }));

  return (
    <View style={[{ flex: 1 }, style]} testID={testID} {...accessibilityProps}>
      {/* Refresh indicator */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: -pullDistance,
            left: 0,
            right: 0,
            height: pullDistance,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          },
          indicatorAnimatedStyle,
        ]}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            borderWidth: 3,
            borderColor: colors.primary,
            borderTopColor: 'transparent',
          }}
        />
      </Animated.View>

      {/* Content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[{ flex: 1 }, containerAnimatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

PullToRefresh.displayName = 'PullToRefresh';