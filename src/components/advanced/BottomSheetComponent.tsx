
// src/components/advanced/BottomSheetComponent.tsx
import { useTheme } from '@/hooks/useTheme';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetFlatList,
    BottomSheetFooter,
    BottomSheetHandle,
    BottomSheetScrollView,
    BottomSheetTextInput,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo, useCallback, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../control/Button';
import { BaseComponentProps } from '../types/common';
import { borderRadius, fontSize } from '../utils/theme';

// ============================================================================
// BOTTOM SHEET COMPONENT
// ============================================================================

export interface BottomSheetComponentProps extends BaseComponentProps {
  /**
   * Bottom sheet visibility ref control
   */
  bottomSheetRef?: React.RefObject<BottomSheet | null>;
  
  /**
   * Snap points (percentages or pixel values)
   */
  snapPoints?: (string | number)[];
  
  /**
   * Initial snap index
   */
  initialSnapIndex?: number;
  
  /**
   * Enable dynamic sizing
   */
  enableDynamicSizing?: boolean;
  
  /**
   * Show backdrop
   */
  enableBackdrop?: boolean;
  
  /**
   * Backdrop dismisses sheet
   */
  backdropDismissible?: boolean;
  
  /**
   * Enable pan down to close
   */
  enablePanDownToClose?: boolean;
  
  /**
   * Show handle
   */
  showHandle?: boolean;
  
  /**
   * Title
   */
  title?: string;
  
  /**
   * Show close button
   */
  showCloseButton?: boolean;
  
  /**
   * On close handler
   */
  onClose?: () => void;
  
  /**
   * Content type
   */
  contentType?: 'view' | 'scrollView' | 'flatList';
  
  /**
   * Footer component
   */
  footer?: React.ReactNode;
  
  /**
   * Children content
   */
  children: React.ReactNode;
  
  /**
   * FlatList props (if contentType is 'flatList')
   */
  flatListProps?: any;
}

/**
 * BottomSheetComponent
 * 
 * Professional bottom sheet using @gorhom/bottom-sheet.
 * Supports dynamic sizing, gestures, and scrollable content.
 * 
 * @example
 * ```tsx
 * const bottomSheetRef = useRef<BottomSheet>(null);
 * 
 * <BottomSheetComponent
 *   bottomSheetRef={bottomSheetRef}
 *   snapPoints={['25%', '50%', '90%']}
 *   title="Select Option"
 *   showCloseButton
 *   onClose={() => bottomSheetRef.current?.close()}
 * >
 *   <View>Content here</View>
 * </BottomSheetComponent>
 * ```
 */
export const BottomSheetComponent = memo<BottomSheetComponentProps>(({
  bottomSheetRef,
  snapPoints = ['25%', '50%', '90%'],
  initialSnapIndex = 0,
  enableDynamicSizing = false,
  enableBackdrop = true,
  backdropDismissible = true,
  enablePanDownToClose = true,
  showHandle = true,
  title,
  showCloseButton = false,
  onClose,
  contentType = 'scrollView',
  footer,
  children,
  flatListProps,
  testID = 'bottom-sheet',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const internalRef = useRef<BottomSheet>(null);
  const sheetRef = bottomSheetRef || internalRef;

  // For dynamic sizing in v5, use enableDynamicSizing prop
  // and 'CONTENT_HEIGHT' in snapPoints array

  // Backdrop component
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior={backdropDismissible ? 'close' : 'none'}
      />
    ),
    [backdropDismissible]
  );

  // Custom handle with title
  const renderHandle = useCallback(
    (props: any) => (
      <BottomSheetHandle
        {...props}
        style={[
          styles.handleContainer,
          { backgroundColor: isDark ? colors.surface : '#FFFFFF' },
        ]}
      >
        {(title || showCloseButton) && (
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              {title && (
                <Text style={[styles.title, { color: colors.text }]}>
                  {title}
                </Text>
              )}
            </View>
            {showCloseButton && (
              <TouchableOpacity
                onPress={() => {
                  sheetRef.current?.close();
                  onClose?.();
                }}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </BottomSheetHandle>
    ),
    [title, showCloseButton, colors, isDark, onClose]
  );

  // Footer component
  const renderFooter = useCallback(
    (props: any) => {
      if (!footer) return null;
      return (
        <BottomSheetFooter {...props} bottomInset={0}>
          <View
            style={[
              styles.footer,
              { backgroundColor: isDark ? colors.surface : '#FFFFFF' },
            ]}
          >
            {footer}
          </View>
        </BottomSheetFooter>
      );
    },
    [footer, colors, isDark]
  );

  // Content renderer based on type
  const renderContent = () => {
    const contentStyle = {
      backgroundColor: isDark ? colors.surface : '#FFFFFF',
    };

    switch (contentType) {
      case 'view':
        return (
          <BottomSheetView style={contentStyle}>
            {children}
          </BottomSheetView>
        );

      case 'flatList':
        return (
          <BottomSheetFlatList
            {...flatListProps}
            contentContainerStyle={[styles.contentContainer, contentStyle]}
          />
        );

      case 'scrollView':
      default:
        return (
          <BottomSheetScrollView
            contentContainerStyle={[styles.contentContainer, contentStyle]}
          >
            {children}
          </BottomSheetScrollView>
        );
    }
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={initialSnapIndex}
      snapPoints={enableDynamicSizing ? ['CONTENT_HEIGHT'] : snapPoints}
      enableDynamicSizing={enableDynamicSizing}
      enablePanDownToClose={enablePanDownToClose}
      backdropComponent={enableBackdrop ? renderBackdrop : undefined}
      handleComponent={showHandle ? renderHandle : undefined}
      footerComponent={renderFooter}
      backgroundStyle={{
        backgroundColor: isDark ? colors.surface : '#FFFFFF',
      }}
      handleIndicatorStyle={{
        backgroundColor: colors.border,
      }}
    >
      {renderContent()}
    </BottomSheet>
  );
});

BottomSheetComponent.displayName = 'BottomSheetComponent';

const styles = StyleSheet.create({
  handleContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  contentContainer: {
    padding: 16,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});

// ============================================================================
// PRE-BUILT BOTTOM SHEET VARIANTS
// ============================================================================

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

/**
 * FormBottomSheet - For forms with footer buttons
 */
export interface FormBottomSheetProps extends Omit<BottomSheetComponentProps, 'footer'> {
  primaryButtonText: string;
  onPrimaryPress: () => void;
  secondaryButtonText?: string;
  onSecondaryPress?: () => void;
  primaryButtonDisabled?: boolean;
}

export const FormBottomSheet = memo<FormBottomSheetProps>(({
  primaryButtonText,
  onPrimaryPress,
  secondaryButtonText,
  onSecondaryPress,
  primaryButtonDisabled = false,
  children,
  ...props
}) => {
  const footer = (
    <View style={{ gap: 12 }}>
      <Button
        title={primaryButtonText}
        variant="primary"
        size="md"
        onPress={onPrimaryPress}
        disabled={primaryButtonDisabled}
        fullWidth
      />
      {secondaryButtonText && (
        <Button
          title={secondaryButtonText}
          variant="outline"
          size="md"
          onPress={onSecondaryPress}
          fullWidth
        />
      )}
    </View>
  );

  return (
    <BottomSheetComponent {...props} footer={footer}>
      {children}
    </BottomSheetComponent>
  );
});

FormBottomSheet.displayName = 'FormBottomSheet';

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
