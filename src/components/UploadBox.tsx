import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface UploadBoxProps {
  title: string;
  subtitle?: string;
  icon?: string;
  iconFamily?: 'solid' | 'regular' | 'light' | 'thin' | 'duotone' | 'brands';
  onPress: () => void;
  isUploaded?: boolean;
  uploadedFileName?: string;
  className?: string;
}

export const UploadBox: React.FC<UploadBoxProps> = ({
  title,
  subtitle,
  icon = 'camera',
  iconFamily = 'regular',
  onPress,
  isUploaded = false,
  uploadedFileName,
  className = '',
}) => {
  const { isDark } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`
        items-center justify-center p-8 rounded-3xl border-2 border-dashed
        ${
          isUploaded
            ? 'border-success bg-success/10'
            : isDark
            ? 'border-gray-700 bg-gray-800/30'
            : 'border-gray-300 bg-gray-50'
        }
        active:scale-[0.98]
        ${className}
      `}
      style={{ minHeight: 200 }}
      activeOpacity={0.7}
    >
      <View
        className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${
          isUploaded
            ? 'bg-success/20'
            : isDark
            ? 'bg-gray-700/50'
            : 'bg-gray-200'
        }`}
      >
        <Icon
          name={isUploaded ? 'check' : icon as any}
          iconStyle={'solid'}
          size={32}
          color={
            isUploaded
              ? '#10B981'
              : isDark
              ? '#9CA3AF'
              : '#6B7280'
          }
        />
      </View>

      <Text
        className={`text-base font-semibold mb-1 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}
      >
        {isUploaded ? 'Uploaded Successfully' : title}
      </Text>

      {subtitle && !isUploaded && (
        <Text
          className={`text-sm text-center ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {subtitle}
        </Text>
      )}

      {uploadedFileName && isUploaded && (
        <Text
          className={`text-xs mt-2 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {uploadedFileName}
        </Text>
      )}
    </TouchableOpacity>
  );
};
