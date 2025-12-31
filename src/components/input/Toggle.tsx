// src/components/input/Toggle.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { BaseComponentProps, Size, StyleProps } from '../types/common';

export interface ToggleProps extends BaseComponentProps, StyleProps {
  /**
   * Toggle value
   */
  value: boolean;
  
  /**
   * On value change
   */
  onValueChange: (value: boolean) => void;
  
  /**
   * Size of toggle
   */
  size?: Size;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Active color
   */
  activeColor?: string;
  
  /**
   * Inactive color
   */
  inactiveColor?: string;
  
  /**
   * Show icons
   */
  showIcons?: boolean;
}

const sizeMap = {
  xs: { width: 36, height: 20, thumb: 16 },
  sm: { width: 44, height: 24, thumb: 20 },
  md: { width: 51, height: 31, thumb: 27 },
  lg: { width: 60, height: 36, thumb: 32 },
  xl: { width: 70, height: 40, thumb: 36 },
};

/**
 * Toggle Component
 * 
 * An animated toggle switch with customizable appearance.
 * 
 * @example
 * ```tsx
 * <Toggle
 *   value={isEnabled}
 *   onValueChange={setIsEnabled}
 *   size="md"
 *   showIcons
 * />
 * ```
 */
export const Toggle = memo<ToggleProps>(({
  value,
  onValueChange,
  size = 'md',
  disabled = false,
  activeColor,
  inactiveColor,
  showIcons = false,
  style,
  testID = 'toggle',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const translateX = useSharedValue(value ? 1 : 0);
  const scale = useSharedValue(1);

  const dimensions = sizeMap[size];
  const defaultActiveColor = activeColor || colors.primary;
  const defaultInactiveColor = inactiveColor || (isDark ? '#39393D' : '#E0E0E0');

  React.useEffect(() => {
    translateX.value = withSpring(value ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [value]);

  // Animated styles
  const trackAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      translateX.value,
      [0, 1],
      [defaultInactiveColor, defaultActiveColor]
    );

    return {
      backgroundColor,
      transform: [{ scale: scale.value }],
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const thumbOffset = dimensions.width - dimensions.thumb - 4;
    
    return {
      transform: [
        {
          translateX: translateX.value * thumbOffset,
        },
      ],
    };
  });

  const handlePress = () => {
    if (!disabled) {
      scale.value = withSpring(0.95, {}, () => {
        scale.value = withSpring(1);
      });
      onValueChange(!value);
    }
  };

  const trackStyle: ViewStyle = {
    width: dimensions.width,
    height: dimensions.height,
    borderRadius: dimensions.height / 2,
    padding: 2,
    justifyContent: 'center',
    opacity: disabled ? 0.5 : 1,
  };

  const thumbStyle: ViewStyle = {
    width: dimensions.thumb,
    height: dimensions.thumb,
    borderRadius: dimensions.thumb / 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={1}
      testID={testID}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      {...accessibilityProps}
    >
      <Animated.View style={[trackStyle, trackAnimatedStyle, style]}>
        <Animated.View style={[thumbStyle, thumbAnimatedStyle]}>
          {showIcons && (
            <Icon
              name={value ? 'check' : 'close'}
              size={dimensions.thumb * 0.6}
              color={value ? defaultActiveColor : '#999'}
            />
          )}
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
});

Toggle.displayName = 'Toggle';
