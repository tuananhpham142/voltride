import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface SocialButtonProps extends TouchableOpacityProps {
  provider: 'github' | 'twitter' | 'google' | 'apple' | 'facebook';
  onPress: () => void;
  className?: string;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onPress,
  className = '',
  ...props
}) => {
  const { isDark } = useTheme();

  const getIconName = () => {
    switch (provider) {
      case 'github':
        return 'github';
      case 'twitter':
        return 'x-twitter';
      case 'google':
        return 'google';
      case 'apple':
        return 'apple';
      case 'facebook':
        return 'facebook';
      default:
        return 'circle';
    }
  };

  return (
    <TouchableOpacity
      {...props}
      onPress={onPress}
      className={`
        flex-1 items-center justify-center py-4 rounded-2xl border
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}
        active:scale-95
        ${className}
      `}
      activeOpacity={0.8}
    >
      <Icon
        name={getIconName() as any}
        iconStyle="brand"
        size={24}
        color={isDark ? '#FFFFFF' : '#1F2937'}
      />
    </TouchableOpacity>
  );
};
