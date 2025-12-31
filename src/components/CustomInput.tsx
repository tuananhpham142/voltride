import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: string;
  iconFamily?: 'solid' | 'regular' | 'light' | 'thin' | 'duotone' | 'brands';
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  icon,
  iconFamily = 'regular',
  rightIcon,
  containerClassName = '',
  inputClassName = '',
  labelClassName = '',
  ...props
}) => {
  const { isDark } = useTheme();

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text
          className={`text-sm font-medium mb-2 ml-1 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          } ${labelClassName}`}
        >
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center rounded-2xl border ${
          error
            ? 'border-error'
            : isDark
            ? 'border-gray-700 bg-gray-800/50'
            : 'border-gray-200 bg-white'
        } ${inputClassName}`}
      >
        {icon && (
          <View className="px-4">
            <Icon
              name={icon as any}
              iconStyle={'solid'}
              size={20}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </View>
        )}
        <TextInput
          {...props}
          className={`flex-1 px-4 py-4 text-base ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
          placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
        />
        {rightIcon && <View className="px-4">{rightIcon}</View>}
      </View>
      {error && <Text className="text-error text-xs mt-1 ml-1">{error}</Text>}
    </View>
  );
};
