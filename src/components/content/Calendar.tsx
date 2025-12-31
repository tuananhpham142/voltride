// src/components/content/Calendar.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize } from '../utils/theme';

export interface CalendarProps extends BaseComponentProps, StyleProps {
  /**
   * Selected date
   */
  selectedDate?: Date;
  
  /**
   * On date select
   */
  onSelectDate?: (date: Date) => void;
  
  /**
   * Minimum date
   */
  minDate?: Date;
  
  /**
   * Maximum date
   */
  maxDate?: Date;
  
  /**
   * Marked dates (dots)
   */
  markedDates?: Date[];
  
  /**
   * View mode
   */
  mode?: 'month' | 'week';
}

/**
 * Calendar Component
 * 
 * Monthly or weekly calendar picker.
 */
export const Calendar = memo<CalendarProps>(({
  selectedDate = new Date(),
  onSelectDate,
  minDate,
  maxDate,
  markedDates = [],
  mode = 'month',
  style,
  testID = 'calendar',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateMarked = (date: Date) => {
    return markedDates.some(
      marked =>
        marked.getDate() === date.getDate() &&
        marked.getMonth() === date.getMonth() &&
        marked.getFullYear() === date.getFullYear()
    );
  };

  const isDateSelected = (date: Date) => {
    return (
      selectedDate.getDate() === date.getDate() &&
      selectedDate.getMonth() === date.getMonth() &&
      selectedDate.getFullYear() === date.getFullYear()
    );
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <View
      style={[
        {
          backgroundColor: isDark ? colors.surface : '#FFFFFF',
          borderRadius: borderRadius.lg,
          padding: 16,
        },
        style,
      ]}
      testID={testID}
      {...accessibilityProps}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <TouchableOpacity onPress={goToPreviousMonth} style={{ padding: 8 }}>
          <Icon name="chevron-left" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: fontSize.lg,
            fontWeight: '600',
            color: colors.text,
          }}
        >
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>

        <TouchableOpacity onPress={goToNextMonth} style={{ padding: 8 }}>
          <Icon name="chevron-right" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Days of week */}
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        {daysOfWeek.map((day) => (
          <View key={day} style={{ flex: 1, alignItems: 'center' }}>
            <Text
              style={{
                fontSize: fontSize.xs,
                fontWeight: '600',
                color: colors.textSecondary,
              }}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {days.map((date, index) => {
          if (!date) {
            return <View key={`empty-${index}`} style={{ width: '14.28%', aspectRatio: 1 }} />;
          }

          const isSelected = isDateSelected(date);
          const isDisabled = isDateDisabled(date);
          const isMarked = isDateMarked(date);
          const isToday =
            date.getDate() === new Date().getDate() &&
            date.getMonth() === new Date().getMonth() &&
            date.getFullYear() === new Date().getFullYear();

          return (
            <TouchableOpacity
              key={date.toISOString()}
              style={{
                width: '14.28%',
                aspectRatio: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => !isDisabled && onSelectDate?.(date)}
              disabled={isDisabled}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: isSelected ? colors.primary : 'transparent',
                  borderWidth: isToday && !isSelected ? 1 : 0,
                  borderColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: fontSize.sm,
                    fontWeight: isSelected ? '600' : '400',
                    color: isDisabled
                      ? colors.border
                      : isSelected
                      ? '#FFFFFF'
                      : colors.text,
                  }}
                >
                  {date.getDate()}
                </Text>
                {isMarked && !isSelected && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 4,
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: colors.primary,
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

Calendar.displayName = 'Calendar';
