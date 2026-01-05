import { useTheme } from '@/hooks/useTheme';
import React, { memo, useState } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { BaseComponentProps, StyleProps } from '../types/common';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================================================
// CAROUSEL
// ============================================================================

export interface CarouselProps extends BaseComponentProps, StyleProps {
  /**
   * Carousel items
   */
  data: any[];
  
  /**
   * Render item
   */
  renderItem: (item: any, index: number) => React.ReactNode;
  
  /**
   * Item width
   */
  itemWidth?: number;
  
  /**
   * Show pagination
   */
  showPagination?: boolean;
  
  /**
   * Auto play
   */
  autoPlay?: boolean;
  
  /**
   * Auto play interval
   */
  autoPlayInterval?: number;
  
  /**
   * On change index
   */
  onIndexChange?: (index: number) => void;
}

/**
 * Carousel Component
 * 
 * Horizontal scrollable carousel with pagination.
 */
export const Carousel = memo<CarouselProps>(({
  data,
  renderItem,
  itemWidth = SCREEN_WIDTH - 40,
  showPagination = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  onIndexChange,
  style,
  testID = 'carousel',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    if (autoPlay && data.length > 1) {
      const interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % data.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * (itemWidth + 16),
          animated: true,
        });
        setCurrentIndex(nextIndex);
        onIndexChange?.(nextIndex);
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [autoPlay, currentIndex, data.length]);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (itemWidth + 16));
    if (index !== currentIndex) {
      setCurrentIndex(index);
      onIndexChange?.(index);
    }
  };

  return (
    <View style={style} testID={testID} {...accessibilityProps}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth + 16}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: (SCREEN_WIDTH - itemWidth) / 2,
        }}
      >
        {data.map((item, index) => (
          <View
            key={index}
            style={{
              width: itemWidth,
              marginHorizontal: 8,
            }}
          >
            {renderItem(item, index)}
          </View>
        ))}
      </ScrollView>

      {/* Pagination */}
      {showPagination && data.length > 1 && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 16,
            gap: 8,
          }}
        >
          {data.map((_, index) => (
            <View
              key={index}
              style={{
                width: index === currentIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: index === currentIndex ? colors.primary : colors.border,
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
});

Carousel.displayName = 'Carousel';