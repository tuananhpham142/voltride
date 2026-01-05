import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BaseComponentProps, StyleProps } from '../types/common';
import { fontSize } from '../utils/theme';
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
