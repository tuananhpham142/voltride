
// src/components/input/TextField.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo, useState } from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize } from '../utils/theme';

export interface TextFieldProps extends BaseComponentProps, StyleProps, Omit<RNTextInputProps, 'style'> {
  /**
   * Input value
   */
  value: string;
  
  /**
   * On change handler
   */
  onChangeText: (text: string) => void;
  
  /**
   * Label text
   */
  label?: string;
  
  /**
   * Placeholder text
   */
  placeholder?: string;
  
  /**
   * Error message
   */
  error?: string;
  
  /**
   * Helper text
   */
  helperText?: string;
  
  /**
   * Left icon
   */
  leftIcon?: string;
  
  /**
   * Right icon
   */
  rightIcon?: string;
  
  /**
   * Right icon press handler
   */
  onRightIconPress?: () => void;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Required field
   */
  required?: boolean;
  
  /**
   * Password field
   */
  secureTextEntry?: boolean;
  
  /**
   * Multiline (converts to TextArea)
   */
  multiline?: boolean;
  
  /**
   * Custom input style
   */
  inputStyle?: TextStyle;
  
  /**
   * Show character count
   */
  showCharCount?: boolean;
  
  /**
   * Max length
   */
  maxLength?: number;
}

/**
 * TextField Component
 * 
 * A customizable text input with label, icons, error states, and animations.
 * 
 * @example
 * ```tsx
 * <TextField
 *   label="Email"
 *   value={email}
 *   onChangeText={setEmail}
 *   placeholder="Enter your email"
 *   leftIcon="email"
 *   error={emailError}
 * />
 * ```
 */
export const TextField = memo<TextFieldProps>(({
  value,
  onChangeText,
  label,
  placeholder,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  disabled = false,
  required = false,
  secureTextEntry = false,
  multiline = false,
  inputStyle,
  showCharCount = false,
  maxLength,
  style,
  testID = 'text-field',
  ...props
}) => {
  const { colors, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const borderColor = useSharedValue(error ? colors.error : colors.border);
  const labelTop = useSharedValue(value || isFocused ? -8 : 16);
  const labelSize = useSharedValue(value || isFocused ? fontSize.xs : fontSize.md);

  // Animated border
  React.useEffect(() => {
    if (error) {
      borderColor.value = withTiming(colors.error, { duration: 200 });
    } else if (isFocused) {
      borderColor.value = withTiming(colors.primary, { duration: 200 });
    } else {
      borderColor.value = withTiming(colors.border, { duration: 200 });
    }
  }, [error, isFocused, colors]);

  // Animated label
  React.useEffect(() => {
    if (value || isFocused) {
      labelTop.value = withTiming(-8, { duration: 200 });
      labelSize.value = withTiming(fontSize.xs, { duration: 200 });
    } else {
      labelTop.value = withTiming(16, { duration: 200 });
      labelSize.value = withTiming(fontSize.md, { duration: 200 });
    }
  }, [value, isFocused]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
  }));

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    top: labelTop.value,
    fontSize: labelSize.value,
  }));

  const containerStyle: ViewStyle = {
    borderWidth: 2,
    borderRadius: borderRadius.md,
    backgroundColor: disabled ? (isDark ? '#1A1A1A' : '#F5F5F5') : (isDark ? colors.surface : '#FFFFFF'),
    paddingHorizontal: 16,
    paddingVertical: multiline ? 12 : 16,
    minHeight: multiline ? 100 : 56,
    opacity: disabled ? 0.6 : 1,
  };

  const inputContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    paddingTop: label ? 8 : 0,
  };

  const textInputStyle: TextStyle = {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
    paddingVertical: 0,
    height: multiline ? 80 : 24,
    textAlignVertical: multiline ? 'top' : 'center',
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[{ marginBottom: 16 }, style]} testID={testID}>
      <Animated.View style={[containerStyle, containerAnimatedStyle]}>
        {/* Floating Label */}
        {label && (
          <Animated.Text
            style={[
              {
                position: 'absolute',
                left: 16,
                backgroundColor: isDark ? colors.surface : '#FFFFFF',
                paddingHorizontal: 4,
                color: error ? colors.error : isFocused ? colors.primary : colors.textSecondary,
                fontWeight: '500',
              },
              labelAnimatedStyle,
            ]}
          >
            {label}{required && ' *'}
          </Animated.Text>
        )}

        <View style={inputContainerStyle}>
          {/* Left Icon */}
          {leftIcon && (
            <Icon
              name={leftIcon as any}
              size={20}
              color={error ? colors.error : isFocused ? colors.primary : colors.textSecondary}
              style={{ marginRight: 12 }}
            />
          )}

          {/* Input */}
          <RNTextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            editable={!disabled}
            secureTextEntry={secureTextEntry && !showPassword}
            multiline={multiline}
            maxLength={maxLength}
            style={[textInputStyle, inputStyle]}
            {...props}
          />

          {/* Password Toggle */}
          {secureTextEntry && (
            <TouchableOpacity onPress={handlePasswordToggle} style={{ marginLeft: 12 }}>
              <Icon
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}

          {/* Right Icon */}
          {rightIcon && !secureTextEntry && (
            <TouchableOpacity onPress={onRightIconPress} style={{ marginLeft: 12 }}>
              <Icon
                name={rightIcon as any}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Helper/Error Text */}
      {(helperText || error) && (
        <Text
          style={{
            fontSize: fontSize.xs,
            color: error ? colors.error : colors.textSecondary,
            marginTop: 4,
            marginLeft: 4,
          }}
        >
          {error || helperText}
        </Text>
      )}

      {/* Character Count */}
      {showCharCount && maxLength && (
        <Text
          style={{
            fontSize: fontSize.xs,
            color: colors.textSecondary,
            marginTop: 4,
            marginRight: 4,
            textAlign: 'right',
          }}
        >
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
});

TextField.displayName = 'TextField';
