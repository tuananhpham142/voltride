
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize } from '../utils/theme';

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
