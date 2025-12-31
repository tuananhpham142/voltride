// src/components/types/common.ts
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

/**
 * Common size variants used across components
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Common variant types
 */
export type Variant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'outline';

/**
 * Common state types
 */
export type State = 'default' | 'active' | 'disabled' | 'loading' | 'error' | 'success';

/**
 * Theme-aware component props
 */
export interface ThemeAwareProps {
  isDark?: boolean;
  useTheme?: boolean;
}

/**
 * Base component props that all components should extend
 */
export interface BaseComponentProps extends ThemeAwareProps {
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

/**
 * Style props for flexible component styling
 */
export interface StyleProps {
  style?: ViewStyle;
  className?: string;
}

/**
 * Text style props
 */
export interface TextStyleProps {
  textStyle?: TextStyle;
  textClassName?: string;
}

/**
 * Image style props
 */
export interface ImageStyleProps {
  imageStyle?: ImageStyle;
  imageClassName?: string;
}

/**
 * Container style props
 */
export interface ContainerStyleProps extends StyleProps {
  containerStyle?: ViewStyle;
  containerClassName?: string;
}

/**
 * Touchable component props
 */
export interface TouchableProps {
  onPress?: () => void;
  onLongPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  disabled?: boolean;
  activeOpacity?: number;
}

/**
 * Icon props for components with icons
 */
export interface IconProps {
  icon?: string;
  iconFamily?: 'fontawesome' | 'material' | 'ionicons' | 'feather';
  iconSize?: number;
  iconColor?: string;
  leftIcon?: string;
  rightIcon?: string;
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  duration?: number;
  useNativeDriver?: boolean;
  easing?: any;
}

/**
 * Position types for floating elements
 */
export type Position = 'top' | 'bottom' | 'left' | 'right' | 'center';

/**
 * Alignment types
 */
export type Alignment = 'flex-start' | 'center' | 'flex-end' | 'stretch';

/**
 * Component validation result
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
