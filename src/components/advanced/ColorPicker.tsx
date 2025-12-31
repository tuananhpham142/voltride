// src/components/advanced/ColorPicker.tsx
import { useTheme } from '@/hooks/useTheme';
import React, { memo } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize } from '../utils/theme';

// ============================================================================
// COLOR PICKER
// ============================================================================

export interface ColorPickerProps extends BaseComponentProps, StyleProps {
  /**
   * Selected color
   */
  color: string;
  
  /**
   * On color change
   */
  onChange: (color: string) => void;
  
  /**
   * Predefined colors
   */
  colors?: string[];
  
  /**
   * Show custom input
   */
  showInput?: boolean;
}

/**
 * ColorPicker Component
 * 
 * Simple color selection from predefined palette.
 */
export const ColorPicker = memo<ColorPickerProps>(({
  color,
  onChange,
  colors: colorPalette = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52B788', '#EF476F', '#118AB2',
  ],
  showInput = false,
  style,
  testID = 'color-picker',
  ...accessibilityProps
}) => {
  const { colors: themeColors } = useTheme();

  return (
    <View style={style} testID={testID} {...accessibilityProps}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {colorPalette.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => onChange(c)}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: c,
              borderWidth: color === c ? 3 : 0,
              borderColor: themeColors.primary,
            }}
          />
        ))}
      </View>

      {showInput && (
        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: fontSize.sm, color: themeColors.textSecondary, marginBottom: 8 }}>
            Custom Color (Hex)
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: themeColors.border,
              borderRadius: borderRadius.md,
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ fontSize: fontSize.md, color: themeColors.textSecondary }}>
              #
            </Text>
            <TextInput
              value={color.replace('#', '')}
              onChangeText={(text) => onChange(`#${text}`)}
              maxLength={6}
              keyboardType="default"
              style={{
                flex: 1,
                padding: 12,
                fontSize: fontSize.md,
                color: themeColors.text,
                backgroundColor: 'transparent',
              }}
              placeholderTextColor={themeColors.textSecondary}
            />
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: color,
                borderWidth: 1,
                borderColor: themeColors.border,
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
});

ColorPicker.displayName = 'ColorPicker';
