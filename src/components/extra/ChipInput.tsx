import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize } from '../utils/theme';

// ============================================================================
// CHIP INPUT
// ============================================================================

export interface ChipInputProps extends BaseComponentProps, StyleProps {
  /**
   * Chips
   */
  chips: string[];
  
  /**
   * On chips change
   */
  onChange: (chips: string[]) => void;
  
  /**
   * Placeholder
   */
  placeholder?: string;
  
  /**
   * Max chips
   */
  maxChips?: number;
  
  /**
   * Allow duplicates
   */
  allowDuplicates?: boolean;
}

/**
 * ChipInput Component
 * 
 * Input field that creates chips/tags.
 */
export const ChipInput = memo<ChipInputProps>(({
  chips,
  onChange,
  placeholder = 'Add item...',
  maxChips,
  allowDuplicates = false,
  style,
  testID = 'chip-input',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const [inputValue, setInputValue] = useState('');

  const addChip = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    
    if (maxChips && chips.length >= maxChips) return;
    if (!allowDuplicates && chips.includes(trimmed)) return;

    onChange([...chips, trimmed]);
    setInputValue('');
  };

  const removeChip = (index: number) => {
    onChange(chips.filter((_, i) => i !== index));
  };

  return (
    <View
      style={[
        {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: borderRadius.md,
          padding: 8,
          minHeight: 56,
        },
        style,
      ]}
      testID={testID}
      {...accessibilityProps}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {chips.map((chip, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? colors.surface : '#F5F5F5',
              borderRadius: borderRadius.full,
              paddingVertical: 6,
              paddingLeft: 12,
              paddingRight: 8,
              gap: 6,
            }}
          >
            <Text style={{ fontSize: fontSize.sm, color: colors.text }}>
              {chip}
            </Text>
            <TouchableOpacity onPress={() => removeChip(index)}>
              <Icon name="close" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        ))}

        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={addChip}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          style={{
            flex: 1,
            minWidth: 100,
            fontSize: fontSize.md,
            color: colors.text,
            paddingVertical: 6,
          }}
        />
      </View>

      {maxChips && (
        <Text
          style={{
            fontSize: fontSize.xs,
            color: colors.textSecondary,
            marginTop: 4,
          }}
        >
          {chips.length} / {maxChips}
        </Text>
      )}
    </View>
  );
});

ChipInput.displayName = 'ChipInput';

