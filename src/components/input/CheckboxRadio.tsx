// src/components/input/Checkbox.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { BaseComponentProps, Size, StyleProps } from '../types/common';
import { borderRadius } from '../utils/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export interface CheckboxProps extends BaseComponentProps, StyleProps {
  /**
   * Checked state
   */
  checked: boolean;
  
  /**
   * On change handler
   */
  onChange: (checked: boolean) => void;
  
  /**
   * Size of checkbox
   */
  size?: Size | number;
  
  /**
   * Label text
   */
  label?: string;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Custom checked color
   */
  checkedColor?: string;
  
  /**
   * Custom unchecked color
   */
  uncheckedColor?: string;
  
  /**
   * Label position
   */
  labelPosition?: 'left' | 'right';
  
  /**
   * Custom label style
   */
  labelStyle?: TextStyle;
}

const sizeMap = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
};

/**
 * Checkbox Component
 * 
 * A customizable checkbox input with animations and theming support.
 * 
 * @example
 * ```tsx
 * <Checkbox 
 *   checked={isChecked}
 *   onChange={setIsChecked}
 *   label="Accept terms"
 *   size="md"
 * />
 * ```
 */
export const Checkbox = memo<CheckboxProps>(({
  checked,
  onChange,
  size = 'md',
  label,
  disabled = false,
  checkedColor,
  uncheckedColor,
  labelPosition = 'right',
  labelStyle,
  style,
  testID = 'checkbox',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(checked ? 1 : 0);
  const checkboxScale = useSharedValue(1);
  
  const checkboxSize = typeof size === 'number' ? size : sizeMap[size];
  const iconSize = checkboxSize * 0.7;

  const defaultCheckedColor = checkedColor || colors.primary;
  const defaultUncheckedColor = uncheckedColor || (isDark ? colors.border : '#E0E0E0');

  React.useEffect(() => {
    scale.value = withSpring(checked ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [checked]);

  // Animated styles
  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  const boxAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkboxScale.value }],
  }));

  const handlePress = () => {
    if (!disabled) {
      checkboxScale.value = withSpring(0.9, {}, () => {
        checkboxScale.value = withSpring(1);
      });
      onChange(!checked);
    }
  };

  const containerStyle: ViewStyle = {
    flexDirection: labelPosition === 'left' ? 'row-reverse' : 'row',
    alignItems: 'center',
    opacity: disabled ? 0.5 : 1,
  };

  const boxStyle: ViewStyle = {
    width: checkboxSize,
    height: checkboxSize,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: checked ? defaultCheckedColor : defaultUncheckedColor,
    backgroundColor: checked ? defaultCheckedColor : 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const textStyle: TextStyle = {
    fontSize: 16,
    color: colors.text,
    marginLeft: labelPosition === 'right' ? 12 : 0,
    marginRight: labelPosition === 'left' ? 12 : 0,
  };

  return (
    <TouchableOpacity
      style={[containerStyle, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      {...accessibilityProps}
    >
      <Animated.View style={[boxStyle, boxAnimatedStyle]}>
        <Animated.View style={checkAnimatedStyle}>
          <Icon
            name="check"
            size={iconSize}
            color="#FFFFFF"
          />
        </Animated.View>
      </Animated.View>
      {label && (
        <Text style={[textStyle, labelStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
});

Checkbox.displayName = 'Checkbox';

// ============================================================================
// RADIO BUTTON
// ============================================================================

export interface RadioButtonProps extends BaseComponentProps, StyleProps {
  /**
   * Selected state
   */
  selected: boolean;
  
  /**
   * On select handler
   */
  onSelect: () => void;
  
  /**
   * Size of radio button
   */
  size?: Size | number;
  
  /**
   * Label text
   */
  label?: string;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Custom selected color
   */
  selectedColor?: string;
  
  /**
   * Custom unselected color
   */
  unselectedColor?: string;
  
  /**
   * Label position
   */
  labelPosition?: 'left' | 'right';
  
  /**
   * Custom label style
   */
  labelStyle?: TextStyle;
}

/**
 * RadioButton Component
 * 
 * A customizable radio button input with animations.
 */
export const RadioButton = memo<RadioButtonProps>(({
  selected,
  onSelect,
  size = 'md',
  label,
  disabled = false,
  selectedColor,
  unselectedColor,
  labelPosition = 'right',
  labelStyle,
  style,
  testID = 'radio-button',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(selected ? 1 : 0);
  const buttonScale = useSharedValue(1);
  
  const buttonSize = typeof size === 'number' ? size : sizeMap[size];
  const dotSize = buttonSize * 0.5;

  const defaultSelectedColor = selectedColor || colors.primary;
  const defaultUnselectedColor = unselectedColor || (isDark ? colors.border : '#E0E0E0');

  React.useEffect(() => {
    scale.value = withSpring(selected ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [selected]);

  // Animated styles
  const dotAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const boxAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePress = () => {
    if (!disabled) {
      buttonScale.value = withSpring(0.9, {}, () => {
        buttonScale.value = withSpring(1);
      });
      onSelect();
    }
  };

  const containerStyle: ViewStyle = {
    flexDirection: labelPosition === 'left' ? 'row-reverse' : 'row',
    alignItems: 'center',
    opacity: disabled ? 0.5 : 1,
  };

  const circleStyle: ViewStyle = {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    borderWidth: 2,
    borderColor: selected ? defaultSelectedColor : defaultUnselectedColor,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const dotStyle: ViewStyle = {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    backgroundColor: defaultSelectedColor,
  };

  const textStyle: TextStyle = {
    fontSize: 16,
    color: colors.text,
    marginLeft: labelPosition === 'right' ? 12 : 0,
    marginRight: labelPosition === 'left' ? 12 : 0,
  };

  return (
    <TouchableOpacity
      style={[containerStyle, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      testID={testID}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      {...accessibilityProps}
    >
      <Animated.View style={[circleStyle, boxAnimatedStyle]}>
        <Animated.View style={[dotStyle, dotAnimatedStyle]} />
      </Animated.View>
      {label && (
        <Text style={[textStyle, labelStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
});

RadioButton.displayName = 'RadioButton';
