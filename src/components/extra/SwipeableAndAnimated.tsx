
// src/components/extra/SwipeableAndAnimated.tsx
import { useTheme } from '@/hooks/useTheme';
import React, { memo, useState } from 'react';
import { Dimensions, DimensionValue, ScrollView, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { BaseComponentProps, StyleProps } from '../types/common';

/**
 * For advanced carousel features, install:
 * npm install react-native-reanimated-carousel
 * 
 * For snap carousel:
 * npm install react-native-snap-carousel
 */

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

// ============================================================================
// CAROUSEL
// ============================================================================

export interface CarouselProps extends BaseComponentProps, StyleProps {
  /**
   * Carousel items
   */
  data: any[];
  
  /**
   * Render item
   */
  renderItem: (item: any, index: number) => React.ReactNode;
  
  /**
   * Item width
   */
  itemWidth?: number;
  
  /**
   * Show pagination
   */
  showPagination?: boolean;
  
  /**
   * Auto play
   */
  autoPlay?: boolean;
  
  /**
   * Auto play interval
   */
  autoPlayInterval?: number;
  
  /**
   * On change index
   */
  onIndexChange?: (index: number) => void;
}

/**
 * Carousel Component
 * 
 * Horizontal scrollable carousel with pagination.
 */
export const Carousel = memo<CarouselProps>(({
  data,
  renderItem,
  itemWidth = SCREEN_WIDTH - 40,
  showPagination = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  onIndexChange,
  style,
  testID = 'carousel',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    if (autoPlay && data.length > 1) {
      const interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % data.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * (itemWidth + 16),
          animated: true,
        });
        setCurrentIndex(nextIndex);
        onIndexChange?.(nextIndex);
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [autoPlay, currentIndex, data.length]);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (itemWidth + 16));
    if (index !== currentIndex) {
      setCurrentIndex(index);
      onIndexChange?.(index);
    }
  };

  return (
    <View style={style} testID={testID} {...accessibilityProps}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth + 16}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: (SCREEN_WIDTH - itemWidth) / 2,
        }}
      >
        {data.map((item, index) => (
          <View
            key={index}
            style={{
              width: itemWidth,
              marginHorizontal: 8,
            }}
          >
            {renderItem(item, index)}
          </View>
        ))}
      </ScrollView>

      {/* Pagination */}
      {showPagination && data.length > 1 && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 16,
            gap: 8,
          }}
        >
          {data.map((_, index) => (
            <View
              key={index}
              style={{
                width: index === currentIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: index === currentIndex ? colors.primary : colors.border,
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
});

Carousel.displayName = 'Carousel';

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
