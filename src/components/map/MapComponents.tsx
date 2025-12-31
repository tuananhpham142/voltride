// src/components/map/MapComponents.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize, shadows } from '../utils/theme';

// ============================================================================
// MAP
// ============================================================================

export interface MapProps extends BaseComponentProps, StyleProps {
  /**
   * Map center coordinates
   */
  center?: {
    latitude: number;
    longitude: number;
  };
  
  /**
   * Zoom level
   */
  zoom?: number;
  
  /**
   * Map height
   */
  height?: number;
  
  /**
   * On map press
   */
  onPress?: (coords: { latitude: number; longitude: number }) => void;
  
  /**
   * Children (markers, overlays)
   */
  children?: React.ReactNode;
}

/**
 * Map Component
 * 
 * Map display wrapper (placeholder - integrate with react-native-maps).
 */
export const Map = memo<MapProps>(({
  center = { latitude: 37.78825, longitude: -122.4324 },
  zoom = 13,
  height = 300,
  onPress,
  children,
  style,
  testID = 'map',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();

  // This is a placeholder - integrate with react-native-maps for production
  return (
    <View
      style={[
        {
          height,
          backgroundColor: isDark ? '#2A2A2A' : '#E0E0E0',
          borderRadius: borderRadius.lg,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
      testID={testID}
      {...accessibilityProps}
    >
      <Icon name="map" size={64} color={colors.textSecondary} />
      <Text
        style={{
          marginTop: 16,
          fontSize: fontSize.md,
          color: colors.textSecondary,
          textAlign: 'center',
        }}
      >
        Map Component
      </Text>
      <Text
        style={{
          marginTop: 4,
          fontSize: fontSize.sm,
          color: colors.textSecondary,
          textAlign: 'center',
        }}
      >
        Lat: {center.latitude.toFixed(4)}, Lng: {center.longitude.toFixed(4)}
      </Text>
      {children}
    </View>
  );
});

Map.displayName = 'Map';

// ============================================================================
// LOCATION PIN
// ============================================================================

export interface LocationPinProps extends BaseComponentProps, StyleProps {
  /**
   * Pin title
   */
  title: string;
  
  /**
   * Pin description
   */
  description?: string;
  
  /**
   * Pin coordinates
   */
  coordinate: {
    latitude: number;
    longitude: number;
  };
  
  /**
   * Pin color
   */
  color?: string;
  
  /**
   * Pin size
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * On press handler
   */
  onPress?: () => void;
  
  /**
   * Custom icon
   */
  icon?: string;
}

const pinSizes = {
  sm: 24,
  md: 32,
  lg: 40,
};

/**
 * LocationPin Component
 * 
 * Map marker/pin with info.
 */
export const LocationPin = memo<LocationPinProps>(({
  title,
  description,
  coordinate,
  color,
  size = 'md',
  onPress,
  icon = 'place',
  style,
  testID = 'location-pin',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();
  const pinColor = color || colors.error;
  const pinSize = pinSizes[size];

  return (
    <TouchableOpacity
      style={[
        {
          alignItems: 'center',
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
      testID={testID}
      {...accessibilityProps}
    >
      <View
        style={{
          backgroundColor: '#FFFFFF',
          padding: 8,
          borderRadius: borderRadius.md,
          ...shadows.md,
          marginBottom: 4,
        }}
      >
        <Text style={{ fontSize: fontSize.xs, fontWeight: '600', color: colors.text }}>
          {title}
        </Text>
        {description && (
          <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>
            {description}
          </Text>
        )}
      </View>
      
      <Icon name={icon as any} size={pinSize} color={pinColor} />
    </TouchableOpacity>
  );
});

LocationPin.displayName = 'LocationPin';

// ============================================================================
// SHOPPING CART ITEM (Commerce)
// ============================================================================

export interface ShoppingCartItemProps extends BaseComponentProps, StyleProps {
  /**
   * Product name
   */
  name: string;
  
  /**
   * Product price
   */
  price: number;
  
  /**
   * Product quantity
   */
  quantity: number;
  
  /**
   * Product image
   */
  image?: string;
  
  /**
   * Product variant (e.g., "Size: M, Color: Red")
   */
  variant?: string;
  
  /**
   * On quantity increase
   */
  onIncreaseQuantity: () => void;
  
  /**
   * On quantity decrease
   */
  onDecreaseQuantity: () => void;
  
  /**
   * On remove item
   */
  onRemove: () => void;
  
  /**
   * Currency symbol
   */
  currency?: string;
  
  /**
   * Max quantity
   */
  maxQuantity?: number;
}

/**
 * ShoppingCartItem Component
 * 
 * Cart item with quantity controls.
 */
export const ShoppingCartItem = memo<ShoppingCartItemProps>(({
  name,
  price,
  quantity,
  image,
  variant,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemove,
  currency = '$',
  maxQuantity = 99,
  style,
  testID = 'shopping-cart-item',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();

  const subtotal = price * quantity;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          padding: 16,
          backgroundColor: isDark ? colors.surface : '#FFFFFF',
          borderRadius: borderRadius.lg,
          gap: 12,
        },
        style,
      ]}
      testID={testID}
      {...accessibilityProps}
    >
      {/* Product Image */}
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: borderRadius.md,
          backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
          overflow: 'hidden',
        }}
      >
        {image ? (
          <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="image" size={32} color={colors.border} />
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            style={{
              fontSize: fontSize.md,
              fontWeight: '600',
              color: colors.text,
              flex: 1,
            }}
            numberOfLines={2}
          >
            {name}
          </Text>
          <TouchableOpacity onPress={onRemove} style={{ padding: 4, marginLeft: 8 }}>
            <Icon name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {variant && (
          <Text
            style={{
              fontSize: fontSize.sm,
              color: colors.textSecondary,
              marginTop: 4,
            }}
          >
            {variant}
          </Text>
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 12,
          }}
        >
          {/* Price */}
          <View>
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
              {currency}{price.toFixed(2)} each
            </Text>
            <Text
              style={{
                fontSize: fontSize.lg,
                fontWeight: '700',
                color: colors.primary,
                marginTop: 2,
              }}
            >
              {currency}{subtotal.toFixed(2)}
            </Text>
          </View>

          {/* Quantity Controls */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
              overflow: 'hidden',
            }}
          >
            <TouchableOpacity
              onPress={onDecreaseQuantity}
              disabled={quantity <= 1}
              style={{
                padding: 8,
                backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
              }}
            >
              <Icon
                name="remove"
                size={18}
                color={quantity <= 1 ? colors.border : colors.text}
              />
            </TouchableOpacity>

            <Text
              style={{
                paddingHorizontal: 16,
                fontSize: fontSize.md,
                fontWeight: '600',
                color: colors.text,
                minWidth: 40,
                textAlign: 'center',
              }}
            >
              {quantity}
            </Text>

            <TouchableOpacity
              onPress={onIncreaseQuantity}
              disabled={quantity >= maxQuantity}
              style={{
                padding: 8,
                backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
              }}
            >
              <Icon
                name="add"
                size={18}
                color={quantity >= maxQuantity ? colors.border : colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
});

ShoppingCartItem.displayName = 'ShoppingCartItem';
