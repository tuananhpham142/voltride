// src/components/advanced/FilePicker.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../control/Button';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize } from '../utils/theme';

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


