// src/components/assets/ImagePlaceholder.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo, useState } from 'react';
import { ActivityIndicator, DimensionValue, Image as RNImage, View, ViewStyle } from 'react-native';
import { BaseComponentProps, StyleProps } from '../types/common';

export interface ImagePlaceholderProps extends BaseComponentProps, StyleProps {
  /**
   * Image source
   */
  source?: { uri: string } | number;
  
  /**
   * Width of image
   */
  width?: number | string;
  
  /**
   * Height of image
   */
  height?: number | string;
  
  /**
   * Resize mode
   */
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  
  /**
   * Border radius
   */
  borderRadius?: number;
  
  /**
   * Show loading indicator
   */
  showLoading?: boolean;
  
  /**
   * Custom placeholder icon
   */
  placeholderIcon?: string;
}

/**
 * ImagePlaceholder Component
 * 
 * An enhanced image component with loading states and placeholder support.
 */
export const ImagePlaceholder = memo<ImagePlaceholderProps>(({
  source,
  width = '100%',
  height = 200,
  resizeMode = 'cover',
  borderRadius = 8,
  showLoading = true,
  placeholderIcon = 'image',
  style,
  testID = 'image-placeholder',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const containerStyle: ViewStyle = {
    width: width as DimensionValue,
    height: height as DimensionValue,
    borderRadius,
    backgroundColor: isDark ? colors.surface : '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  if (!source || error) {
    return (
      <View style={[containerStyle, style]} testID={testID} {...accessibilityProps}>
        <Icon
          name={placeholderIcon as any}
          size={48}
          color={colors.textSecondary}
        />
      </View>
    );
  }

  return (
    <View style={[containerStyle, style]} testID={testID} {...accessibilityProps}>
      <RNImage
        source={source}
        style={{ width: '100%', height: '100%' }}
        resizeMode={resizeMode}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
      {loading && showLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
});

ImagePlaceholder.displayName = 'ImagePlaceholder';

// ============================================================================
// VIDEO PLACEHOLDER
// ============================================================================

export interface VideoPlaceholderProps extends BaseComponentProps, StyleProps {
  /**
   * Width of video placeholder
   */
  width?: number | string;
  
  /**
   * Height of video placeholder
   */
  height?: number | string;
  
  /**
   * Border radius
   */
  borderRadius?: number;
  
  /**
   * Thumbnail source
   */
  thumbnail?: { uri: string } | number;
  
  /**
   * On play press
   */
  onPlay?: () => void;
}

/**
 * VideoPlaceholder Component
 * 
 * A placeholder component for video content.
 */
export const VideoPlaceholder = memo<VideoPlaceholderProps>(({
  width = '100%',
  height = 200,
  borderRadius = 8,
  thumbnail,
  onPlay,
  style,
  testID = 'video-placeholder',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();

  const containerStyle: ViewStyle = {
    width: width as DimensionValue,
    height: height as DimensionValue,
    borderRadius,
    backgroundColor: isDark ? colors.surface : '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  return (
    <View style={[containerStyle, style]} testID={testID} {...accessibilityProps}>
      {thumbnail && (
        <RNImage
          source={thumbnail}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          resizeMode="cover"
        />
      )}
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onTouchEnd={onPlay}
      >
        <Icon name="play-arrow" size={40} color="#FFFFFF" />
      </View>
    </View>
  );
});

VideoPlaceholder.displayName = 'VideoPlaceholder';
