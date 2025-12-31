// src/components/advanced/PickersAndViewers.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo, useRef, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

// ============================================================================
// FILE PICKER
// ============================================================================

export interface FileItem {
  name: string;
  size: number;
  type: string;
  uri: string;
}

export interface FilePickerProps extends BaseComponentProps, StyleProps {
  /**
   * Selected files
   */
  files: FileItem[];
  
  /**
   * On files selected
   */
  onFilesSelected: (files: FileItem[]) => void;
  
  /**
   * Allowed file types
   */
  allowedTypes?: string[];
  
  /**
   * Max file size (bytes)
   */
  maxFileSize?: number;
  
  /**
   * Max files
   */
  maxFiles?: number;
  
  /**
   * Multiple selection
   */
  multiple?: boolean;
}

/**
 * FilePicker Component
 * 
 * File/document picker.
 * Integrates with react-native-document-picker.
 */
export const FilePicker = memo<FilePickerProps>(({
  files,
  onFilesSelected,
  allowedTypes = ['*/*'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  multiple = true,
  style,
  testID = 'file-picker',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();

  const handlePickFile = async () => {
    // Integrate with react-native-document-picker
    console.log('File picker not implemented - install react-native-document-picker');
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesSelected(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return 'picture-as-pdf';
    if (type.includes('image')) return 'image';
    if (type.includes('video')) return 'videocam';
    if (type.includes('audio')) return 'audiotrack';
    return 'insert-drive-file';
  };

  const canAddMore = files.length < maxFiles;

  return (
    <View style={style} testID={testID} {...accessibilityProps}>
      {/* File list */}
      {files.map((file, index) => (
        <View
          key={index}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            backgroundColor: isDark ? colors.surface : '#F5F5F5',
            borderRadius: borderRadius.md,
            marginBottom: 8,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: `${colors.primary}20`,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}
          >
            <Icon name={getFileIcon(file.type)} size={24} color={colors.primary} />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: fontSize.sm,
                fontWeight: '500',
                color: colors.text,
              }}
              numberOfLines={1}
            >
              {file.name}
            </Text>
            <Text
              style={{
                fontSize: fontSize.xs,
                color: colors.textSecondary,
                marginTop: 2,
              }}
            >
              {formatFileSize(file.size)}
            </Text>
          </View>

          <TouchableOpacity onPress={() => removeFile(index)} style={{ padding: 8 }}>
            <Icon name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      ))}

      {/* Add button */}
      {canAddMore && (
        <Button
          title="Add Files"
          variant="outline"
          size="md"
          leftIcon="attach-file"
          onPress={handlePickFile}
          fullWidth
        />
      )}

      {/* Info */}
      <Text
        style={{
          fontSize: fontSize.xs,
          color: colors.textSecondary,
          marginTop: 8,
        }}
      >
        {files.length} / {maxFiles} files • Max {formatFileSize(maxFileSize)} per file
      </Text>
    </View>
  );
});

FilePicker.displayName = 'FilePicker';

// ============================================================================
// COLOR PICKER
// ============================================================================

export interface ColorPickerProps extends BaseComponentProps, StyleProps {
  /**
   * Selected color
   */
  color: string;
  
  /**
   * On color change
   */
  onChange: (color: string) => void;
  
  /**
   * Predefined colors
   */
  colors?: string[];
  
  /**
   * Show custom input
   */
  showInput?: boolean;
}

/**
 * ColorPicker Component
 * 
 * Simple color selection from predefined palette.
 */
export const ColorPicker = memo<ColorPickerProps>(({
  color,
  onChange,
  colors: colorPalette = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52B788', '#EF476F', '#118AB2',
  ],
  showInput = false,
  style,
  testID = 'color-picker',
  ...accessibilityProps
}) => {
  const { colors: themeColors } = useTheme();

  return (
    <View style={style} testID={testID} {...accessibilityProps}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {colorPalette.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => onChange(c)}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: c,
              borderWidth: color === c ? 3 : 0,
              borderColor: themeColors.primary,
            }}
          />
        ))}
      </View>

      {showInput && (
        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: fontSize.sm, color: themeColors.textSecondary, marginBottom: 8 }}>
            Custom Color (Hex)
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: themeColors.border,
              borderRadius: borderRadius.md,
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ fontSize: fontSize.md, color: themeColors.textSecondary }}>
              #
            </Text>
            <TextInput
              value={color.replace('#', '')}
              onChangeText={(text) => onChange(`#${text}`)}
              maxLength={6}
              keyboardType="default"
              style={{
                flex: 1,
                padding: 12,
                fontSize: fontSize.md,
                color: themeColors.text,
                backgroundColor: 'transparent',
              }}
              placeholderTextColor={themeColors.textSecondary}
            />
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: color,
                borderWidth: 1,
                borderColor: themeColors.border,
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
});

ColorPicker.displayName = 'ColorPicker';

// ============================================================================
// OTP INPUT
// ============================================================================

export interface OTPInputProps extends BaseComponentProps, StyleProps {
  /**
   * Number of digits
   */
  length?: number;
  
  /**
   * Current value
   */
  value: string;
  
  /**
   * On value change
   */
  onChange: (value: string) => void;
  
  /**
   * Secure entry (show dots)
   */
  secure?: boolean;
  
  /**
   * Auto focus
   */
  autoFocus?: boolean;
  
  /**
   * Error state
   */
  error?: boolean;
}

/**
 * OTPInput Component
 * 
 * OTP/PIN code input with individual boxes.
 */
export const OTPInput = memo<OTPInputProps>(({
  length = 6,
  value,
  onChange,
  secure = false,
  autoFocus = true,
  error = false,
  style,
  testID = 'otp-input',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();
  const inputRef = useRef<TextInput>(null);

  const digits = value.split('');
  const displayDigits = Array(length).fill('').map((_, i) => digits[i] || '');

  return (
    <View style={style} testID={testID} {...accessibilityProps}>
      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
        {displayDigits.map((digit, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => inputRef.current?.focus()}
            style={{
              width: 48,
              height: 56,
              borderWidth: 2,
              borderColor: error
                ? colors.error
                : digit
                ? colors.primary
                : colors.border,
              borderRadius: borderRadius.md,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.background,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: colors.text,
              }}
            >
              {secure && digit ? '•' : digit}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Hidden input for keyboard */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => {
          const newValue = text.replace(/[^0-9]/g, '').slice(0, length);
          onChange(newValue);
        }}
        keyboardType="number-pad"
        autoFocus={autoFocus}
        maxLength={length}
        style={{
          position: 'absolute',
          opacity: 0,
          width: 1,
          height: 1,
        }}
        caretHidden
      />
    </View>
  );
});

OTPInput.displayName = 'OTPInput';
