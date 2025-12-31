
// src/components/control/SwitcherTabsSheet.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { Modal, ScrollView, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { Badge } from '../informative/Badge';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize } from '../utils/theme';

// ============================================================================
// CONTENT SWITCHER
// ============================================================================

export interface ContentSwitcherItem {
  key: string;
  title: string;
}

export interface ContentSwitcherProps extends BaseComponentProps, StyleProps {
  /**
   * Switcher items
   */
  items: ContentSwitcherItem[];
  
  /**
   * Selected item key
   */
  selectedKey: string;
  
  /**
   * On selection change
   */
  onChange: (key: string) => void;
}

/**
 * ContentSwitcher Component
 * 
 * Switches between 2-4 content sections.
 */
export const ContentSwitcher = memo<ContentSwitcherProps>(({
  items,
  selectedKey,
  onChange,
  style,
  testID = 'content-switcher',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    backgroundColor: isDark ? colors.surface : '#F5F5F5',
    borderRadius: borderRadius.lg,
    padding: 4,
  };

  const itemStyle = (isSelected: boolean): ViewStyle => ({
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    backgroundColor: isSelected ? (isDark ? colors.primary : '#FFFFFF') : 'transparent',
    alignItems: 'center',
  });

  const textStyle = (isSelected: boolean): TextStyle => ({
    fontSize: fontSize.sm,
    fontWeight: isSelected ? '600' : '500',
    color: isSelected ? (isDark ? '#FFFFFF' : colors.primary) : colors.textSecondary,
  });

  return (
    <View style={[containerStyle, style]} testID={testID} {...accessibilityProps}>
      {items.map((item) => {
        const isSelected = item.key === selectedKey;
        return (
          <TouchableOpacity
            key={item.key}
            style={itemStyle(isSelected)}
            onPress={() => onChange(item.key)}
            activeOpacity={0.7}
          >
            <Text style={textStyle(isSelected)}>{item.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

ContentSwitcher.displayName = 'ContentSwitcher';

// ============================================================================
// TABS
// ============================================================================

export interface TabItem {
  key: string;
  title: string;
  badge?: number;
}

export interface TabsProps extends BaseComponentProps, StyleProps {
  /**
   * Tab items
   */
  items: TabItem[];
  
  /**
   * Selected tab key
   */
  selectedKey: string;
  
  /**
   * On tab change
   */
  onChange: (key: string) => void;
  
  /**
   * Scrollable tabs
   */
  scrollable?: boolean;
}

/**
 * Tabs Component
 * 
 * Horizontal tab navigation.
 */
export const Tabs = memo<TabsProps>(({
  items,
  selectedKey,
  onChange,
  scrollable = false,
  style,
  testID = 'tabs',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();

  const containerStyle: ViewStyle = {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  };

  const tabStyle = (isSelected: boolean): ViewStyle => ({
    paddingVertical: 16,
    paddingHorizontal: scrollable ? 20 : 16,
    borderBottomWidth: 2,
    borderBottomColor: isSelected ? colors.primary : 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  });

  const textStyle = (isSelected: boolean): TextStyle => ({
    fontSize: fontSize.md,
    fontWeight: isSelected ? '600' : '500',
    color: isSelected ? colors.primary : colors.textSecondary,
  });

  const content = (
    <View style={[containerStyle, style]} testID={testID} {...accessibilityProps}>
      {items.map((item) => {
        const isSelected = item.key === selectedKey;
        return (
          <TouchableOpacity
            key={item.key}
            style={tabStyle(isSelected)}
            onPress={() => onChange(item.key)}
            activeOpacity={0.7}
          >
            <Text style={textStyle(isSelected)}>{item.title}</Text>
            {item.badge && item.badge > 0 && (
              <Badge type="number" content={item.badge} size="sm" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: 'row' }}
      >
        {content}
      </ScrollView>
    );
  }

  return <View style={{ flexDirection: 'row' }}>{content}</View>;
});

Tabs.displayName = 'Tabs';

// ============================================================================
// ACTION SHEET
// ============================================================================

export interface ActionSheetItem {
  key: string;
  title: string;
  icon?: string;
  destructive?: boolean;
  onPress: () => void;
}

export interface ActionSheetProps extends BaseComponentProps, StyleProps {
  /**
   * Sheet visibility
   */
  visible: boolean;
  
  /**
   * Sheet title
   */
  title?: string;
  
  /**
   * Action items
   */
  items: ActionSheetItem[];
  
  /**
   * On dismiss
   */
  onDismiss: () => void;
  
  /**
   * Cancel button text
   */
  cancelText?: string;
}

/**
 * ActionSheet Component
 * 
 * Bottom action sheet menu.
 */
export const ActionSheet = memo<ActionSheetProps>(({
  visible,
  title,
  items,
  onDismiss,
  cancelText = 'Cancel',
  style,
  testID = 'action-sheet',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const translateY = useSharedValue(500);

  React.useEffect(() => {
    translateY.value = withSpring(visible ? 0 : 500, { damping: 20 });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleItemPress = (item: ActionSheetItem) => {
    item.onPress();
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={onDismiss}
          activeOpacity={1}
        />

        <Animated.View
          style={[
            {
              backgroundColor: isDark ? colors.surface : '#FFFFFF',
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xl,
              paddingBottom: 34,
            },
            animatedStyle,
            style,
          ]}
          testID={testID}
          {...accessibilityProps}
        >
          {title && (
            <View
              style={{
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: fontSize.lg,
                  fontWeight: '600',
                  color: colors.text,
                  textAlign: 'center',
                }}
              >
                {title}
              </Text>
            </View>
          )}

          <ScrollView style={{ maxHeight: 400 }}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.7}
              >
                {item.icon && (
                  <Icon
                    name={item.icon  as any}
                    size={24}
                    color={item.destructive ? colors.error : colors.text}
                    style={{ marginRight: 16 }}
                  />
                )}
                <Text
                  style={{
                    fontSize: fontSize.md,
                    color: item.destructive ? colors.error : colors.text,
                    flex: 1,
                  }}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={{
              padding: 16,
              marginTop: 8,
              marginHorizontal: 16,
              borderRadius: borderRadius.lg,
              backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
              alignItems: 'center',
            }}
            onPress={onDismiss}
            activeOpacity={0.7}
          >
            <Text
              style={{
                fontSize: fontSize.md,
                fontWeight: '600',
                color: colors.primary,
              }}
            >
              {cancelText}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
});

ActionSheet.displayName = 'ActionSheet';

// ============================================================================
// FILTER
// ============================================================================

export interface FilterProps extends BaseComponentProps, StyleProps {
  /**
   * Filter label
   */
  label: string;
  
  /**
   * Active filter count
   */
  count?: number;
  
  /**
   * On press handler
   */
  onPress: () => void;
  
  /**
   * Active state
   */
  active?: boolean;
}

/**
 * Filter Component
 * 
 * Filter button with count badge.
 */
export const Filter = memo<FilterProps>(({
  label,
  count = 0,
  onPress,
  active = false,
  style,
  testID = 'filter',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: active ? colors.primary : colors.border,
    backgroundColor: active ? `${colors.primary}10` : 'transparent',
    gap: 8,
  };

  return (
    <TouchableOpacity
      style={[containerStyle, style]}
      onPress={onPress}
      activeOpacity={0.7}
      testID={testID}
      {...accessibilityProps}
    >
      <Icon
        name="filter-list"
        size={18}
        color={active ? colors.primary : colors.textSecondary}
      />
      <Text
        style={{
          fontSize: fontSize.sm,
          fontWeight: '500',
          color: active ? colors.primary : colors.text,
        }}
      >
        {label}
      </Text>
      {count > 0 && (
        <Badge type="number" content={count} size="sm" color={colors.primary} />
      )}
      <Icon
        name="keyboard-arrow-down"
        size={18}
        color={active ? colors.primary : colors.textSecondary}
      />
    </TouchableOpacity>
  );
});

Filter.displayName = 'Filter';
