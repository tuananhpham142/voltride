import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize } from '../utils/theme';

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