// src/components/assets/Avatar.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { Image, Text, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { BaseComponentProps, Size, StyleProps } from '../types/common';
import { borderRadius } from '../utils/theme';

export interface AvatarProps extends BaseComponentProps, StyleProps {
  /**
   * Avatar size
   */
  size?: Size | number;
  
  /**
   * Image source URI
   */
  source?: string | { uri: string };
  
  /**
   * Initials to display when no image
   */
  initials?: string;
  
  /**
   * Background color
   */
  backgroundColor?: string;
  
  /**
   * Text color for initials
   */
  textColor?: string;
  
  /**
   * Border width
   */
  borderWidth?: number;
  
  /**
   * Border color
   */
  borderColor?: string;
  
  /**
   * Icon name if showing icon instead of image
   */
  icon?: string;
  
  /**
   * Make avatar clickable
   */
  onPress?: () => void;
  
  /**
   * Show online status indicator
   */
  showStatus?: boolean;
  
  /**
   * Status color
   */
  statusColor?: 'online' | 'offline' | 'busy' | 'away';
  
  /**
   * Shape of avatar
   */
  shape?: 'circle' | 'rounded' | 'square';
}

/**
 * Avatar size mapping
 */
const sizeMap: Record<Size, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

/**
 * Status color mapping
 */
const statusColors = {
  online: '#34C759',
  offline: '#8E8E93',
  busy: '#FF3B30',
  away: '#FF9500',
};

/**
 * Avatar Component
 * 
 * A component to represent user avatars with support for images, initials, and icons.
 * 
 * @example
 * ```tsx
 * <Avatar 
 *   source={{ uri: 'https://...' }}
 *   size="lg"
 *   showStatus
 *   statusColor="online"
 * />
 * ```
 */
export const Avatar = memo<AvatarProps>(({
  size = 'md',
  source,
  initials,
  backgroundColor,
  textColor,
  borderWidth = 0,
  borderColor,
  icon,
  onPress,
  showStatus = false,
  statusColor = 'online',
  shape = 'circle',
  style,
  className,
  testID = 'avatar',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);

  // Calculate size
  const avatarSize = typeof size === 'number' ? size : sizeMap[size];
  const fontSize = avatarSize * 0.4;
  const statusSize = avatarSize * 0.25;

  // Default colors
  const bgColor = backgroundColor || (isDark ? colors.surface : colors.primary);
  const textClr = textColor || '#FFFFFF';

  // Border radius based on shape
  const getBorderRadius = () => {
    switch (shape) {
      case 'circle':
        return borderRadius.full;
      case 'rounded':
        return borderRadius.lg;
      case 'square':
        return borderRadius.none;
      default:
        return borderRadius.full;
    }
  };

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Container style
  const containerStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: getBorderRadius(),
    backgroundColor: bgColor,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth,
    borderColor: borderColor || 'transparent',
  };

  // Handle press
  const handlePress = () => {
    if (onPress) {
      scale.value = withSpring(0.95, {}, () => {
        scale.value = withSpring(1);
      });
      onPress();
    }
  };

  // Render content
  const renderContent = () => {
    if (source) {
      const imageSource = typeof source === 'string' ? { uri: source } : source;
      return (
        <Image
          source={imageSource}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      );
    }

    if (icon) {
      return (
        <Icon
          name={icon as any}
          size={fontSize}
          color={textClr}
        />
      );
    }

    if (initials) {
      return (
        <Text
          style={{
            fontSize,
            fontWeight: '600',
            color: textClr,
          }}
        >
          {initials.substring(0, 2).toUpperCase()}
        </Text>
      );
    }

    // Default icon
    return (
      <Icon
        name="person"
        size={fontSize}
        color={textClr}
      />
    );
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <View
        style={containerStyle}
        onTouchStart={handlePress}
        testID={testID}
        {...accessibilityProps}
      >
        {renderContent()}

        {/* Status indicator */}
        {showStatus && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: statusSize,
              height: statusSize,
              borderRadius: statusSize / 2,
              backgroundColor: statusColors[statusColor],
              borderWidth: 2,
              borderColor: isDark ? colors.background : '#FFFFFF',
            }}
          />
        )}
      </View>
    </Animated.View>
  );
});

Avatar.displayName = 'Avatar';
