// src/components/control/FloatingButton.tsx

import { useTheme } from '@/hooks/useTheme';
import { ThemeColors } from '@/types/theme';
import Icon from '@react-native-vector-icons/material-icons';
import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Text } from '../content/Text';

export interface FloatingButtonProps {
  icon?: string;
  label?: string;
  onPress: () => void;
  variant?: keyof ThemeColors;
  size?: 'small' | 'medium' | 'large';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left';
  disabled?: boolean;
  loading?: boolean;
  badge?: number;
  extended?: boolean; // Shows label alongside icon
  style?: ViewStyle;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  icon = 'plus',
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  position = 'bottom-right',
  disabled = false,
  loading = false,
  badge,
  extended = false,
  style,
}) => {
  const { colors } = useTheme();

  // Variant colors

  const backgroundColor = colors[variant];

  // Size configurations
  const sizeConfig = {
    small: {
      buttonSize: 48,
      iconSize: 20,
      fontSize: 12,
      padding: 12,
    },
    medium: {
      buttonSize: 56,
      iconSize: 24,
      fontSize: 14,
      padding: 16,
    },
    large: {
      buttonSize: 64,
      iconSize: 28,
      fontSize: 16,
      padding: 20,
    },
  };

  const config = sizeConfig[size];

  // Position styles
  const positionStyles: Record<string, ViewStyle> = {
    'bottom-right': {
      position: 'absolute',
      bottom: 16,
      right: 16,
    },
    'bottom-left': {
      position: 'absolute',
      bottom: 16,
      left: 16,
    },
    'bottom-center': {
      position: 'absolute',
      bottom: 16,
      left: '50%',
      transform: [{ translateX: -(extended ? 80 : config.buttonSize / 2) }],
    },
    'top-right': {
      position: 'absolute',
      top: 16,
      right: 16,
    },
    'top-left': {
      position: 'absolute',
      top: 16,
      left: 16,
    },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.container,
        positionStyles[position],
        extended ? styles.extended : styles.circular,
        {
          backgroundColor: disabled ? colors.border : backgroundColor,
          width: extended ? 'auto' : config.buttonSize,
          height: config.buttonSize,
          paddingHorizontal: extended ? config.padding : 0,
          shadowColor: disabled ? 'transparent' : '#000',
        },
        style,
      ]}
    >
      {/* Loading Spinner */}
      {loading && (
        <View style={styles.loadingContainer}>
          <Animated.View style={styles.spinner}>
            <Icon name="hourglass-top" size={config.iconSize} color="#FFFFFF" />
          </Animated.View>
        </View>
      )}

      {/* Content */}
      {!loading && (
        <>
          <Icon name={icon as any} size={config.iconSize} color="#FFFFFF" />
          
          {extended && label && (
            <Text
              variant="button"
              style={{
                color: '#FFFFFF',
                marginLeft: 8,
                fontSize: config.fontSize,
              }}
            >
              {label}
            </Text>
          )}

          {/* Badge */}
          {badge !== undefined && badge > 0 && (
            <View
              style={[
                styles.badge,
                {
                  top: extended ? -8 : -4,
                  right: extended ? -8 : -4,
                },
              ]}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 10,
                  fontWeight: 'bold',
                }}
              >
                {badge > 99 ? '99+' : badge}
              </Text>
            </View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    zIndex: 999,
  },
  circular: {
    borderRadius: 28,
  },
  extended: {
    borderRadius: 28,
    minWidth: 120,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    // Add rotation animation if needed
  },
  badge: {
    position: 'absolute',
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

export default FloatingButton;
