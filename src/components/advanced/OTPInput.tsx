// src/components/advanced/OTPInput.tsx
import { useTheme } from '@/hooks/useTheme';
import React, { memo, useRef } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius } from '../utils/theme';
// ============================================================================
// OTP INPUT
// ============================================================================

export interface OTPInputProps extends BaseComponentProps, StyleProps {
  /**
   * Number of digits
   */
  length?: number;
  
  /**
   * Current value
   */
  value: string;
  
  /**
   * On value change
   */
  onChange: (value: string) => void;
  
  /**
   * Secure entry (show dots)
   */
  secure?: boolean;
  
  /**
   * Auto focus
   */
  autoFocus?: boolean;
  
  /**
   * Error state
   */
  error?: boolean;
}

/**
 * OTPInput Component
 * 
 * OTP/PIN code input with individual boxes.
 */
export const OTPInput = memo<OTPInputProps>(({
  length = 6,
  value,
  onChange,
  secure = false,
  autoFocus = true,
  error = false,
  style,
  testID = 'otp-input',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();
  const inputRef = useRef<TextInput>(null);

  const digits = value.split('');
  const displayDigits = Array(length).fill('').map((_, i) => digits[i] || '');

  return (
    <View style={style} testID={testID} {...accessibilityProps}>
      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
        {displayDigits.map((digit, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => inputRef.current?.focus()}
            style={{
              width: 48,
              height: 56,
              borderWidth: 2,
              borderColor: error
                ? colors.error
                : digit
                ? colors.primary
                : colors.border,
              borderRadius: borderRadius.md,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.background,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: colors.text,
              }}
            >
              {secure && digit ? '•' : digit}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Hidden input for keyboard */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => {
          const newValue = text.replace(/[^0-9]/g, '').slice(0, length);
          onChange(newValue);
        }}
        keyboardType="number-pad"
        autoFocus={autoFocus}
        maxLength={length}
        style={{
          position: 'absolute',
          opacity: 0,
          width: 1,
          height: 1,
        }}
        caretHidden
      />
    </View>
  );
});

OTPInput.displayName = 'OTPInput';
