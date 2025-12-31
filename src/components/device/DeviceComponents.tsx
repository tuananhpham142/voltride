
import React, { memo, useEffect } from 'react';
import { KeyboardAvoidingView, Modal, Platform, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { BaseComponentProps, StyleProps } from '../types/common';

// ============================================================================
// OVERLAY
// ============================================================================

export interface OverlayProps extends BaseComponentProps, StyleProps {
  /**
   * Overlay visibility
   */
  visible: boolean;
  
  /**
   * On dismiss (backdrop press)
   */
  onDismiss?: () => void;
  
  /**
   * Overlay opacity
   */
  opacity?: number;
  
  /**
   * Overlay color
   */
  color?: string;
  
  /**
   * Children content
   */
  children?: React.ReactNode;
  
  /**
   * Animation duration
   */
  animationDuration?: number;
  
  /**
   * Dismissable
   */
  dismissable?: boolean;
}

/**
 * Overlay Component
 * 
 * Dark overlay for modals and popups.
 */
export const Overlay = memo<OverlayProps>(({
  visible,
  onDismiss,
  opacity = 0.5,
  color = '#000000',
  children,
  animationDuration = 300,
  dismissable = true,
  style,
  testID = 'overlay',
  ...accessibilityProps
}) => {
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      overlayOpacity.value = withTiming(opacity, {
        duration: animationDuration,
        easing: Easing.out(Easing.ease),
      });
    } else {
      overlayOpacity.value = withTiming(0, {
        duration: animationDuration,
        easing: Easing.in(Easing.ease),
      });
    }
  }, [visible, opacity, animationDuration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  if (!visible && overlayOpacity.value === 0) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={dismissable ? onDismiss : undefined}
    >
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={dismissable ? onDismiss : undefined}
          disabled={!dismissable}
        >
          <Animated.View
            style={[
              {
                flex: 1,
                backgroundColor: color,
              },
              animatedStyle,
              style,
            ]}
            testID={testID}
            {...accessibilityProps}
          />
        </TouchableOpacity>
        {children}
      </View>
    </Modal>
  );
});

Overlay.displayName = 'Overlay';

// ============================================================================
// KEYBOARD AVOIDING WRAPPER
// ============================================================================

export interface KeyboardAvoidingWrapperProps extends BaseComponentProps, StyleProps {
  /**
   * Children content
   */
  children: React.ReactNode;
  
  /**
   * Keyboard vertical offset
   */
  keyboardVerticalOffset?: number;
  
  /**
   * Behavior
   */
  behavior?: 'height' | 'position' | 'padding';
}

/**
 * KeyboardAvoidingWrapper Component
 * 
 * Wrapper that adjusts layout when keyboard is shown.
 */
export const KeyboardAvoidingWrapper = memo<KeyboardAvoidingWrapperProps>(({
  children,
  keyboardVerticalOffset = 0,
  behavior,
  style,
  testID = 'keyboard-avoiding-wrapper',
  ...accessibilityProps
}) => {
  const defaultBehavior = Platform.OS === 'ios' ? 'padding' : 'height';

  return (
    <KeyboardAvoidingView
      behavior={behavior || defaultBehavior}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={[{ flex: 1 }, style]}
      testID={testID}
      {...accessibilityProps}
    >
      {children}
    </KeyboardAvoidingView>
  );
});

KeyboardAvoidingWrapper.displayName = 'KeyboardAvoidingWrapper';

// ============================================================================
// SAFE AREA WRAPPER
// ============================================================================

export interface SafeAreaWrapperProps extends BaseComponentProps, StyleProps {
  /**
   * Children content
   */
  children: React.ReactNode;
  
  /**
   * Background color
   */
  backgroundColor?: string;
  
  /**
   * Edges to apply safe area
   */
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

/**
 * SafeAreaWrapper Component
 * 
 * Wrapper that applies safe area insets.
 * Note: In production, use react-native-safe-area-context
 */
export const SafeAreaWrapper = memo<SafeAreaWrapperProps>(({
  children,
  backgroundColor = 'transparent',
  edges = ['top', 'bottom'],
  style,
  testID = 'safe-area-wrapper',
  ...accessibilityProps
}) => {
  // This is a simplified version
  // In production, use SafeAreaView from react-native-safe-area-context
  
  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor,
  };

  return (
    <View
      style={[containerStyle, style]}
      testID={testID}
      {...accessibilityProps}
    >
      {children}
    </View>
  );
});

SafeAreaWrapper.displayName = 'SafeAreaWrapper';

// ============================================================================
// PORTAL (for rendering outside component hierarchy)
// ============================================================================

export interface PortalProps {
  /**
   * Children to render in portal
   */
  children: React.ReactNode;
}

/**
 * Portal Component
 * 
 * Renders children at the root level (useful for modals, tooltips).
 * Note: In production, consider using @gorhom/portal or similar
 */
export const Portal = memo<PortalProps>(({ children }) => {
  // This is a placeholder - integrate with a proper portal solution
  return <>{children}</>;
});

Portal.displayName = 'Portal';

// ============================================================================
// BLUR VIEW
// ============================================================================

export interface BlurViewProps extends BaseComponentProps, StyleProps {
  /**
   * Blur intensity
   */
  intensity?: number;
  
  /**
   * Blur type
   */
  blurType?: 'light' | 'dark' | 'extraDark';
  
  /**
   * Children content
   */
  children?: React.ReactNode;
}

/**
 * BlurView Component
 * 
 * Blurred background effect.
 * Note: In production, use @react-native-community/blur
 */
export const BlurView = memo<BlurViewProps>(({
  intensity = 50,
  blurType = 'light',
  children,
  style,
  testID = 'blur-view',
  ...accessibilityProps
}) => {
  // This is a placeholder - integrate with @react-native-community/blur
  const getBackgroundColor = () => {
    switch (blurType) {
      case 'dark':
        return 'rgba(0, 0, 0, 0.6)';
      case 'extraDark':
        return 'rgba(0, 0, 0, 0.8)';
      case 'light':
      default:
        return 'rgba(255, 255, 255, 0.6)';
    }
  };

  return (
    <View
      style={[
        {
          backgroundColor: getBackgroundColor(),
          // backdropFilter: `blur(${intensity}px)`, // For web
        },
        style,
      ]}
      testID={testID}
      {...accessibilityProps}
    >
      {children}
    </View>
  );
});

BlurView.displayName = 'BlurView';

// ============================================================================
// HAPTIC FEEDBACK
// ============================================================================

export type HapticFeedbackType = 
  | 'impactLight'
  | 'impactMedium'
  | 'impactHeavy'
  | 'notificationSuccess'
  | 'notificationWarning'
  | 'notificationError'
  | 'selection';

/**
 * Trigger haptic feedback
 * Note: In production, use react-native-haptic-feedback
 */
export const triggerHaptic = (type: HapticFeedbackType = 'impactLight') => {
  // This is a placeholder - integrate with react-native-haptic-feedback
  console.log(`Haptic feedback: ${type}`);
};

// ============================================================================
// STATUS BAR CONTROLLER
// ============================================================================

export interface StatusBarControllerProps {
  /**
   * Status bar style
   */
  barStyle?: 'light-content' | 'dark-content';
  
  /**
   * Background color
   */
  backgroundColor?: string;
  
  /**
   * Hidden
   */
  hidden?: boolean;
  
  /**
   * Translucent (Android)
   */
  translucent?: boolean;
}

/**
 * StatusBarController Component
 * 
 * Controls status bar appearance.
 * Note: In production, use StatusBar from react-native
 */
export const StatusBarController = memo<StatusBarControllerProps>(({
  barStyle = 'dark-content',
  backgroundColor = 'transparent',
  hidden = false,
  translucent = true,
}) => {
  // This is a placeholder - use StatusBar from react-native
  return null;
});

StatusBarController.displayName = 'StatusBarController';
