// src/components/informative/StatCard.tsx

import { useTheme } from '@/hooks/useTheme';
import { ThemeColors } from '@/types/theme';
import Icon from '@react-native-vector-icons/material-icons';
import React from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Text } from '../content/Text';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  description?: string;
  color?: keyof ThemeColors;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  style?: ViewStyle;
  valueStyle?: TextStyle;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  iconColor,
  trend,
  trendValue,
  description,
  color = 'primary',
  size = 'medium',
  onPress,
  style,
  valueStyle,
  loading = false,
}) => {
  const { colors } = useTheme();

  const trendColors = {
    up: colors.success,
    down: colors.error,
    neutral: colors.textSecondary,
  };

  const trendIcons = {
    up: 'trending-up',
    down: 'trending-down',
    neutral: 'minus',
  };

  const sizeStyles = {
    small: {
      padding: 12,
      valueSize: 20,
      labelSize: 12,
      iconSize: 20,
    },
    medium: {
      padding: 16,
      valueSize: 28,
      labelSize: 14,
      iconSize: 24,
    },
    large: {
      padding: 20,
      valueSize: 34,
      labelSize: 16,
      iconSize: 28,
    },
  };

  const currentSize = sizeStyles[size];
  const accentColor = iconColor || colors[color];

  const Container = onPress ? TouchableOpacity : View;

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            padding: currentSize.padding,
          },
          style,
        ]}
      >
        <View
          style={{
            height: currentSize.labelSize,
            backgroundColor: colors.border,
            borderRadius: 4,
            marginBottom: 8,
            width: '60%',
          }}
        />
        <View
          style={{
            height: currentSize.valueSize,
            backgroundColor: colors.border,
            borderRadius: 4,
            width: '40%',
          }}
        />
      </View>
    );
  }

  return (
    <Container
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          padding: currentSize.padding,
        },
        style,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      {/* Header with Icon and Label */}
      <View style={styles.header}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: `${accentColor}15` }]}>
            <Icon name={icon as any} size={currentSize.iconSize} color={accentColor} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text
            variant="caption"
            style={{
              fontSize: currentSize.labelSize,
              color: colors.textSecondary,
              textTransform: 'uppercase',
            }}
          >
            {label}
          </Text>
        </View>
      </View>

      {/* Value */}
      <View style={styles.valueContainer}>
        <Text
          style={[
            {
              fontSize: currentSize.valueSize,
              fontWeight: '700',
              color: colors.text,
            },
            valueStyle,
          ]}
        >
          {value}
        </Text>

        {/* Trend Indicator */}
        {trend && (
          <View style={[styles.trendContainer, { marginLeft: 8 }]}>
            <Icon name={trendIcons[trend] as any} size={16} color={trendColors[trend]} />
            {trendValue && (
              <Text
                variant="caption"
                style={{
                  color: trendColors[trend],
                  marginLeft: 4,
                  fontWeight: '600',
                }}
              >
                {trendValue}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Description */}
      {description && (
        <Text
          variant="caption"
          style={{
            color: colors.textSecondary,
            marginTop: 4,
          }}
        >
          {description}
        </Text>
      )}

      {/* Pressable Indicator */}
      {onPress && (
        <View style={styles.pressableIndicator}>
          <Icon name="chevron-right" size={16} color={colors.textSecondary} />
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressableIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});

export default StatCard;
