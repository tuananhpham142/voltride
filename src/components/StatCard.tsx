import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  iconFamily?: 'solid' | 'regular' | 'light' | 'thin' | 'duotone' | 'brands';
  iconColor?: string;
  onPress?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  iconFamily = 'solid',
  iconColor,
  onPress,
  className = '',
}) => {
  const { isDark } = useTheme();

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      className={`
        flex-1 p-4 rounded-2xl
        ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}
        border
        ${className}
      `}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View className="flex-row items-center mb-2">
        {icon && (
          <View
            className={`w-8 h-8 rounded-full items-center justify-center mr-2 ${
              isDark ? 'bg-gray-700' : 'bg-white'
            }`}
          >
            <Icon
              name={icon as any}
              iconStyle='solid'
              size={16}
              color={iconColor || (isDark ? '#60A5FA' : '#3B82F6')}
            />
          </View>
        )}
        <Text
          className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
        >
          {label}
        </Text>
      </View>
      <Text
        className={`text-2xl font-bold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}
      >
        {value}
      </Text>
    </Container>
  );
};
