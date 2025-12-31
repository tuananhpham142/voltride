// src/components/advanced/BottomSheetComponent.tsx
import { useTheme } from '@/hooks/useTheme';
import {
    BottomSheetTextInput
} from '@gorhom/bottom-sheet';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { borderRadius, fontSize } from '../utils/theme';
import { BottomSheetComponent, BottomSheetComponentProps } from './BottomSheetComponent';

/**
 * SearchBottomSheet - With search input
 */
export interface SearchBottomSheetProps extends Omit<BottomSheetComponentProps, 'children'> {
  searchValue: string;
  onSearchChange: (text: string) => void;
  searchPlaceholder?: string;
  children: React.ReactNode;
}

export const SearchBottomSheet = memo<SearchBottomSheetProps>(({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  children,
  ...props
}) => {
  const { colors, isDark } = useTheme();

  return (
    <BottomSheetComponent {...props}>
      <View style={{ marginBottom: 16 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
            borderRadius: borderRadius.md,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <Icon name="search" size={20} color={colors.textSecondary} />
          <BottomSheetTextInput
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
            placeholderTextColor={colors.textSecondary}
            style={{
              flex: 1,
              fontSize: fontSize.md,
              color: colors.text,
              marginLeft: 8,
              paddingVertical: 0,
            }}
          />
          {searchValue.length > 0 && (
            <TouchableOpacity onPress={() => onSearchChange('')}>
              <Icon name="close" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {children}
    </BottomSheetComponent>
  );
});

SearchBottomSheet.displayName = 'SearchBottomSheet';
