import { useTheme } from '@/hooks/useTheme';
import React, { memo } from 'react';
import { Dimensions, View } from 'react-native';
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================================================
// SWIPEABLE CARD
// ============================================================================

export interface SwipeableCardProps extends BaseComponentProps, StyleProps {
  /**
   * Card content
   */
  children: React.ReactNode;
  
  /**
   * On swipe left
   */
  onSwipeLeft?: () => void;
  
  /**
   * On swipe right
   */
  onSwipeRight?: () => void;
  
  /**
   * Left action color
   */
  leftActionColor?: string;
  
  /**
   * Right action color
   */
  rightActionColor?: string;
  
  /**
   * Left action icon
   */
  leftActionIcon?: React.ReactNode;
  
  /**
   * Right action icon
   */
  rightActionIcon?: React.ReactNode;
  
  /**
   * Swipe threshold
   */
  swipeThreshold?: number;
}

/**
 * SwipeableCard Component
 * 
 * Card that can be swiped left or right.
 */
export const SwipeableCard = memo<SwipeableCardProps>(({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftActionColor = '#4CAF50',
  rightActionColor = '#F44336',
  leftActionIcon,
  rightActionIcon,
  swipeThreshold = 100,
  style,
  testID = 'swipeable-card',
  ...accessibilityProps
}) => {
  const translateX = useSharedValue(0);
  const { colors } = useTheme();

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > swipeThreshold) {
        if (event.translationX > 0) {
          translateX.value = withSpring(SCREEN_WIDTH);
          if (onSwipeRight) {
            runOnJS(onSwipeRight)();
          }
        } else {
          translateX.value = withSpring(-SCREEN_WIDTH);
          if (onSwipeLeft) {
            runOnJS(onSwipeLeft)();
          }
        }
      } else {
        translateX.value = withSpring(0);
      }
    });

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const leftActionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, swipeThreshold],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  const rightActionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-swipeThreshold, 0],
      [1, 0],
      Extrapolate.CLAMP
    ),
  }));

  return (
    <View style={[{ overflow: 'hidden' }, style]} testID={testID} {...accessibilityProps}>
      {/* Left action */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '50%',
            backgroundColor: leftActionColor,
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingRight: 20,
          },
          leftActionAnimatedStyle,
        ]}
      >
        {leftActionIcon}
      </Animated.View>

      {/* Right action */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '50%',
            backgroundColor: rightActionColor,
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingLeft: 20,
          },
          rightActionAnimatedStyle,
        ]}
      >
        {rightActionIcon}
      </Animated.View>

      {/* Card content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={cardAnimatedStyle}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

SwipeableCard.displayName = 'SwipeableCard';