// src/components/utils/animations.ts
import {
  Easing,
  WithSpringConfig,
  WithTimingConfig,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';

/**
 * Default spring configuration
 */
export const defaultSpringConfig: WithSpringConfig = {
  damping: 15,
  stiffness: 150,
  mass: 1,
  overshootClamping: false,
  // restDisplacementThreshold: 0.01,
  // restSpeedThreshold: 2,
};

/**
 * Default timing configuration
 */
export const defaultTimingConfig: WithTimingConfig = {
  duration: 300,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

/**
 * Preset animation configurations
 */
export const animationPresets = {
  // Bounce animation
  bounce: {
    damping: 10,
    stiffness: 200,
    mass: 0.5,
  },
  
  // Smooth spring
  smooth: {
    damping: 20,
    stiffness: 100,
    mass: 1,
  },
  
  // Quick spring
  quick: {
    damping: 25,
    stiffness: 300,
    mass: 0.5,
  },
  
  // Slow spring
  slow: {
    damping: 30,
    stiffness: 50,
    mass: 1.5,
  },
  
  // Fast timing
  fast: {
    duration: 150,
    easing: Easing.out(Easing.ease),
  },
  
  // Normal timing
  normal: {
    duration: 300,
    easing: Easing.inOut(Easing.ease),
  },
  
  // Slow timing
  slowTiming: {
    duration: 500,
    easing: Easing.bezier(0.4, 0.0, 0.2, 1),
  },
};

/**
 * Common easing functions
 */
export const easingFunctions = {
  linear: Easing.linear,
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
  bezier: Easing.bezier(0.25, 0.1, 0.25, 1),
  bounce: Easing.bounce,
  elastic: Easing.elastic(1),
};

/**
 * Animation helper functions
 */
export const animations = {
  /**
   * Fade in animation
   */
  fadeIn: (duration = 300) => {
    return withTiming(1, { duration, easing: Easing.out(Easing.ease) });
  },

  /**
   * Fade out animation
   */
  fadeOut: (duration = 300) => {
    return withTiming(0, { duration, easing: Easing.in(Easing.ease) });
  },

  /**
   * Scale animation
   */
  scale: (to: number, config?: WithSpringConfig) => {
    return withSpring(to, config || animationPresets.smooth);
  },

  /**
   * Slide in from bottom
   */
  slideInFromBottom: (from: number, duration = 300) => {
    return withTiming(0, {
      duration,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  },

  /**
   * Slide out to bottom
   */
  slideOutToBottom: (to: number, duration = 300) => {
    return withTiming(to, {
      duration,
      easing: Easing.bezier(0.4, 0, 0.6, 1),
    });
  },

  /**
   * Pulse animation
   */
  pulse: (scale = 1.05) => {
    return withSequence(
      withTiming(scale, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
  },

  /**
   * Shake animation
   */
  shake: (intensity = 10) => {
    return withSequence(
      withTiming(intensity, { duration: 50 }),
      withTiming(-intensity, { duration: 50 }),
      withTiming(intensity, { duration: 50 }),
      withTiming(-intensity, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  },

  /**
   * Rotate animation
   */
  rotate: (to: number, duration = 300) => {
    return withTiming(to, { duration, easing: Easing.linear });
  },

  /**
   * Bounce animation
   */
  bounce: (config?: WithSpringConfig) => {
    return withSpring(1, config || animationPresets.bounce);
  },
};

/**
 * Gesture animation helpers
 */
export const gestureAnimations = {
  /**
   * Swipe animation
   */
  swipe: (velocity: number, endPosition: number) => {
    'worklet';
    return withSpring(endPosition, {
      velocity,
      damping: 20,
      stiffness: 90,
    });
  },

  /**
   * Snap animation
   */
  snap: (points: number[], value: number) => {
    'worklet';
    // Find closest snap point
    const closest = points.reduce((prev, curr) => {
      return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
    });
    return withSpring(closest, animationPresets.smooth);
  },
};
