
// src/components/informative/BannerDialogTooltip.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo, useState } from 'react';
import { Modal, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { Button } from '../control/Button';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize, shadows } from '../utils/theme';

// ============================================================================
// BANNER
// ============================================================================

export interface BannerProps extends BaseComponentProps, StyleProps {
  /**
   * Banner title
   */
  title?: string;
  
  /**
   * Banner description
   */
  description: string;
  
  /**
   * Banner type
   */
  type?: 'info' | 'success' | 'warning' | 'error';
  
  /**
   * Show banner
   */
  visible: boolean;
  
  /**
   * On dismiss callback
   */
  onDismiss?: () => void;
  
  /**
   * Button text
   */
  buttonText?: string;
  
  /**
   * Button press handler
   */
  onButtonPress?: () => void;
  
  /**
   * Show image/icon
   */
  icon?: string;
}

const bannerColors = {
  info: { bg: '#E3F2FD', icon: '#2196F3', border: '#2196F3' },
  success: { bg: '#E8F5E9', icon: '#4CAF50', border: '#4CAF50' },
  warning: { bg: '#FFF3E0', icon: '#FF9800', border: '#FF9800' },
  error: { bg: '#FFEBEE', icon: '#F44336', border: '#F44336' },
};

/**
 * Banner Component
 * 
 * Displays important messages with optional actions.
 */
export const Banner = memo<BannerProps>(({
  title,
  description,
  type = 'info',
  visible,
  onDismiss,
  buttonText,
  onButtonPress,
  icon,
  style,
  testID = 'banner',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const colorScheme = bannerColors[type];

  if (!visible) return null;

  const containerStyle: ViewStyle = {
    backgroundColor: isDark ? colors.surface : colorScheme.bg,
    borderLeftWidth: 4,
    borderLeftColor: colorScheme.border,
    borderRadius: borderRadius.md,
    padding: 16,
    marginVertical: 8,
    ...shadows.sm,
  };

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[containerStyle, style]}
      testID={testID}
      {...accessibilityProps}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {icon && (
          <Icon
            name={icon as any}
            size={24}
            color={colorScheme.icon}
            style={{ marginRight: 12 }}
          />
        )}
        
        <View style={{ flex: 1 }}>
          {title && (
            <Text
              style={{
                fontSize: fontSize.md,
                fontWeight: '600',
                color: isDark ? colors.text : colorScheme.icon,
                marginBottom: 4,
              }}
            >
              {title}
            </Text>
          )}
          <Text
            style={{
              fontSize: fontSize.sm,
              color: colors.textSecondary,
              lineHeight: 20,
            }}
          >
            {description}
          </Text>
          
          {buttonText && (
            <Button
              title={buttonText}
              variant="outline"
              size="sm"
              onPress={onButtonPress}
              style={{ marginTop: 12, alignSelf: 'flex-start' }}
            />
          )}
        </View>

        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={{ marginLeft: 8 }}>
            <Icon name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
});

Banner.displayName = 'Banner';

// ============================================================================
// DIALOG
// ============================================================================

export interface DialogProps extends BaseComponentProps, StyleProps {
  /**
   * Dialog visibility
   */
  visible: boolean;
  
  /**
   * Dialog title
   */
  title: string;
  
  /**
   * Dialog description
   */
  description: string;
  
  /**
   * Primary button text
   */
  primaryButtonText: string;
  
  /**
   * Primary button handler
   */
  onPrimaryPress: () => void;
  
  /**
   * Secondary button text
   */
  secondaryButtonText?: string;
  
  /**
   * Secondary button handler
   */
  onSecondaryPress?: () => void;
  
  /**
   * Tertiary button text (for 3-button variant)
   */
  tertiaryButtonText?: string;
  
  /**
   * Tertiary button handler
   */
  onTertiaryPress?: () => void;
  
  /**
   * On dismiss (backdrop press)
   */
  onDismiss?: () => void;
  
  /**
   * Dialog type
   */
  type?: 'default' | 'destructive';
}

/**
 * Dialog Component
 * 
 * Modal dialog with 2 or 3 action buttons.
 */
export const Dialog = memo<DialogProps>(({
  visible,
  title,
  description,
  primaryButtonText,
  onPrimaryPress,
  secondaryButtonText,
  onSecondaryPress,
  tertiaryButtonText,
  onTertiaryPress,
  onDismiss,
  type = 'default',
  style,
  testID = 'dialog',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 15 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withSpring(0.9);
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const has3Buttons = !!tertiaryButtonText;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          onPress={onDismiss}
          activeOpacity={1}
        />

        <Animated.View
          style={[
            {
              backgroundColor: isDark ? colors.surface : '#FFFFFF',
              borderRadius: borderRadius.xl,
              padding: 24,
              width: '100%',
              maxWidth: 400,
              ...shadows.xl,
            },
            animatedStyle,
            style,
          ]}
          testID={testID}
          {...accessibilityProps}
        >
          <Text
            style={{
              fontSize: fontSize.xl,
              fontWeight: '700',
              color: colors.text,
              marginBottom: 12,
              textAlign: 'center',
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              fontSize: fontSize.md,
              color: colors.textSecondary,
              lineHeight: 22,
              textAlign: 'center',
              marginBottom: 24,
            }}
          >
            {description}
          </Text>

          {has3Buttons ? (
            // 3-button layout (vertical)
            <View style={{ gap: 12 }}>
              <Button
                title={primaryButtonText}
                variant={type === 'destructive' ? 'primary' : 'primary'}
                size="md"
                onPress={onPrimaryPress}
                fullWidth
                backgroundColor={type === 'destructive' ? colors.error : undefined}
              />
              <Button
                title={secondaryButtonText!}
                variant="outline"
                size="md"
                onPress={onSecondaryPress}
                fullWidth
              />
              <Button
                title={tertiaryButtonText}
                variant="ghost"
                size="md"
                onPress={onTertiaryPress}
                fullWidth
              />
            </View>
          ) : (
            // 2-button layout (horizontal)
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {secondaryButtonText && (
                <View style={{ flex: 1 }}>
                  <Button
                    title={secondaryButtonText}
                    variant="outline"
                    size="md"
                    onPress={onSecondaryPress}
                    fullWidth
                  />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Button
                  title={primaryButtonText}
                  variant="primary"
                  size="md"
                  onPress={onPrimaryPress}
                  fullWidth
                  backgroundColor={type === 'destructive' ? colors.error : undefined}
                />
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
});

Dialog.displayName = 'Dialog';

// ============================================================================
// TOOLTIP
// ============================================================================

export interface TooltipProps extends BaseComponentProps, StyleProps {
  /**
   * Tooltip content
   */
  content: string;
  
  /**
   * Tooltip position
   */
  position?: 'top' | 'bottom' | 'left' | 'right';
  
  /**
   * Children to wrap
   */
  children: React.ReactNode;
  
  /**
   * Show on long press
   */
  showOnLongPress?: boolean;
}

/**
 * Tooltip Component
 * 
 * Displays contextual information on press or long press.
 */
export const Tooltip = memo<TooltipProps>(({
  content,
  position = 'top',
  children,
  showOnLongPress = true,
  style,
  testID = 'tooltip',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const [visible, setVisible] = useState(false);

  const handlePress = () => {
    if (!showOnLongPress) {
      setVisible(true);
      setTimeout(() => setVisible(false), 2000);
    }
  };

  const handleLongPress = () => {
    if (showOnLongPress) {
      setVisible(true);
      setTimeout(() => setVisible(false), 2000);
    }
  };

  const getTooltipStyle = (): ViewStyle => {
    const base: ViewStyle = {
      position: 'absolute',
      backgroundColor: isDark ? '#333333' : '#000000',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: borderRadius.md,
      maxWidth: 200,
      zIndex: 9999,
    };

    switch (position) {
      case 'top':
        return { ...base, bottom: '100%', marginBottom: 8 };
      case 'bottom':
        return { ...base, top: '100%', marginTop: 8 };
      case 'left':
        return { ...base, right: '100%', marginRight: 8 };
      case 'right':
        return { ...base, left: '100%', marginLeft: 8 };
      default:
        return base;
    }
  };

  return (
    <View style={style}>
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={handleLongPress}
        activeOpacity={0.7}
        testID={testID}
        {...accessibilityProps}
      >
        {children}
      </TouchableOpacity>

      {visible && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={getTooltipStyle()}
        >
          <Text
            style={{
              fontSize: fontSize.sm,
              color: '#FFFFFF',
              textAlign: 'center',
            }}
          >
            {content}
          </Text>
        </Animated.View>
      )}
    </View>
  );
});

Tooltip.displayName = 'Tooltip';
