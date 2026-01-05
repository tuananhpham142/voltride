// src/components/content/ImageGrid.tsx

import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import Text from './Text';

const { width: screenWidth } = Dimensions.get('window');

export interface ImageGridProps {
  images: string[];
  columns?: number;
  gap?: number;
  aspectRatio?: number;
  onImagePress?: (index: number) => void;
  onImageLongPress?: (index: number) => void;
  style?: ViewStyle;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  columns = 3,
  gap = 8,
  aspectRatio = 1,
  onImagePress,
  onImageLongPress,
  style,
}) => {
  const { colors } = useTheme();

  if (!images || images.length === 0) {
    return null;
  }

  // Calculate image size based on screen width, columns, and gaps
  const totalGaps = gap * (columns + 1);
  const availableWidth = screenWidth - 32; // Account for container padding
  const imageSize = (availableWidth - totalGaps) / columns;

  const renderImage = (uri: string, index: number) => {
    const handlePress = () => onImagePress?.(index);
    const handleLongPress = () => onImageLongPress?.(index);

    return (
      <TouchableOpacity
        key={`${uri}-${index}`}
        onPress={handlePress}
        onLongPress={handleLongPress}
        disabled={!onImagePress && !onImageLongPress}
        style={[
          styles.imageContainer,
          {
            width: imageSize,
            height: imageSize * aspectRatio,
            marginRight: (index + 1) % columns === 0 ? 0 : gap,
            marginBottom: gap,
          },
        ]}
      >
        <Image
          source={{ uri }}
          style={[
            styles.image,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          resizeMode="cover"
        />
        
        {/* Image number badge */}
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={styles.badgeText}>{index + 1}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.grid}>{images.map(renderImage)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default ImageGrid;
