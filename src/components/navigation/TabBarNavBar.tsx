// src/components/navigation/TabBarNavBar.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Badge } from '../informative/Badge';
import { BaseComponentProps, StyleProps } from '../types/common';
import { fontSize, shadows } from '../utils/theme';

// ============================================================================
// TAB BAR
// ============================================================================

export interface TabBarItem {
  key: string;
  icon: string;
  label: string;
  badge?: number;
  onPress: () => void;
}

export interface TabBarProps extends BaseComponentProps, StyleProps {
  /**
   * Tab items
   */
  items: TabBarItem[];
  
  /**
   * Active tab key
   */
  activeKey: string;
  
  /**
   * Show labels
   */
  showLabels?: boolean;
}

/**
 * TabBar Component
 * 
 * Bottom tab bar navigation.
 */
export const TabBar = memo<TabBarProps>(({
  items,
  activeKey,
  showLabels = true,
  style,
  testID = 'tab-bar',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    backgroundColor: isDark ? colors.surface : '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 8,
    paddingTop: 8,
    ...shadows.lg,
  };

  return (
    <View style={[containerStyle, style]} testID={testID} {...accessibilityProps}>
      {items.map((item) => {
        const isActive = item.key === activeKey;
        
        return (
          <TouchableOpacity
            key={item.key}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 8,
            }}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={{ position: 'relative' }}>
              <Icon
                name={item.icon as any}
                size={24}
                color={isActive ? colors.primary : colors.textSecondary}
              />
              {item.badge && item.badge > 0 && (
                <View style={{ position: 'absolute', top: -8, right: -8 }}>
                  <Badge type="dot" size="sm" color={colors.error} />
                </View>
              )}
            </View>
            {showLabels && (
              <Text
                style={{
                  fontSize: fontSize.xs,
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? colors.primary : colors.textSecondary,
                  marginTop: 4,
                }}
              >
                {item.label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

TabBar.displayName = 'TabBar';

// ============================================================================
// NAV BAR
// ============================================================================

export interface NavBarProps extends BaseComponentProps, StyleProps {
  /**
   * Page title
   */
  title: string;
  
  /**
   * Left control (back button, cancel, etc)
   */
  leftControl?: {
    icon?: string;
    text?: string;
    onPress: () => void;
  };
  
  /**
   * Right control (save, edit, icon, etc)
   */
  rightControl?: {
    icon?: string;
    text?: string;
    onPress: () => void;
  };
  
  /**
   * Show border
   */
  showBorder?: boolean;
  
  /**
   * Transparent background
   */
  transparent?: boolean;
}

/**
 * NavBar Component
 * 
 * Top navigation bar with title and controls.
 */
export const NavBar = memo<NavBarProps>(({
  title,
  leftControl,
  rightControl,
  showBorder = true,
  transparent = false,
  style,
  testID = 'nav-bar',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: transparent ? 'transparent' : (isDark ? colors.surface : '#FFFFFF'),
    borderBottomWidth: showBorder && !transparent ? 1 : 0,
    borderBottomColor: colors.border,
    minHeight: 56,
  };

  const renderControl = (control: typeof leftControl | typeof rightControl) => {
    if (!control) return <View style={{ width: 60 }} />;

    return (
      <TouchableOpacity
        onPress={control.onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 8,
          minWidth: 60,
        }}
        activeOpacity={0.7}
      >
        {control.icon && (
          <Icon name={control.icon as any} size={24} color={colors.primary} />
        )}
        {control.text && (
          <Text
            style={{
              fontSize: fontSize.md,
              color: colors.primary,
              fontWeight: '500',
              marginLeft: control.icon ? 4 : 0,
            }}
          >
            {control.text}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[containerStyle, style]} testID={testID} {...accessibilityProps}>
      {renderControl(leftControl)}
      
      <Text
        style={{
          fontSize: fontSize.lg,
          fontWeight: '600',
          color: colors.text,
          flex: 1,
          textAlign: 'center',
        }}
        numberOfLines={1}
      >
        {title}
      </Text>
      
      {renderControl(rightControl)}
    </View>
  );
});

NavBar.displayName = 'NavBar';
