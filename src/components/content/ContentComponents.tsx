// src/components/content/ContentComponents.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo, useState } from 'react';
import { Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize } from '../utils/theme';

// ============================================================================
// TAG
// ============================================================================

export interface TagProps extends BaseComponentProps, StyleProps {
  /**
   * Tag label
   */
  label: string;
  
  /**
   * Tag variant
   */
  variant?: 'filled' | 'outlined';
  
  /**
   * Tag color
   */
  color?: string;
  
  /**
   * On press handler
   */
  onPress?: () => void;
  
  /**
   * On remove handler
   */
  onRemove?: () => void;
  
  /**
   * Tag size
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Left icon
   */
  icon?: string;
}

const tagSizes = {
  sm: { paddingVertical: 4, paddingHorizontal: 8, fontSize: 12, iconSize: 14 },
  md: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 14, iconSize: 16 },
  lg: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 16, iconSize: 18 },
};

/**
 * Tag Component
 * 
 * Chip/label component for categorization.
 */
export const Tag = memo<TagProps>(({
  label,
  variant = 'filled',
  color,
  onPress,
  onRemove,
  size = 'md',
  icon,
  style,
  testID = 'tag',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const tagSize = tagSizes[size];
  const tagColor = color || colors.primary;

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tagSize.paddingVertical,
    paddingHorizontal: tagSize.paddingHorizontal,
    borderRadius: borderRadius.full,
    backgroundColor: variant === 'filled' ? `${tagColor}20` : 'transparent',
    borderWidth: variant === 'outlined' ? 1 : 0,
    borderColor: tagColor,
    gap: 6,
  };

  const textStyle: TextStyle = {
    fontSize: tagSize.fontSize,
    fontWeight: '500',
    color: variant === 'filled' ? tagColor : colors.text,
  };

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[containerStyle, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      testID={testID}
      {...accessibilityProps}
    >
      {icon && <Icon name={icon as any} size={tagSize.iconSize} color={tagColor} />}
      <Text style={textStyle}>{label}</Text>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="close" size={tagSize.iconSize} color={tagColor} />
        </TouchableOpacity>
      )}
    </Wrapper>
  );
});

Tag.displayName = 'Tag';

// ============================================================================
// LIST TITLE
// ============================================================================

export interface ListTitleProps extends BaseComponentProps, StyleProps {
  /**
   * Section title
   */
  title: string;
  
  /**
   * Subtitle
   */
  subtitle?: string;
  
  /**
   * Right action
   */
  rightAction?: {
    text: string;
    onPress: () => void;
  };
  
  /**
   * Show divider
   */
  showDivider?: boolean;
}

/**
 * ListTitle Component
 * 
 * Section header for lists.
 */
export const ListTitle = memo<ListTitleProps>(({
  title,
  subtitle,
  rightAction,
  showDivider = true,
  style,
  testID = 'list-title',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();

  return (
    <View testID={testID} {...accessibilityProps}>
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
          },
          style,
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: fontSize.md,
              fontWeight: '600',
              color: colors.text,
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                fontSize: fontSize.sm,
                color: colors.textSecondary,
                marginTop: 2,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {rightAction && (
          <TouchableOpacity onPress={rightAction.onPress} activeOpacity={0.7}>
            <Text
              style={{
                fontSize: fontSize.sm,
                color: colors.primary,
                fontWeight: '500',
              }}
            >
              {rightAction.text}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {showDivider && (
        <View
          style={{
            height: 1,
            backgroundColor: colors.border,
            marginHorizontal: 16,
          }}
        />
      )}
    </View>
  );
});

ListTitle.displayName = 'ListTitle';

// ============================================================================
// LIST ITEM
// ============================================================================

export interface ListItemProps extends BaseComponentProps, StyleProps {
  /**
   * Item title
   */
  title: string;
  
  /**
   * Subtitle
   */
  subtitle?: string;
  
  /**
   * Left icon
   */
  leftIcon?: string;
  
  /**
   * Right icon
   */
  rightIcon?: string;
  
  /**
   * Right text
   */
  rightText?: string;
  
  /**
   * On press handler
   */
  onPress?: () => void;
  
  /**
   * On swipe delete
   */
  onDelete?: () => void;
  
  /**
   * Show chevron
   */
  showChevron?: boolean;
  
  /**
   * Show divider
   */
  showDivider?: boolean;
}

/**
 * ListItem Component
 * 
 * List row with optional swipe actions.
 */
export const ListItem = memo<ListItemProps>(({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  rightText,
  onPress,
  onDelete,
  showChevron = true,
  showDivider = true,
  style,
  testID = 'list-item',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      if (onDelete && event.translationX < 0) {
        translateX.value = Math.max(-80, event.translationX);
      }
    })
    .onEnd(() => {
      if (translateX.value < -40 && onDelete) {
        translateX.value = withSpring(-80);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <View style={{ position: 'relative' }} testID={testID} {...accessibilityProps}>
      {/* Delete button (behind) */}
      {onDelete && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 80,
            backgroundColor: colors.error,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            translateX.value = withSpring(0);
            onDelete();
          }}
        >
          <Icon name="delete" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>
          <Wrapper
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                backgroundColor: isDark ? colors.surface : '#FFFFFF',
              },
              style,
            ]}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
          >
            {leftIcon && (
              <Icon name={leftIcon as any} size={24} color={colors.textSecondary} style={{ marginRight: 16 }} />
            )}

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: fontSize.md, color: colors.text, fontWeight: '500' }}>
                {title}
              </Text>
              {subtitle && (
                <Text
                  style={{
                    fontSize: fontSize.sm,
                    color: colors.textSecondary,
                    marginTop: 2,
                  }}
                >
                  {subtitle}
                </Text>
              )}
            </View>

            {rightText && (
              <Text
                style={{
                  fontSize: fontSize.sm,
                  color: colors.textSecondary,
                  marginRight: 8,
                }}
              >
                {rightText}
              </Text>
            )}

            {rightIcon && <Icon name={rightIcon as any} size={24} color={colors.textSecondary} />}
            
            {!rightIcon && showChevron && onPress && (
              <Icon name="chevron-right" size={24} color={colors.textSecondary} />
            )}
          </Wrapper>

          {showDivider && (
            <View
              style={{
                height: 1,
                backgroundColor: colors.border,
                marginLeft: leftIcon ? 56 : 16,
              }}
            />
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

ListItem.displayName = 'ListItem';

// ============================================================================
// ACCORDION
// ============================================================================

export interface AccordionProps extends BaseComponentProps, StyleProps {
  /**
   * Accordion title
   */
  title: string;
  
  /**
   * Children content
   */
  children: React.ReactNode;
  
  /**
   * Initially expanded
   */
  initiallyExpanded?: boolean;
  
  /**
   * Left icon
   */
  icon?: string;
}

/**
 * Accordion Component
 * 
 * Expandable content section.
 */
export const Accordion = memo<AccordionProps>(({
  title,
  children,
  initiallyExpanded = false,
  icon,
  style,
  testID = 'accordion',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const height = useSharedValue(initiallyExpanded ? 1 : 0);
  const rotation = useSharedValue(initiallyExpanded ? 180 : 0);

  const toggleExpanded = () => {
    setExpanded(!expanded);
    height.value = withTiming(expanded ? 0 : 1, { duration: 300 });
    rotation.value = withTiming(expanded ? 0 : 180, { duration: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: height.value,
    transform: [{ scale: height.value }],
  }));

  const arrowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View
      style={[
        {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          overflow: 'hidden',
          backgroundColor: isDark ? colors.surface : '#FFFFFF',
        },
        style,
      ]}
      testID={testID}
      {...accessibilityProps}
    >
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
        }}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        {icon && (
          <Icon name={icon as any} size={24} color={colors.textSecondary} style={{ marginRight: 12 }} />
        )}
        <Text style={{ flex: 1, fontSize: fontSize.md, fontWeight: '600', color: colors.text }}>
          {title}
        </Text>
        <Animated.View style={arrowAnimatedStyle}>
          <Icon name="keyboard-arrow-down" size={24} color={colors.textSecondary} />
        </Animated.View>
      </TouchableOpacity>

      {expanded && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[
            {
              padding: 16,
              paddingTop: 0,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            },
            animatedStyle,
          ]}
        >
          {children}
        </Animated.View>
      )}
    </View>
  );
});

Accordion.displayName = 'Accordion';

// ============================================================================
// DIVIDER
// ============================================================================

export interface DividerProps extends BaseComponentProps, StyleProps {
  /**
   * Divider orientation
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Divider thickness
   */
  thickness?: number;
  
  /**
   * Divider color
   */
  color?: string;
  
  /**
   * Text label
   */
  label?: string;
  
  /**
   * Spacing
   */
  spacing?: number;
}

/**
 * Divider Component
 * 
 * Visual separator between content.
 */
export const Divider = memo<DividerProps>(({
  orientation = 'horizontal',
  thickness = 1,
  color,
  label,
  spacing = 16,
  style,
  testID = 'divider',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();
  const dividerColor = color || colors.border;

  if (label) {
    return (
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: spacing,
          },
          style,
        ]}
        testID={testID}
        {...accessibilityProps}
      >
        <View style={{ flex: 1, height: thickness, backgroundColor: dividerColor }} />
        <Text
          style={{
            marginHorizontal: 16,
            fontSize: fontSize.sm,
            color: colors.textSecondary,
          }}
        >
          {label}
        </Text>
        <View style={{ flex: 1, height: thickness, backgroundColor: dividerColor }} />
      </View>
    );
  }

  if (orientation === 'vertical') {
    return (
      <View
        style={[
          {
            width: thickness,
            height: '100%',
            backgroundColor: dividerColor,
            marginHorizontal: spacing,
          },
          style,
        ]}
        testID={testID}
        {...accessibilityProps}
      />
    );
  }

  return (
    <View
      style={[
        {
          height: thickness,
          backgroundColor: dividerColor,
          marginVertical: spacing,
        },
        style,
      ]}
      testID={testID}
      {...accessibilityProps}
    />
  );
});

Divider.displayName = 'Divider';
