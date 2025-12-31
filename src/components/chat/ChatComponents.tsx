// src/components/chat/ChatComponents.tsx
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';
import React, { memo, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { BaseComponentProps, StyleProps } from '../types/common';
import { borderRadius, fontSize } from '../utils/theme';

// ============================================================================
// MESSAGE BUBBLE
// ============================================================================

export interface MessageBubbleProps extends BaseComponentProps, StyleProps {
  /**
   * Message text
   */
  message: string;
  
  /**
   * Message timestamp
   */
  timestamp: string;
  
  /**
   * Is current user's message
   */
  isOwn?: boolean;
  
  /**
   * Sender name (for group chats)
   */
  senderName?: string;
  
  /**
   * Sender avatar
   */
  senderAvatar?: string;
  
  /**
   * Message status
   */
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  
  /**
   * Message image
   */
  image?: string;
  
  /**
   * On long press
   */
  onLongPress?: () => void;
}

/**
 * MessageBubble Component
 * 
 * Chat message display with status indicators.
 */
export const MessageBubble = memo<MessageBubbleProps>(({
  message,
  timestamp,
  isOwn = false,
  senderName,
  senderAvatar,
  status = 'sent',
  image,
  onLongPress,
  style,
  testID = 'message-bubble',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();

  const bubbleStyle: ViewStyle = {
    maxWidth: '75%',
    padding: 12,
    borderRadius: borderRadius.lg,
    backgroundColor: isOwn 
      ? colors.primary
      : isDark ? colors.surface : '#F5F5F5',
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return 'schedule';
      case 'sent':
        return 'check';
      case 'delivered':
        return 'done-all';
      case 'read':
        return 'done-all';
      default:
        return 'check';
    }
  };

  return (
    <Animated.View
      entering={isOwn ? FadeInRight : FadeInLeft}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-end',
          marginVertical: 4,
          paddingHorizontal: 16,
          alignSelf: isOwn ? 'flex-end' : 'flex-start',
        },
        style,
      ]}
      testID={testID}
      {...accessibilityProps}
    >
      {/* Avatar for received messages */}
      {!isOwn && senderAvatar && (
        <Image
          source={{ uri: senderAvatar }}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            marginRight: 8,
          }}
        />
      )}

      <TouchableOpacity
        style={bubbleStyle}
        onLongPress={onLongPress}
        activeOpacity={0.7}
        disabled={!onLongPress}
      >
        {/* Sender name for group chats */}
        {!isOwn && senderName && (
          <Text
            style={{
              fontSize: fontSize.xs,
              fontWeight: '600',
              color: colors.primary,
              marginBottom: 4,
            }}
          >
            {senderName}
          </Text>
        )}

        {/* Message image */}
        {image && (
          <Image
            source={{ uri: image }}
            style={{
              width: 200,
              height: 200,
              borderRadius: borderRadius.md,
              marginBottom: message ? 8 : 0,
            }}
            resizeMode="cover"
          />
        )}

        {/* Message text */}
        {message && (
          <Text
            style={{
              fontSize: fontSize.md,
              color: isOwn ? '#FFFFFF' : colors.text,
              lineHeight: 20,
            }}
          >
            {message}
          </Text>
        )}

        {/* Timestamp and status */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 4,
            gap: 4,
          }}
        >
          <Text
            style={{
              fontSize: fontSize.xs,
              color: isOwn ? 'rgba(255,255,255,0.7)' : colors.textSecondary,
            }}
          >
            {timestamp}
          </Text>
          {isOwn && (
            <Icon
              name={getStatusIcon()}
              size={14}
              color={status === 'read' ? '#4FC3F7' : 'rgba(255,255,255,0.7)'}
            />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

MessageBubble.displayName = 'MessageBubble';

// ============================================================================
// MESSAGE INPUT
// ============================================================================

export interface MessageInputProps extends BaseComponentProps, StyleProps {
  /**
   * Input value
   */
  value: string;
  
  /**
   * On value change
   */
  onChangeText: (text: string) => void;
  
  /**
   * On send press
   */
  onSend: () => void;
  
  /**
   * Placeholder text
   */
  placeholder?: string;
  
  /**
   * On attach press
   */
  onAttach?: () => void;
  
  /**
   * On camera press
   */
  onCamera?: () => void;
  
  /**
   * On voice press
   */
  onVoice?: () => void;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Max length
   */
  maxLength?: number;
}

/**
 * MessageInput Component
 * 
 * Chat input with attachment options.
 */
export const MessageInput = memo<MessageInputProps>(({
  value,
  onChangeText,
  onSend,
  placeholder = 'Type a message...',
  onAttach,
  onCamera,
  onVoice,
  disabled = false,
  maxLength,
  style,
  testID = 'message-input',
  ...accessibilityProps
}) => {
  const { colors, isDark } = useTheme();
  const [focused, setFocused] = useState(false);

  const canSend = value.trim().length > 0;

  const handleSend = () => {
    if (canSend && !disabled) {
      onSend();
    }
  };

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-end',
          padding: 8,
          backgroundColor: isDark ? colors.surface : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: colors.border,
          gap: 8,
        },
        style,
      ]}
      testID={testID}
      {...accessibilityProps}
    >
      {/* Attachment options (when input is empty) */}
      {!canSend && (
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {onAttach && (
            <TouchableOpacity
              onPress={onAttach}
              disabled={disabled}
              style={{ padding: 8 }}
            >
              <Icon
                name="attach-file"
                size={24}
                color={disabled ? colors.border : colors.textSecondary}
              />
            </TouchableOpacity>
          )}
          {onCamera && (
            <TouchableOpacity
              onPress={onCamera}
              disabled={disabled}
              style={{ padding: 8 }}
            >
              <Icon
                name="camera-alt"
                size={24}
                color={disabled ? colors.border : colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Text input */}
      <View
        style={{
          flex: 1,
          backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
          borderRadius: borderRadius.xl,
          paddingHorizontal: 16,
          paddingVertical: 8,
          maxHeight: 100,
          borderWidth: focused ? 1 : 0,
          borderColor: colors.primary,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={maxLength}
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            fontSize: fontSize.md,
            color: colors.text,
            minHeight: 20,
            maxHeight: 80,
            paddingVertical: 0,
          }}
        />
      </View>

      {/* Send button or voice button */}
      {canSend ? (
        <TouchableOpacity
          onPress={handleSend}
          disabled={disabled}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <Icon name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      ) : onVoice ? (
        <TouchableOpacity
          onPress={onVoice}
          disabled={disabled}
          style={{ padding: 8 }}
        >
          <Icon
            name="mic"
            size={24}
            color={disabled ? colors.border : colors.textSecondary}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
});

MessageInput.displayName = 'MessageInput';
