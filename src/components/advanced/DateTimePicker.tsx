// src/components/advanced/DateTimePicker.tsx
import { useTheme } from '@/hooks/useTheme';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { memo, useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize } from '../utils/theme';


// ============================================================================
// DATE TIME PICKER
// ============================================================================

export interface DateTimePickerProps extends BaseComponentProps, StyleProps {
  /**
   * Currently selected date
   */
  value: Date;
  
  /**
   * On date/time change
   */
  onChange: (date: Date) => void;
  
  /**
   * Picker mode
   */
  mode?: 'date' | 'time' | 'datetime';
  
  /**
   * Visibility control
   */
  visible: boolean;
  
  /**
   * On dismiss/close
   */
  onDismiss: () => void;
  
  /**
   * Minimum date
   */
  minimumDate?: Date;
  
  /**
   * Maximum date
   */
  maximumDate?: Date;
  
  /**
   * Modal title (iOS only)
   */
  title?: string;
  
  /**
   * Confirm button text (iOS only)
   */
  confirmText?: string;
  
  /**
   * Cancel button text (iOS only)
   */
  cancelText?: string;
  
  /**
   * Display style (iOS only)
   */
  display?: 'default' | 'spinner' | 'compact' | 'inline';
  
  /**
   * Minute interval
   */
  minuteInterval?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30;
  
  /**
   * 24-hour format
   */
  is24Hour?: boolean;
}

/**
 * DateTimePicker Component
 * 
 * Cross-platform date and time picker with native UI.
 * iOS shows modal with confirmation, Android shows native picker.
 * 
 * @example
 * ```tsx
 * const [date, setDate] = useState(new Date());
 * const [showPicker, setShowPicker] = useState(false);
 * 
 * <Button title="Pick Date" onPress={() => setShowPicker(true)} />
 * 
 * <DateTimePicker
 *   value={date}
 *   onChange={setDate}
 *   visible={showPicker}
 *   onDismiss={() => setShowPicker(false)}
 *   mode="date"
 *   title="Select Date"
 * />
 * ```
 */
export const DateTimePicker = memo<DateTimePickerProps>(({
  value,
  onChange,
  mode = 'date',
  visible,
  onDismiss,
  minimumDate,
  maximumDate,
  title,
  confirmText = 'Save',
  cancelText = 'Cancel',
  display = 'spinner',
  minuteInterval = 1,
  is24Hour = true,
  testID = 'date-time-picker',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const [tempValue, setTempValue] = useState(value);

  // Update temp value when value prop changes
  React.useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleConfirm = () => {
    onChange(tempValue);
    onDismiss();
  };

  const handleCancel = () => {
    setTempValue(value); // Reset to original value
    onDismiss();
  };

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      onDismiss();
      if (event.type === 'set' && selectedDate) {
        onChange(selectedDate);
      }
    } else {
      if (selectedDate) {
        setTempValue(selectedDate);
      }
    }
  };

  // Get display title based on mode
  const getTitle = () => {
    if (title) return title;
    
    switch (mode) {
      case 'date':
        return 'Select Date';
      case 'time':
        return 'Select Time';
      case 'datetime':
        return 'Select Date & Time';
      default:
        return 'Select';
    }
  };

  // iOS: Modal with confirmation
  if (Platform.OS === 'ios') {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
        testID={testID}
        {...accessibilityProps}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? colors.surface : '#FFFFFF' },
            ]}
          >
            {/* Header */}
            <View
              style={[
                styles.modalHeader,
                {
                  backgroundColor: isDark ? colors.surface : '#FFFFFF',
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <TouchableOpacity
                onPress={handleCancel}
                style={styles.headerButton}
                accessibilityLabel={cancelText}
                accessibilityRole="button"
              >
                <Text style={[styles.cancelText, { color: colors.primary }]}>
                  {cancelText}
                </Text>
              </TouchableOpacity>

              <Text
                style={[styles.modalTitle, { color: colors.text }]}
                numberOfLines={1}
              >
                {getTitle()}
              </Text>

              <TouchableOpacity
                onPress={handleConfirm}
                style={styles.headerButton}
                accessibilityLabel={confirmText}
                accessibilityRole="button"
              >
                <Text style={[styles.confirmText, { color: colors.primary }]}>
                  {confirmText}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Picker */}
            <View style={styles.pickerContainer}>
              <RNDateTimePicker
                value={tempValue}
                mode={mode}
                display={display}
                onChange={handleChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                minuteInterval={minuteInterval}
                is24Hour={is24Hour}
                textColor={colors.text}
                themeVariant={isDark ? 'dark' : 'light'}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // Android: Native picker
  if (!visible) return null;

  return (
    <RNDateTimePicker
      value={value}
      mode={mode}
      display="default"
      onChange={handleChange}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
      minuteInterval={minuteInterval}
      is24Hour={is24Hour}
      testID={testID}
      {...accessibilityProps}
    />
  );
});

DateTimePicker.displayName = 'DateTimePicker';

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerButton: {
    minWidth: 60,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  cancelText: {
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  confirmText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    textAlign: 'right',
  },
  pickerContainer: {
    paddingVertical: 16,
  },
});

export default DateTimePicker;