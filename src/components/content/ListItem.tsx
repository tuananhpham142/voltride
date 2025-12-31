
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { BaseComponentProps, StyleProps } from '../types/common';
import { fontSize } from '../utils/theme';
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
