// src/components/input/AdvancedInputs.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo, useState } from 'react';
import {
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
    useSharedValue
} from 'react-native-reanimated';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize } from '../utils/theme';

// ============================================================================
// STAR RATING
// ============================================================================

export interface StarRatingProps extends BaseComponentProps, StyleProps {
  /**
   * Rating value (0-5)
   */
  rating: number;
  
  /**
   * On rating change
   */
  onChange: (rating: number) => void;
  
  /**
   * Star size
   */
  size?: number;
  
  /**
   * Star color
   */
  color?: string;
  
  /**
   * Read only
   */
  readOnly?: boolean;
  
  /**
   * Show rating number
   */
  showValue?: boolean;
}

/**
 * StarRating Component
 * 
 * Interactive star rating input (0-5 stars).
 */
export const StarRating = memo<StarRatingProps>(({
  rating,
  onChange,
  size = 32,
  color,
  readOnly = false,
  showValue = false,
  style,
  testID = 'star-rating',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();
  const starColor = color || colors.warning;

  const handlePress = (index: number) => {
    if (!readOnly) {
      const newRating = index + 1 === rating ? 0 : index + 1;
      onChange(newRating);
    }
  };

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 4 }, style]} testID={testID} {...accessibilityProps}>
      {[...Array(5)].map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handlePress(index)}
          disabled={readOnly}
          activeOpacity={0.7}
        >
          <Icon
            name={index < rating ? 'star' : 'star-border'}
            size={size}
            color={index < rating ? starColor : colors.border}
          />
        </TouchableOpacity>
      ))}
      {showValue && (
        <Text
          style={{
            fontSize: fontSize.md,
            fontWeight: '600',
            color: colors.text,
            marginLeft: 8,
          }}
        >
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
});

StarRating.displayName = 'StarRating';

// ============================================================================
// SLIDER
// ============================================================================

export interface SliderProps extends BaseComponentProps, StyleProps {
  /**
   * Slider value (0-100)
   */
  value: number;
  
  /**
   * On value change
   */
  onChange: (value: number) => void;
  
  /**
   * Minimum value
   */
  min?: number;
  
  /**
   * Maximum value
   */
  max?: number;
  
  /**
   * Step increment
   */
  step?: number;
  
  /**
   * Show value label
   */
  showValue?: boolean;
  
  /**
   * Label text
   */
  label?: string;
  
  /**
   * Track color
   */
  trackColor?: string;
  
  /**
   * Active track color
   */
  activeTrackColor?: string;
}

/**
 * Slider Component
 * 
 * Range slider with value display.
 */
export const Slider = memo<SliderProps>(({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  label,
  trackColor,
  activeTrackColor,
  style,
  testID = 'slider',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const [sliderWidth, setSliderWidth] = useState(0);
  const translateX = useSharedValue(0);

  const defaultTrackColor = trackColor || (isDark ? '#3A3A3A' : '#E0E0E0');
  const defaultActiveColor = activeTrackColor || colors.primary;

  const percentage = ((value - min) / (max - min)) * 100;

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newValue = (event.x / sliderWidth) * (max - min) + min;
      const steppedValue = Math.round(newValue / step) * step;
      const clampedValue = Math.max(min, Math.min(max, steppedValue));
      onChange(clampedValue);
    });

  return (
    <View style={[{ paddingVertical: 8 }, style]} testID={testID} {...accessibilityProps}>
      {(label || showValue) && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          {label && (
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
              {label}
            </Text>
          )}
          {showValue && (
            <Text style={{ fontSize: fontSize.sm, fontWeight: '600', color: colors.text }}>
              {value}
            </Text>
          )}
        </View>
      )}

      <GestureDetector gesture={panGesture}>
        <View
          onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
          style={{ height: 40, justifyContent: 'center' }}
        >
          {/* Track */}
          <View
            style={{
              height: 4,
              backgroundColor: defaultTrackColor,
              borderRadius: 2,
            }}
          />

          {/* Active Track */}
          <View
            style={{
              position: 'absolute',
              height: 4,
              width: `${percentage}%`,
              backgroundColor: defaultActiveColor,
              borderRadius: 2,
            }}
          />

          {/* Thumb */}
          <View
            style={{
              position: 'absolute',
              left: `${percentage}%`,
              marginLeft: -12,
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: defaultActiveColor,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}
          />
        </View>
      </GestureDetector>
    </View>
  );
});

Slider.displayName = 'Slider';

// ============================================================================
// NUMBER INPUT
// ============================================================================

export interface NumberInputProps extends BaseComponentProps, StyleProps {
  /**
   * Current value
   */
  value: number;
  
  /**
   * On value change
   */
  onChange: (value: number) => void;
  
  /**
   * Minimum value
   */
  min?: number;
  
  /**
   * Maximum value
   */
  max?: number;
  
  /**
   * Step increment
   */
  step?: number;
  
  /**
   * Label
   */
  label?: string;
  
  /**
   * Support text
   */
  supportText?: string;
}

/**
 * NumberInput Component
 * 
 * Numeric input with +/- controls.
 */
export const NumberInput = memo<NumberInputProps>(({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  label,
  supportText,
  style,
  testID = 'number-input',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();

  const increment = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  const decrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleTextChange = (text: string) => {
    const numValue = parseInt(text) || 0;
    const clampedValue = Math.max(min, Math.min(max, numValue));
    onChange(clampedValue);
  };

  return (
    <View style={style} testID={testID} {...accessibilityProps}>
      {label && (
        <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 8 }}>
          {label}
        </Text>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: borderRadius.md,
          overflow: 'hidden',
        }}
      >
        <TouchableOpacity
          style={{
            padding: 12,
            backgroundColor: isDark ? colors.surface : '#F5F5F5',
            borderRightWidth: 1,
            borderRightColor: colors.border,
          }}
          onPress={decrement}
          disabled={value <= min}
        >
          <Icon
            name="remove"
            size={20}
            color={value <= min ? colors.border : colors.primary}
          />
        </TouchableOpacity>

        <TextInput
          value={value.toString()}
          onChangeText={handleTextChange}
          keyboardType="numeric"
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: fontSize.md,
            color: colors.text,
            paddingVertical: 12,
          }}
        />

        <TouchableOpacity
          style={{
            padding: 12,
            backgroundColor: isDark ? colors.surface : '#F5F5F5',
            borderLeftWidth: 1,
            borderLeftColor: colors.border,
          }}
          onPress={increment}
          disabled={value >= max}
        >
          <Icon
            name="add"
            size={20}
            color={value >= max ? colors.border : colors.primary}
          />
        </TouchableOpacity>
      </View>

      {supportText && (
        <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 4 }}>
          {supportText}
        </Text>
      )}
    </View>
  );
});

NumberInput.displayName = 'NumberInput';

// ============================================================================
// DROPDOWN
// ============================================================================

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps extends BaseComponentProps, StyleProps {
  /**
   * Selected value
   */
  value: string;
  
  /**
   * On value change
   */
  onChange: (value: string) => void;
  
  /**
   * Options
   */
  options: DropdownOption[];
  
  /**
   * Placeholder
   */
  placeholder?: string;
  
  /**
   * Label
   */
  label?: string;
  
  /**
   * Error message
   */
  error?: string;
}

/**
 * Dropdown Component
 * 
 * Select dropdown with modal picker.
 */
export const Dropdown = memo<DropdownProps>(({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  label,
  error,
  style,
  testID = 'dropdown',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <View style={style} testID={testID} {...accessibilityProps}>
      {label && (
        <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 8 }}>
          {label}
        </Text>
      )}

      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
          borderWidth: 1,
          borderColor: error ? colors.error : colors.border,
          borderRadius: borderRadius.md,
          backgroundColor: isDark ? colors.surface : '#FFFFFF',
        }}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={{
            fontSize: fontSize.md,
            color: selectedOption ? colors.text : colors.textSecondary,
          }}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <Icon name="keyboard-arrow-down" size={24} color={colors.textSecondary} />
      </TouchableOpacity>

      {error && (
        <Text style={{ fontSize: fontSize.xs, color: colors.error, marginTop: 4 }}>
          {error}
        </Text>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setModalVisible(false)}
            activeOpacity={1}
          />

          <View
            style={{
              backgroundColor: isDark ? colors.surface : '#FFFFFF',
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xl,
              maxHeight: '60%',
            }}
          >
            <View
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <Text style={{ fontSize: fontSize.lg, fontWeight: '600', color: colors.text }}>
                {label || 'Select'}
              </Text>
            </View>

            <ScrollView>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={{
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                  onPress={() => {
                    onChange(option.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={{ fontSize: fontSize.md, color: colors.text }}>
                    {option.label}
                  </Text>
                  {option.value === value && (
                    <Icon name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
});

Dropdown.displayName = 'Dropdown';

// ============================================================================
// SEARCH BAR
// ============================================================================

export interface SearchBarProps extends BaseComponentProps, StyleProps {
  /**
   * Search value
   */
  value: string;
  
  /**
   * On value change
   */
  onChangeText: (text: string) => void;
  
  /**
   * Placeholder
   */
  placeholder?: string;
  
  /**
   * On search submit
   */
  onSubmit?: () => void;
  
  /**
   * Show cancel button
   */
  showCancel?: boolean;
  
  /**
   * On cancel
   */
  onCancel?: () => void;
}

/**
 * SearchBar Component
 * 
 * Search input with clear button.
 */
export const SearchBar = memo<SearchBarProps>(({
  value,
  onChangeText,
  placeholder = 'Search...',
  onSubmit,
  showCancel = false,
  onCancel,
  style,
  testID = 'search-bar',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();

  const handleClear = () => {
    onChangeText('');
    onCancel?.();
  };

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 8 }, style]} testID={testID} {...accessibilityProps}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isDark ? colors.surface : '#F5F5F5',
          borderRadius: borderRadius.lg,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      >
        <Icon name="search" size={20} color={colors.textSecondary} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          onSubmitEditing={onSubmit}
          returnKeyType="search"
          style={{
            flex: 1,
            fontSize: fontSize.md,
            color: colors.text,
            marginLeft: 8,
            paddingVertical: 0,
          }}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={{ padding: 4 }}>
            <Icon name="close" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {showCancel && value.length > 0 && (
        <TouchableOpacity onPress={handleClear}>
          <Text style={{ fontSize: fontSize.md, color: colors.primary }}>
            Cancel
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

SearchBar.displayName = 'SearchBar';
