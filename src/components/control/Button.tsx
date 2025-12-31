// src/components/control/Button.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { ActivityIndicator, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { BaseComponentProps, Size, StyleProps, Variant } from '../types/common';
import { borderRadius, fontSize, fontWeight, shadows } from '../utils/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export interface ButtonProps extends BaseComponentProps, StyleProps {
  /**
   * Button text
   */
  title?: string;
  
  /**
   * Button size
   */
  size?: Size;
  
  /**
   * Button variant
   */
  variant?: Variant;
  
  /**
   * On press handler
   */
  onPress?: () => void;
  
  /**
   * Loading state
   */
  loading?: boolean;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Left icon name
   */
  leftIcon?: string;
  
  /**
   * Right icon name
   */
  rightIcon?: string;
  
  /**
   * Full width button
   */
  fullWidth?: boolean;
  
  /**
   * Custom text style
   */
  textStyle?: TextStyle;
  
  /**
   * Shadow enabled
   */
  shadow?: boolean;
  
  /**
   * Custom colors
   */
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
}

const sizeStyles = {
  xs: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: fontSize.xs,
    iconSize: 14,
    height: 28,
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: fontSize.sm,
    iconSize: 16,
    height: 36,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: fontSize.md,
    iconSize: 18,
    height: 44,
  },
  lg: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    fontSize: fontSize.lg,
    iconSize: 20,
    height: 52,
  },
  xl: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    fontSize: fontSize.xl,
    iconSize: 24,
    height: 60,
  },
};

/**
 * Button Component
 * 
 * A highly customizable button component with support for various sizes, variants, icons, and states.
 * 
 * @example
 * ```tsx
 * <Button 
 *   title="Click Me"
 *   variant="primary"
 *   size="md"
 *   leftIcon="check"
 *   onPress={() => console.log('Pressed')}
 * />
 * ```
 */
export const Button = memo<ButtonProps>(({
  title,
  size = 'md',
  variant = 'primary',
  onPress,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  textStyle: customTextStyle,
  shadow = false,
  backgroundColor: customBgColor,
  textColor: customTextColor,
  borderColor: customBorderColor,
  style,
  className,
  testID = 'button',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  const sizeStyle = sizeStyles[size];
  const isDisabled = disabled || loading;

  // Get colors based on variant
  const getColors = () => {
    if (customBgColor && customTextColor) {
      return {
        bg: customBgColor,
        text: customTextColor,
        border: customBorderColor || customBgColor,
      };
    }

    switch (variant) {
      case 'primary':
        return {
          bg: colors.primary,
          text: '#FFFFFF',
          border: colors.primary,
        };
      case 'secondary':
        return {
          bg: colors.secondary,
          text: '#FFFFFF',
          border: colors.secondary,
        };
      case 'tertiary':
        return {
          bg: isDark ? colors.surface : '#F5F5F5',
          text: colors.text,
          border: colors.border,
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: colors.primary,
          border: colors.primary,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          text: colors.primary,
          border: 'transparent',
        };
      default:
        return {
          bg: colors.primary,
          text: '#FFFFFF',
          border: colors.primary,
        };
    }
  };

  const colorScheme = getColors();

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  // Handle press in/out
  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    opacity.value = withSpring(0.8);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withSpring(1);
  };

  // Container style
  const containerStyle: ViewStyle = {
    height: sizeStyle.height,
    paddingVertical: sizeStyle.paddingVertical,
    paddingHorizontal: sizeStyle.paddingHorizontal,
    backgroundColor: colorScheme.bg,
    borderRadius: borderRadius.md,
    borderWidth: variant === 'outline' ? 2 : 0,
    borderColor: colorScheme.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: fullWidth ? '100%' : 'auto',
    opacity: isDisabled ? 0.5 : 1,
    ...(shadow && !isDisabled ? shadows.md : {}),
  };

  // Text style
  const textStyle: TextStyle = {
    fontSize: sizeStyle.fontSize,
    fontWeight: fontWeight.semibold,
    color: colorScheme.text,
    marginHorizontal: (leftIcon || rightIcon) ? 8 : 0,
  };

  return (
    <AnimatedTouchable
      style={[containerStyle, animatedStyle, style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      activeOpacity={1}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...accessibilityProps}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colorScheme.text} />
      ) : (
        <>
          {leftIcon && (
            <Icon
              name={leftIcon as any}
              size={sizeStyle.iconSize}
              color={colorScheme.text}
            />
          )}
          {title && (
            <Text style={[textStyle, customTextStyle]}>
              {title}
            </Text>
          )}
          {rightIcon && (
            <Icon
              name={rightIcon as any}
              size={sizeStyle.iconSize}
              color={colorScheme.text}
            />
          )}
        </>
      )}
    </AnimatedTouchable>
  );
});

Button.displayName = 'Button';
