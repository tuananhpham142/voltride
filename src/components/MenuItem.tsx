import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface MenuItemProps {
  icon: string;
  iconFamily?: 'solid' | 'regular' | 'light' | 'thin' | 'duotone' | 'brands';
  title: string;
  subtitle?: string;
  onPress: () => void;
  iconColor?: string;
  iconBgColor?: string;
  showArrow?: boolean;
  badge?: number;
  variant?: 'default' | 'primary';
  className?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  iconFamily = 'regular',
  title,
  subtitle,
  onPress,
  iconColor,
  iconBgColor,
  showArrow = true,
  badge,
  variant = 'default',
  className = '',
}) => {
  const { isDark } = useTheme();

  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`
        flex-row items-center p-4 rounded-2xl mb-2
        ${
          isPrimary
            ? 'bg-primary border-primary-300'
            : isDark
            ? 'bg-gray-800/30 border-gray-700/50'
            : 'bg-gray-50/50 border-gray-200/50'
        }
        border
        active:scale-[0.98]
        ${className}
      `}
      activeOpacity={0.7}
    >
      <View
        className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
          iconBgColor ||
          (isPrimary
            ? 'bg-primary'
            : isDark
            ? 'bg-gray-700'
            : 'bg-white')
        }`}
      >
        <Icon
          name={icon as any}
          iconStyle={'solid'}
          size={20}
          color={
            iconColor ||
            (isPrimary ? '#FFFFFF' : isDark ? '#9CA3AF' : '#6B7280')
          }
        />
      </View>

      <View className="flex-1">
        <Text
          className={`text-base font-semibold ${
            isPrimary ? 'text-white' : isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            className={`text-xs mt-0.5 ${
              isPrimary
                ? 'text-blue-100'
                : isDark
                ? 'text-gray-400'
                : 'text-gray-500'
            }`}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {badge !== undefined && badge > 0 && (
        <View className="bg-error rounded-full w-6 h-6 items-center justify-center mr-2">
          <Text className="text-white text-xs font-bold">
            {badge > 99 ? '99+' : badge}
          </Text>
        </View>
      )}

      {showArrow && (
        <Icon
          name="chevron-right"
          iconStyle="solid"
          size={16}
          color={isPrimary ? '#FFFFFF' : isDark ? '#6B7280' : '#9CA3AF'}
        />
      )}
    </TouchableOpacity>
  );
};
