import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface ActionCardProps {
  title: string;
  subtitle?: string;
  icon: string;
  iconFamily?: 'solid' | 'regular' | 'light' | 'thin' | 'duotone' | 'brands';
  onPress: () => void;
  colors?: string[];
  iconColor?: string;
  textColor?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  subtitle,
  icon,
  iconFamily = 'solid',
  onPress,
  colors,
  iconColor = '#FFFFFF',
  textColor = '#FFFFFF',
  size = 'md',
  className = '',
}) => {
  const { isDark } = useTheme();

  const defaultColors = isDark
    ? ['#1F2937', '#374151']
    : ['#E5E7EB', '#F3F4F6'];

  const gradientColors = colors || defaultColors;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-4';
      case 'md':
        return 'p-5';
      case 'lg':
        return 'p-6';
      default:
        return 'p-5';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 20;
      case 'md':
        return 24;
      case 'lg':
        return 28;
      default:
        return 24;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-3xl overflow-hidden active:scale-95 ${className}`}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        
      >
        <View className={`${getSizeClasses()}`}>
          <View
            className={`w-12 h-12 rounded-2xl items-center justify-center mb-3 ${
              isDark ? 'bg-white/10' : 'bg-black/5'
            }`}
          >
            <Icon
              name={icon as any}
              iconStyle={'solid'}
              size={getIconSize()}
              color={iconColor}
            />
          </View>

          <Text
            className="text-lg font-bold mb-1"
            style={{ color: textColor }}
          >
            {title}
          </Text>

          {subtitle && (
            <Text
              className="text-sm opacity-80"
              style={{ color: textColor }}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};
