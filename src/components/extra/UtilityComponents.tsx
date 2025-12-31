// src/components/extra/UtilityComponents.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Button } from '../control/Button';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize } from '../utils/theme';

// ============================================================================
// EMPTY STATE
// ============================================================================

export interface EmptyStateProps extends BaseComponentProps, StyleProps {
  /**
   * Title
   */
  title: string;
  
  /**
   * Description
   */
  description?: string;
  
  /**
   * Icon
   */
  icon?: string;
  
  /**
   * Image source
   */
  image?: any;
  
  /**
   * Primary action
   */
  primaryAction?: {
    title: string;
    onPress: () => void;
  };
  
  /**
   * Secondary action
   */
  secondaryAction?: {
    title: string;
    onPress: () => void;
  };
}

/**
 * EmptyState Component
 * 
 * Placeholder for empty lists/screens.
 */
export const EmptyState = memo<EmptyStateProps>(({
  title,
  description,
  icon,
  image,
  primaryAction,
  secondaryAction,
  style,
  testID = 'empty-state',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 40,
        },
        style,
      ]}
      testID={testID}
      {...accessibilityProps}
    >
      {/* Image or Icon */}
      {image ? (
        <Image
          source={image}
          style={{ width: 200, height: 200, marginBottom: 24 }}
          resizeMode="contain"
        />
      ) : icon ? (
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: `${colors.primary}20`,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <Icon name={icon as any} size={60} color={colors.primary} />
        </View>
      ) : null}

      {/* Title */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: '700',
          color: colors.text,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      {/* Description */}
      {description && (
        <Text
          style={{
            fontSize: fontSize.md,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 22,
            marginBottom: 24,
          }}
        >
          {description}
        </Text>
      )}

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <View style={{ gap: 12, width: '100%', maxWidth: 300 }}>
          {primaryAction && (
            <Button
              title={primaryAction.title}
              variant="primary"
              size="md"
              onPress={primaryAction.onPress}
              fullWidth
            />
          )}
          {secondaryAction && (
            <Button
              title={secondaryAction.title}
              variant="outline"
              size="md"
              onPress={secondaryAction.onPress}
              fullWidth
            />
          )}
        </View>
      )}
    </View>
  );
});

EmptyState.displayName = 'EmptyState';

// ============================================================================
// RATING & REVIEW
// ============================================================================

export interface RatingReviewProps extends BaseComponentProps, StyleProps {
  /**
   * Rating value
   */
  rating: number;
  
  /**
   * Total reviews
   */
  totalReviews?: number;
  
  /**
   * Show breakdown
   */
  showBreakdown?: boolean;
  
  /**
   * Rating breakdown (5-star to 1-star counts)
   */
  breakdown?: [number, number, number, number, number];
  
  /**
   * On rating select
   */
  onRatingSelect?: (rating: number) => void;
}

/**
 * RatingReview Component
 * 
 * Display ratings with optional breakdown.
 */
export const RatingReview = memo<RatingReviewProps>(({
  rating,
  totalReviews = 0,
  showBreakdown = false,
  breakdown = [0, 0, 0, 0, 0],
  onRatingSelect,
  style,
  testID = 'rating-review',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();

  const renderStars = (count: number, size: number = 16) => {
    return (
      <View style={{ flexDirection: 'row', gap: 2 }}>
        {[...Array(5)].map((_, index) => (
          <Icon
            key={index}
            name={index < Math.floor(count) ? 'star' : index < count ? 'star-half' : 'star-border'}
            size={size}
            color={colors.warning}
          />
        ))}
      </View>
    );
  };

  const getRatingPercentage = (count: number) => {
    if (totalReviews === 0) return 0;
    return (count / totalReviews) * 100;
  };

  return (
    <View style={style} testID={testID} {...accessibilityProps}>
      {/* Overall Rating */}
      <View style={{ alignItems: 'center', marginBottom: showBreakdown ? 24 : 0 }}>
        <Text style={{ fontSize: 48, fontWeight: '700', color: colors.text }}>
          {rating.toFixed(1)}
        </Text>
        {renderStars(rating, 24)}
        {totalReviews > 0 && (
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4 }}>
            {totalReviews.toLocaleString()} reviews
          </Text>
        )}
      </View>

      {/* Breakdown */}
      {showBreakdown && breakdown && (
        <View style={{ gap: 8 }}>
          {[5, 4, 3, 2, 1].map((star, index) => {
            const count = breakdown[5 - star];
            const percentage = getRatingPercentage(count);
            
            return (
              <TouchableOpacity
                key={star}
                onPress={() => onRatingSelect?.(star)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                disabled={!onRatingSelect}
              >
                <Text style={{ fontSize: fontSize.sm, color: colors.text, width: 20 }}>
                  {star}
                </Text>
                <Icon name="star" size={16} color={colors.warning} />
                
                {/* Progress bar */}
                <View
                  style={{
                    flex: 1,
                    height: 8,
                    backgroundColor: colors.border,
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor: colors.warning,
                    }}
                  />
                </View>
                
                <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary, width: 40 }}>
                  {count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
});

RatingReview.displayName = 'RatingReview';

// ============================================================================
// TIMELINE
// ============================================================================

export interface TimelineItem {
  key: string;
  title: string;
  description?: string;
  timestamp?: string;
  icon?: string;
  iconColor?: string;
  status?: 'completed' | 'active' | 'pending';
}

export interface TimelineProps extends BaseComponentProps, StyleProps {
  /**
   * Timeline items
   */
  items: TimelineItem[];
  
  /**
   * Orientation
   */
  orientation?: 'vertical' | 'horizontal';
}

/**
 * Timeline Component
 * 
 * Vertical or horizontal timeline display.
 */
export const Timeline = memo<TimelineProps>(({
  items,
  orientation = 'vertical',
  style,
  testID = 'timeline',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'active':
        return colors.primary;
      case 'pending':
      default:
        return colors.border;
    }
  };

  if (orientation === 'horizontal') {
    return (
      <View
        style={[{ flexDirection: 'row', alignItems: 'flex-start' }, style]}
        testID={testID}
        {...accessibilityProps}
      >
        {items.map((item, index) => (
          <View key={item.key} style={{ flex: 1, alignItems: 'center' }}>
            {/* Node */}
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: item.iconColor || getStatusColor(item.status),
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {item.icon ? (
                <Icon name={item.icon as any} size={20} color="#FFFFFF" />
              ) : (
                <Text style={{ fontSize: fontSize.sm, fontWeight: '600', color: '#FFFFFF' }}>
                  {index + 1}
                </Text>
              )}
            </View>

            {/* Line */}
            {index < items.length - 1 && (
              <View
                style={{
                  position: 'absolute',
                  top: 20,
                  left: '50%',
                  right: '-50%',
                  height: 2,
                  backgroundColor: getStatusColor(items[index + 1].status),
                }}
              />
            )}

            {/* Content */}
            <View style={{ marginTop: 12, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: fontSize.sm,
                  fontWeight: '600',
                  color: colors.text,
                  textAlign: 'center',
                }}
              >
                {item.title}
              </Text>
              {item.timestamp && (
                <Text
                  style={{
                    fontSize: fontSize.xs,
                    color: colors.textSecondary,
                    marginTop: 2,
                  }}
                >
                  {item.timestamp}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={style} testID={testID} {...accessibilityProps}>
      {items.map((item, index) => (
        <View key={item.key} style={{ flexDirection: 'row' }}>
          {/* Left side */}
          <View style={{ alignItems: 'center', marginRight: 16 }}>
            {/* Node */}
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: item.iconColor || getStatusColor(item.status),
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {item.icon ? (
                <Icon name={item.icon as any} size={20} color="#FFFFFF" />
              ) : (
                <Text style={{ fontSize: fontSize.sm, fontWeight: '600', color: '#FFFFFF' }}>
                  {index + 1}
                </Text>
              )}
            </View>

            {/* Line */}
            {index < items.length - 1 && (
              <View
                style={{
                  width: 2,
                  flex: 1,
                  backgroundColor: getStatusColor(items[index + 1].status),
                  marginVertical: 4,
                }}
              />
            )}
          </View>

          {/* Right side */}
          <View style={{ flex: 1, paddingBottom: 24 }}>
            <Text style={{ fontSize: fontSize.md, fontWeight: '600', color: colors.text }}>
              {item.title}
            </Text>
            {item.description && (
              <Text
                style={{
                  fontSize: fontSize.sm,
                  color: colors.textSecondary,
                  marginTop: 4,
                  lineHeight: 20,
                }}
              >
                {item.description}
              </Text>
            )}
            {item.timestamp && (
              <Text
                style={{
                  fontSize: fontSize.xs,
                  color: colors.textSecondary,
                  marginTop: 8,
                }}
              >
                {item.timestamp}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
});

Timeline.displayName = 'Timeline';

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

// ============================================================================
// NOTIFICATION BADGE
// ============================================================================

export interface NotificationBadgeProps extends BaseComponentProps, StyleProps {
  /**
   * Badge count
   */
  count: number;
  
  /**
   * Max count to display
   */
  maxCount?: number;
  
  /**
   * Badge color
   */
  color?: string;
  
  /**
   * Badge size
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Show zero
   */
  showZero?: boolean;
  
  /**
   * Children to wrap
   */
  children: React.ReactNode;
}

/**
 * NotificationBadge Component
 * 
 * Badge wrapper for notification counts.
 */
export const NotificationBadge = memo<NotificationBadgeProps>(({
  count,
  maxCount = 99,
  color,
  size = 'md',
  showZero = false,
  children,
  style,
  testID = 'notification-badge',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();
  const badgeColor = color || colors.error;

  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const badgeSize = sizeMap[size];
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  if (count === 0 && !showZero) {
    return <View style={style}>{children}</View>;
  }

  return (
    <View style={[{ position: 'relative' }, style]} testID={testID} {...accessibilityProps}>
      {children}
      <View
        style={{
          position: 'absolute',
          top: -8,
          right: -8,
          minWidth: badgeSize,
          height: badgeSize,
          borderRadius: badgeSize / 2,
          backgroundColor: badgeColor,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 6,
        }}
      >
        <Text
          style={{
            fontSize: size === 'sm' ? 10 : size === 'md' ? 11 : 12,
            fontWeight: '700',
            color: '#FFFFFF',
          }}
        >
          {displayCount}
        </Text>
      </View>
    </View>
  );
});

NotificationBadge.displayName = 'NotificationBadge';
