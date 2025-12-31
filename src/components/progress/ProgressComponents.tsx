// src/components/progress/ProgressComponents.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo, useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { BaseComponentProps, StyleProps } from '../types/common';
import { fontSize } from '../utils/theme';

// ============================================================================
// STEPPER
// ============================================================================

export interface Step {
  label: string;
  completed?: boolean;
}

export interface StepperProps extends BaseComponentProps, StyleProps {
  /**
   * Current step index
   */
  currentStep: number;
  
  /**
   * Steps
   */
  steps: Step[];
  
  /**
   * Orientation
   */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Stepper Component
 * 
 * Multi-step progress indicator.
 */
export const Stepper = memo<StepperProps>(({
  currentStep,
  steps,
  orientation = 'horizontal',
  style,
  testID = 'stepper',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const isHorizontal = orientation === 'horizontal';

  const getStepStatus = (index: number) => {
    if (steps[index].completed || index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'upcoming';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'active':
        return colors.primary;
      case 'upcoming':
        return colors.border;
      default:
        return colors.border;
    }
  };

  return (
    <View
      style={[
        {
          flexDirection: isHorizontal ? 'row' : 'column',
          alignItems: isHorizontal ? 'flex-start' : 'stretch',
        },
        style,
      ]}
      testID={testID}
      {...accessibilityProps}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const stepColor = getStepColor(status);
        const isLast = index === steps.length - 1;

        return (
          <View
            key={index}
            style={{
              flex: isHorizontal ? 1 : undefined,
              flexDirection: isHorizontal ? 'column' : 'row',
              alignItems: isHorizontal ? 'center' : 'flex-start',
            }}
          >
            {/* Step indicator */}
            <View style={{ alignItems: 'center', flexDirection: isHorizontal ? 'column' : 'row' }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: status === 'completed' || status === 'active' ? stepColor : 'transparent',
                  borderWidth: 2,
                  borderColor: stepColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {status === 'completed' ? (
                  <Icon name="check" size={18} color="#FFFFFF" />
                ) : (
                  <Text
                    style={{
                      fontSize: fontSize.sm,
                      fontWeight: '600',
                      color: status === 'active' ? '#FFFFFF' : stepColor,
                    }}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>

              {/* Connector line */}
              {!isLast && (
                <View
                  style={
                    isHorizontal
                      ? {
                          width: '100%',
                          height: 2,
                          backgroundColor: index < currentStep ? colors.success : colors.border,
                          marginTop: 8,
                        }
                      : {
                          width: 2,
                          height: 40,
                          backgroundColor: index < currentStep ? colors.success : colors.border,
                          marginLeft: 15,
                          marginVertical: 4,
                        }
                  }
                />
              )}
            </View>

            {/* Step label */}
            <Text
              style={{
                fontSize: fontSize.sm,
                fontWeight: status === 'active' ? '600' : '400',
                color: status === 'upcoming' ? colors.textSecondary : colors.text,
                textAlign: isHorizontal ? 'center' : 'left',
                marginTop: isHorizontal ? 8 : 0,
                marginLeft: isHorizontal ? 0 : 12,
              }}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
});

Stepper.displayName = 'Stepper';

// ============================================================================
// PROGRESS BAR
// ============================================================================

export interface ProgressBarProps extends BaseComponentProps, StyleProps {
  /**
   * Progress value (0-100)
   */
  progress: number;
  
  /**
   * Show percentage label
   */
  showLabel?: boolean;
  
  /**
   * Bar height
   */
  height?: number;
  
  /**
   * Bar color
   */
  color?: string;
  
  /**
   * Background color
   */
  backgroundColor?: string;
  
  /**
   * Animated
   */
  animated?: boolean;
  
  /**
   * Striped pattern
   */
  striped?: boolean;
}

/**
 * ProgressBar Component
 * 
 * Linear progress indicator.
 */
export const ProgressBar = memo<ProgressBarProps>(({
  progress,
  showLabel = false,
  height = 8,
  color,
  backgroundColor,
  animated = true,
  striped = false,
  style,
  testID = 'progress-bar',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const progressAnim = useSharedValue(0);

  const barColor = color || colors.primary;
  const bgColor = backgroundColor || (isDark ? '#3A3A3A' : '#E0E0E0');

  const clampedProgress = Math.max(0, Math.min(100, progress));

  useEffect(() => {
    if (animated) {
      progressAnim.value = withTiming(clampedProgress, { duration: 500, easing: Easing.bezier(0.4, 0, 0.2, 1) });
    } else {
      progressAnim.value = clampedProgress;
    }
  }, [clampedProgress, animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value}%`,
  }));

  return (
    <View style={style} testID={testID} {...accessibilityProps}>
      {showLabel && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>Progress</Text>
          <Text style={{ fontSize: fontSize.sm, fontWeight: '600', color: colors.text }}>
            {Math.round(clampedProgress)}%
          </Text>
        </View>
      )}

      <View
        style={{
          height,
          backgroundColor: bgColor,
          borderRadius: height / 2,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={[
            {
              height: '100%',
              backgroundColor: barColor,
              borderRadius: height / 2,
            },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
});

ProgressBar.displayName = 'ProgressBar';

// ============================================================================
// LOADER
// ============================================================================

export interface LoaderProps extends BaseComponentProps, StyleProps {
  /**
   * Loader size
   */
  size?: 'small' | 'large' | number;
  
  /**
   * Loader color
   */
  color?: string;
  
  /**
   * Loading text
   */
  text?: string;
  
  /**
   * Variant
   */
  variant?: 'spinner' | 'dots' | 'pulse';
}

/**
 * Loader Component
 * 
 * Loading indicator with multiple variants.
 */
export const Loader = memo<LoaderProps>(({
  size = 'large',
  color,
  text,
  variant = 'spinner',
  style,
  testID = 'loader',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();
  const loaderColor = color || colors.primary;

  const dot1Opacity = useSharedValue(0.3);
  const dot2Opacity = useSharedValue(0.3);
  const dot3Opacity = useSharedValue(0.3);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (variant === 'dots') {
      dot1Opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 })
        ),
        -1,
        false
      );
      dot2Opacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 133 }),
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 })
        ),
        -1,
        false
      );
      dot3Opacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 266 }),
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 })
        ),
        -1,
        false
      );
    } else if (variant === 'pulse') {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        false
      );
    }
  }, [variant]);

  const dot1Style = useAnimatedStyle(() => ({ opacity: dot1Opacity.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: dot2Opacity.value }));
  const dot3Style = useAnimatedStyle(() => ({ opacity: dot3Opacity.value }));
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulseScale.value }] }));

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[dot1Style, dot2Style, dot3Style].map((animStyle, index) => (
              <Animated.View
                key={index}
                style={[
                  {
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: loaderColor,
                  },
                  animStyle,
                ]}
              />
            ))}
          </View>
        );

      case 'pulse':
        return (
          <Animated.View
            style={[
              {
                width: typeof size === 'number' ? size : size === 'large' ? 48 : 32,
                height: typeof size === 'number' ? size : size === 'large' ? 48 : 32,
                borderRadius: typeof size === 'number' ? size / 2 : size === 'large' ? 24 : 16,
                backgroundColor: loaderColor,
              },
              pulseStyle,
            ]}
          />
        );

      case 'spinner':
      default:
        return <ActivityIndicator size={size} color={loaderColor} />;
    }
  };

  return (
    <View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
      testID={testID}
      {...accessibilityProps}
    >
      {renderLoader()}
      {text && (
        <Text
          style={{
            marginTop: 12,
            fontSize: fontSize.sm,
            color: colors.textSecondary,
            textAlign: 'center',
          }}
        >
          {text}
        </Text>
      )}
    </View>
  );
});

Loader.displayName = 'Loader';

// ============================================================================
// PAGINATION DOTS
// ============================================================================

export interface PaginationDotsProps extends BaseComponentProps, StyleProps {
  /**
   * Total number of pages
   */
  total: number;
  
  /**
   * Current page index
   */
  current: number;
  
  /**
   * Dot size
   */
  size?: number;
  
  /**
   * Active color
   */
  activeColor?: string;
  
  /**
   * Inactive color
   */
  inactiveColor?: string;
  
  /**
   * Spacing between dots
   */
  spacing?: number;
}

/**
 * PaginationDots Component
 * 
 * Page indicator dots.
 */
export const PaginationDots = memo<PaginationDotsProps>(({
  total,
  current,
  size = 8,
  activeColor,
  inactiveColor,
  spacing = 8,
  style,
  testID = 'pagination-dots',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();

  const activeClr = activeColor || colors.primary;
  const inactiveClr = inactiveColor || (isDark ? '#3A3A3A' : '#E0E0E0');

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing,
        },
        style,
      ]}
      testID={testID}
      {...accessibilityProps}
    >
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === current;
        return (
          <Animated.View
            key={index}
            style={{
              width: isActive ? size * 2 : size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: isActive ? activeClr : inactiveClr,
            }}
          />
        );
      })}
    </View>
  );
});

PaginationDots.displayName = 'PaginationDots';
