
// src/components/advanced/BottomSheetComponent.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BottomSheetComponent, BottomSheetComponentProps } from './BottomSheetComponent';

/**
 * ListBottomSheet - For selecting from a list of options
 */
export interface ListBottomSheetProps extends Omit<BottomSheetComponentProps, 'children' | 'contentType'> {
  items: Array<{
    key: string;
    title: string;
    subtitle?: string;
    icon?: string;
    onPress: () => void;
  }>;
}

export const ListBottomSheet = memo<ListBottomSheetProps>(({ items, ...props }) => {
  const { colors } = useTheme();

  return (
    <BottomSheetComponent {...props} contentType="scrollView">
      <View>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.key}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderBottomWidth: index < items.length - 1 ? 1 : 0,
              borderBottomColor: colors.border,
            }}
            onPress={() => {
              item.onPress();
              props.onClose?.();
            }}
            activeOpacity={0.7}
          >
            {item.icon && (
              <Icon
                name={item.icon as any}
                size={24}
                color={colors.text}
                style={{ marginRight: 16 }}
              />
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '500', color: colors.text }}>
                {item.title}
              </Text>
              {item.subtitle && (
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    marginTop: 2,
                  }}
                >
                  {item.subtitle}
                </Text>
              )}
            </View>
            <Icon name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </BottomSheetComponent>
  );
});

ListBottomSheet.displayName = 'ListBottomSheet';
