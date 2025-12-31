// src/components/content/Card.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { Image, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Button } from '../control/Button';
import { Badge } from '../informative/Badge';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize, shadows } from '../utils/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export interface CardProps extends BaseComponentProps, StyleProps {
  /**
   * Card title
   */
  title?: string;
  
  /**
   * Card subtitle
   */
  subtitle?: string;
  
  /**
   * Card description
   */
  description?: string;
  
  /**
   * Image source
   */
  image?: { uri: string } | number;
  
  /**
   * Tag/badge text
   */
  tag?: string;
  
  /**
   * Tag color
   */
  tagColor?: string;
  
  /**
   * Icon name (alternative to image)
   */
  icon?: string;
  
  /**
   * Icon color
   */
  iconColor?: string;
  
  /**
   * Button text
   */
  buttonText?: string;
  
  /**
   * Button press handler
   */
  onButtonPress?: () => void;
  
  /**
   * Card press handler
   */
  onPress?: () => void;
  
  /**
   * Show shadow
   */
  shadow?: boolean;
  
  /**
   * Card orientation
   */
  orientation?: 'vertical' | 'horizontal';
  
  /**
   * Children content
   */
  children?: React.ReactNode;
}

/**
 * Card Component
 * 
 * A flexible container component for displaying content with images, text, and actions.
 * 
 * @example
 * ```tsx
 * <Card
 *   title="Product Name"
 *   subtitle="Category"
 *   description="Product description here"
 *   image={{ uri: 'https://...' }}
 *   tag="NEW"
 *   buttonText="View Details"
 *   onButtonPress={() => console.log('Button pressed')}
 *   onPress={() => console.log('Card pressed')}
 * />
 * ```
 */
export const Card = memo<CardProps>(({
  title,
  subtitle,
  description,
  image,
  tag,
  tagColor,
  icon,
  iconColor,
  buttonText,
  onButtonPress,
  onPress,
  shadow = true,
  orientation = 'vertical',
  children,
  style,
  testID = 'card',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);

  const isHorizontal = orientation === 'horizontal';

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98);
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1);
    }
  };

  const containerStyle: ViewStyle = {
    backgroundColor: isDark ? colors.surface : '#FFFFFF',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    flexDirection: isHorizontal ? 'row' : 'column',
    ...(shadow ? shadows.md : {}),
  };

  const imageContainerStyle: ViewStyle = {
    width: isHorizontal ? 120 : '100%',
    height: isHorizontal ? '100%' : 180,
    backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  };

  const contentContainerStyle: ViewStyle = {
    padding: 16,
    flex: 1,
  };

  const titleStyle: TextStyle = {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: subtitle ? 4 : 8,
  };

  const subtitleStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 8,
  };

  const descriptionStyle: TextStyle = {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: buttonText ? 16 : 0,
  };

  const Wrapper = onPress ? AnimatedTouchable : Animated.View;

  return (
    <Wrapper
      style={[containerStyle, animatedStyle, style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      disabled={!onPress}
      testID={testID}
      {...accessibilityProps}
    >
      {/* Image/Icon Section */}
      {(image || icon) && (
        <View style={imageContainerStyle}>
          {image ? (
            <Image
              source={image}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : icon ? (
            <Icon
              name={icon as any}
              size={48}
              color={iconColor || colors.primary}
            />
          ) : null}

          {/* Tag Badge */}
          {tag && (
            <View
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
              }}
            >
              <Badge
                type="number"
                content={tag}
                color={tagColor || colors.primary}
              />
            </View>
          )}
        </View>
      )}

      {/* Content Section */}
      <View style={contentContainerStyle}>
        {title && <Text style={titleStyle}>{title}</Text>}
        {subtitle && <Text style={subtitleStyle}>{subtitle}</Text>}
        {description && <Text style={descriptionStyle}>{description}</Text>}
        
        {children}

        {buttonText && onButtonPress && (
          <Button
            title={buttonText}
            variant="primary"
            size="sm"
            onPress={onButtonPress}
            fullWidth
          />
        )}
      </View>
    </Wrapper>
  );
});

Card.displayName = 'Card';
