// src/components/advanced/PickersAndViewers.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../control/Button';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize } from '../utils/theme';

/**
 * For production image picking, install:
 * npm install react-native-image-picker
 * 
 * For document picking:
 * npm install react-native-document-picker
 */



// ============================================================================
// IMAGE PICKER
// ============================================================================

export interface ImagePickerProps extends BaseComponentProps, StyleProps {
  /**
   * Selected images
   */
  images: string[];
  
  /**
   * On images selected
   */
  onImagesSelected: (images: string[]) => void;
  
  /**
   * Max images
   */
  maxImages?: number;
  
  /**
   * Allow multiple selection
   */
  multiple?: boolean;
  
  /**
   * Show camera option
   */
  showCamera?: boolean;
  
  /**
   * Show gallery option
   */
  showGallery?: boolean;
  
  /**
   * Image quality (0-1)
   */
  quality?: number;
  
  /**
   * Max width
   */
  maxWidth?: number;
  
  /**
   * Max height
   */
  maxHeight?: number;
}

/**
 * ImagePicker Component
 * 
 * Image selection with camera and gallery options.
 * Integrates with react-native-image-picker.
 */
export const ImagePicker = memo<ImagePickerProps>(({
  images,
  onImagesSelected,
  maxImages = 5,
  multiple = true,
  showCamera = true,
  showGallery = true,
  quality = 0.8,
  maxWidth = 1920,
  maxHeight = 1920,
  style,
  testID = 'image-picker',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const [showOptions, setShowOptions] = useState(false);

  const handleCameraPress = async () => {
    setShowOptions(false);
    // Integrate with react-native-image-picker
    // const result = await launchCamera({ ... });
    console.log('Camera not implemented - install react-native-image-picker');
  };

  const handleGalleryPress = async () => {
    setShowOptions(false);
    // Integrate with react-native-image-picker
    // const result = await launchImageLibrary({ ... });
    console.log('Gallery not implemented - install react-native-image-picker');
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesSelected(newImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <View style={style} testID={testID} {...accessibilityProps}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {/* Selected images */}
          {images.map((uri, index) => (
            <View key={index} style={{ position: 'relative' }}>
              <Image
                source={{ uri }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: borderRadius.md,
                  backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
                }}
              />
              <TouchableOpacity
                onPress={() => removeImage(index)}
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: colors.error,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon name="close" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Add button */}
          {canAddMore && (
            <TouchableOpacity
              onPress={() => setShowOptions(true)}
              style={{
                width: 100,
                height: 100,
                borderRadius: borderRadius.md,
                borderWidth: 2,
                borderColor: colors.border,
                borderStyle: 'dashed',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: isDark ? colors.surface : '#FFFFFF',
              }}
            >
              <Icon name="add-a-photo" size={32} color={colors.textSecondary} />
              <Text
                style={{
                  fontSize: fontSize.xs,
                  color: colors.textSecondary,
                  marginTop: 4,
                }}
              >
                Add Photo
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Options */}
      {showOptions && (
        <View
          style={{
            marginTop: 12,
            flexDirection: 'row',
            gap: 12,
          }}
        >
          {showCamera && (
            <Button
              title="Camera"
              variant="outline"
              size="sm"
              leftIcon="camera-alt"
              onPress={handleCameraPress}
              style={{ flex: 1 }}
            />
          )}
          {showGallery && (
            <Button
              title="Gallery"
              variant="outline"
              size="sm"
              leftIcon="photo-library"
              onPress={handleGalleryPress}
              style={{ flex: 1 }}
            />
          )}
        </View>
      )}

      {/* Counter */}
      <Text
        style={{
          fontSize: fontSize.xs,
          color: colors.textSecondary,
          marginTop: 8,
        }}
      >
        {images.length} / {maxImages} images selected
      </Text>
    </View>
  );
});

ImagePicker.displayName = 'ImagePicker';