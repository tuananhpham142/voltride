// src/components/input/RadioGroup.tsx

import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Text } from '../content/Text';
import { useTheme } from '@/hooks/useTheme';

export interface RadioOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
  style?: ViewStyle;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  label,
  error,
  required = false,
  style,
}) => {
  const { colors } = useTheme();

  const renderOption = (option: RadioOption) => {
    const isSelected = value === option.value;
    const isDisabled = option.disabled;

    const handlePress = () => {
      if (!isDisabled) {
        onChange(option.value);
      }
    };

    return (
      <TouchableOpacity
        key={option.value}
        onPress={handlePress}
        disabled={isDisabled}
        style={[
          styles.optionContainer,
          {
            backgroundColor: isSelected ? colors.primary + '10' : 'transparent',
            borderColor: isSelected ? colors.primary : colors.border,
            opacity: isDisabled ? 0.5 : 1,
          },
        ]}
      >
        {/* Radio Circle */}
        <View
          style={[
            styles.radioOuter,
            {
              borderColor: isSelected ? colors.primary : colors.border,
            },
          ]}
        >
          {isSelected && (
            <View
              style={[
                styles.radioInner,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            />
          )}
        </View>

        {/* Label and Description */}
        <View style={styles.textContainer}>
          <Text
            variant="body2"
            style={{
              color: isSelected ? colors.primary : colors.text,
              fontWeight: isSelected ? '600' : '400',
            }}
          >
            {option.label}
          </Text>
          {option.description && (
            <Text
              variant="caption"
              style={{
                color: colors.textSecondary,
                marginTop: 2,
              }}
            >
              {option.description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      {label && (
        <Text
          variant="subtitle2"
          style={{
            color: colors.text,
            marginBottom: 12,
          }}
        >
          {label}
          {required && <Text style={{ color: colors.error }}> *</Text>}
        </Text>
      )}

      {/* Options */}
      <View>{options.map(renderOption)}</View>

      {/* Error Message */}
      {error && (
        <Text
          variant="caption"
          style={{
            color: colors.error,
            marginTop: 8,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
  },
});

export default RadioGroup;
