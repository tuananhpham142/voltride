// src/components/extra/MenuAndPopup.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo, useRef, useState } from 'react';
import { Modal, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize, shadows } from '../utils/theme';

/**
 * For drawer, you can use:
 * npm install react-native-drawer-layout
 * 
 * For better menu positioning:
 * npm install react-native-portal
 */

// ============================================================================
// POPUP MENU / CONTEXT MENU
// ============================================================================

export interface PopupMenuItem {
  key: string;
  title: string;
  icon?: string;
  destructive?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export interface PopupMenuProps extends BaseComponentProps, StyleProps {
  /**
   * Menu items
   */
  items: PopupMenuItem[];
  
  /**
   * Trigger component
   */
  children: React.ReactNode;
  
  /**
   * Menu position
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  
  /**
   * Show on long press
   */
  longPress?: boolean;
}

/**
 * PopupMenu Component
 * 
 * Context menu that appears on press/long-press.
 */
export const PopupMenu = memo<PopupMenuProps>(({
  items,
  children,
  position = 'bottom-right',
  longPress = false,
  style,
  testID = 'popup-menu',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const [visible, setVisible] = useState(false);
  const [menuLayout, setMenuLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const buttonRef = useRef<any>(null);

  const handlePress = () => {
    if (!longPress) {
      buttonRef.current?.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        setMenuLayout({ x: pageX, y: pageY, width, height });
        setVisible(true);
      });
    }
  };

  const handleLongPress = () => {
    if (longPress) {
      buttonRef.current?.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        setMenuLayout({ x: pageX, y: pageY, width, height });
        setVisible(true);
      });
    }
  };

  const handleItemPress = (item: PopupMenuItem) => {
    setVisible(false);
    item.onPress();
  };

  const getMenuPosition = (): ViewStyle => {
    const menuWidth = 200;
    const menuMaxHeight = 400;

    switch (position) {
      case 'top-left':
        return {
          bottom: menuLayout.height,
          right: 0,
        };
      case 'top-right':
        return {
          bottom: menuLayout.height,
          left: 0,
        };
      case 'bottom-left':
        return {
          top: menuLayout.height,
          right: 0,
        };
      case 'bottom-right':
      default:
        return {
          top: menuLayout.height,
          left: 0,
        };
    }
  };

  return (
    <View style={style} testID={testID} {...accessibilityProps}>
      <TouchableOpacity
        ref={buttonRef}
        onPress={handlePress}
        onLongPress={handleLongPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View
            style={{
              position: 'absolute',
              left: menuLayout.x,
              top: menuLayout.y,
            }}
          >
            <View style={getMenuPosition()}>
              <Animated.View
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={{
                  backgroundColor: isDark ? colors.surface : '#FFFFFF',
                  borderRadius: borderRadius.md,
                  minWidth: 200,
                  ...shadows.lg,
                }}
              >
                {items.map((item, index) => (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => handleItemPress(item)}
                    disabled={item.disabled}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 12,
                      paddingHorizontal: 16,
                      borderBottomWidth: index < items.length - 1 ? 1 : 0,
                      borderBottomColor: colors.border,
                      opacity: item.disabled ? 0.5 : 1,
                    }}
                  >
                    {item.icon && (
                      <Icon
                        name={item.icon as any}
                        size={20}
                        color={item.destructive ? colors.error : colors.text}
                        style={{ marginRight: 12 }}
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
              </Animated.View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
});

PopupMenu.displayName = 'PopupMenu';

// ============================================================================
// FLOATING ACTION BUTTON (FAB)
// ============================================================================

export interface FABAction {
  key: string;
  label: string;
  icon: string;
  onPress: () => void;
  color?: string;
}

export interface FABProps extends BaseComponentProps, StyleProps {
  /**
   * Main icon
   */
  icon?: string;
  
  /**
   * On press handler
   */
  onPress?: () => void;
  
  /**
   * FAB color
   */
  color?: string;
  
  /**
   * FAB size
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Show label
   */
  label?: string;
  
  /**
   * Actions (for expandable FAB)
   */
  actions?: FABAction[];
  
  /**
   * Position
   */
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

/**
 * FAB Component
 * 
 * Floating Action Button with optional expandable actions.
 */
export const FAB = memo<FABProps>(({
  icon = 'add',
  onPress,
  color,
  size = 'medium',
  label,
  actions,
  position = 'bottom-right',
  style,
  testID = 'fab',
  ...accessibilityProps
}) => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const fabColor = color || colors.primary;

  const sizeMap = {
    small: 48,
    medium: 56,
    large: 64,
  };

  const iconSizeMap = {
    small: 20,
    medium: 24,
    large: 28,
  };

  const fabSize = sizeMap[size];
  const iconSize = iconSizeMap[size];

  const getPositionStyle = (): ViewStyle => {
    const base = { position: 'absolute', bottom: 16 };
    switch (position) {
      case 'bottom-left':
        return { ...base, left: 16 } as ViewStyle;
      case 'bottom-center':
        return { ...base, left: 0, right: 0, alignItems: 'center' } as ViewStyle;
      case 'bottom-right':
      default:
        return { ...base, right: 16 } as ViewStyle;
    }
  };

  const handlePress = () => {
    if (actions && actions.length > 0) {
      setExpanded(!expanded);
    } else {
      onPress?.();
    }
  };

  return (
    <View style={[getPositionStyle(), style]} testID={testID} {...accessibilityProps}>
      {/* Expanded Actions */}
      {actions && expanded && (
        <View style={{ marginBottom: 16, alignItems: 'flex-end', gap: 12 }}>
          {actions.map((action) => (
            <TouchableOpacity
              key={action.key}
              onPress={() => {
                action.onPress();
                setExpanded(false);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <View
                style={{
                  backgroundColor: colors.surface,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: borderRadius.md,
                  ...shadows.md,
                }}
              >
                <Text style={{ fontSize: fontSize.sm, color: colors.text }}>
                  {action.label}
                </Text>
              </View>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: action.color || fabColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  ...shadows.lg,
                }}
              >
                <Icon name={action.icon as any} size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Main FAB */}
      <TouchableOpacity
        onPress={handlePress}
        style={{
          width: fabSize,
          height: fabSize,
          borderRadius: fabSize / 2,
          backgroundColor: fabColor,
          justifyContent: 'center',
          alignItems: 'center',
          ...shadows.xl,
          flexDirection: label ? 'row' : 'column',
          paddingHorizontal: label ? 16 : 0,
        }}
        activeOpacity={0.8}
      >
        <Icon name={expanded ? 'close' : icon as any} size={iconSize} color="#FFFFFF" />
        {label && (
          <Text
            style={{
              fontSize: fontSize.md,
              fontWeight: '600',
              color: '#FFFFFF',
              marginLeft: 8,
            }}
          >
            {label}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
});

FAB.displayName = 'FAB';

// ============================================================================
// SPEED DIAL (FAB with quick actions)
// ============================================================================

export interface SpeedDialProps extends Omit<FABProps, 'onPress'> {
  /**
   * Required actions for speed dial
   */
  actions: FABAction[];
}

/**
 * SpeedDial Component
 * 
 * FAB that expands to show multiple actions.
 */
export const SpeedDial = memo<SpeedDialProps>((props) => {
  return <FAB {...props} />;
});

SpeedDial.displayName = 'SpeedDial';

// ============================================================================
// MENU COMPONENT
// ============================================================================

export interface MenuProps extends BaseComponentProps, StyleProps {
  /**
   * Menu items
   */
  items: PopupMenuItem[];
  
  /**
   * Menu visible
   */
  visible: boolean;
  
  /**
   * On dismiss
   */
  onDismiss: () => void;
  
  /**
   * Anchor position
   */
  anchorPosition?: { x: number; y: number };
}

/**
 * Menu Component
 * 
 * Standalone menu component.
 */
export const Menu = memo<MenuProps>(({
  items,
  visible,
  onDismiss,
  anchorPosition = { x: 0, y: 0 },
  style,
  testID = 'menu',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={onDismiss}
      >
        <View
          style={{
            position: 'absolute',
            left: anchorPosition.x,
            top: anchorPosition.y,
          }}
        >
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={[
              {
                backgroundColor: isDark ? colors.surface : '#FFFFFF',
                borderRadius: borderRadius.md,
                minWidth: 200,
                ...shadows.lg,
              },
              style,
            ]}
            testID={testID}
            {...accessibilityProps}
          >
            {items.map((item, index) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => {
                  item.onPress();
                  onDismiss();
                }}
                disabled={item.disabled}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                  paddingHorizontal: 16,
                  borderBottomWidth: index < items.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                  opacity: item.disabled ? 0.5 : 1,
                }}
              >
                {item.icon && (
                  <Icon
                    name={item.icon as any}
                    size={20}
                    color={item.destructive ? colors.error : colors.text}
                    style={{ marginRight: 12 }}
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
          </Animated.View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
});

Menu.displayName = 'Menu';
