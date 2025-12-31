import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface PromotionalBannerProps {
  badge?: string;
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
  colors?: string[];
  className?: string;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  badge,
  title,
  description,
  buttonText,
  onPress,
  colors = ['#8B5CF6', '#3B82F6'],
  className = '',
}) => {
  const { isDark } = useTheme();

  return (
    <View className={`rounded-3xl overflow-hidden ${className}`}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View className='p-6'>
          {badge && (
            <View className="mb-3 self-start">
              <View className="bg-white/20 rounded-full px-4 py-1.5">
                <Text className="text-white text-xs font-bold uppercase">
                  {badge}
                </Text>
              </View>
            </View>
          )}

          <Text className="text-white text-2xl font-bold mb-2">{title}</Text>

          <Text className="text-white/90 text-sm mb-4 leading-5">
            {description}
          </Text>

          <TouchableOpacity
          onPress={onPress}
          className="bg-white rounded-full px-6 py-3 self-start active:scale-95"
          activeOpacity={0.8}
        >
          <Text className="text-purple-600 text-sm font-bold">
            {buttonText}
          </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};
