import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps
} from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  iconFamily?: 'solid' | 'regular' | 'light' | 'thin' | 'duotone' | 'brands';
  fullWidth?: boolean;
  className?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'right',
  iconFamily = 'solid',
  fullWidth = true,
  className = '',
  disabled,
  ...props
}) => {
  const { isDark } = useTheme();

  const getVariantClasses = () => {
    if (disabled || isLoading) {
      return isDark
        ? 'bg-gray-800 border-gray-700'
        : 'bg-gray-300 border-gray-300';
    }

    switch (variant) {
      case 'primary':
        return isDark
          ? 'bg-primary border-blue-600'
          : 'bg-white border-white';
      case 'secondary':
        return isDark
          ? 'bg-gray-700 border-gray-700'
          : 'bg-gray-100 border-gray-100';
      case 'outline':
        return isDark
          ? 'bg-transparent border-gray-600'
          : 'bg-transparent border-gray-300';
      case 'ghost':
        return 'bg-transparent border-transparent';
      default:
        return isDark
          ? 'bg-primary border-blue-600'
          : 'bg-white border-white';
    }
  };

  const getTextClasses = () => {
    if (disabled || isLoading) {
      return isDark ? 'text-gray-500' : 'text-gray-400';
    }

    switch (variant) {
      case 'primary':
        return isDark ? 'text-white' : 'text-gray-900';
      case 'secondary':
        return isDark ? 'text-white' : 'text-gray-900';
      case 'outline':
        return isDark ? 'text-white' : 'text-gray-900';
      case 'ghost':
        return isDark ? 'text-blue-400' : 'text-blue-600';
      default:
        return isDark ? 'text-white' : 'text-gray-900';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'py-2 px-4';
      case 'md':
        return 'py-4 px-6';
      case 'lg':
        return 'py-5 px-8';
      default:
        return 'py-4 px-6';
    }
  };

  return (
    <TouchableOpacity
      {...props}
      disabled={disabled || isLoading}
      className={`
        ${fullWidth ? 'w-full' : ''}
        flex-row items-center justify-center
        rounded-2xl border
        ${getVariantClasses()}
        ${getSizeClasses()}
        active:scale-95
        ${className}
      `}
    >
      {isLoading ? (
        <ActivityIndicator color={isDark ? '#60A5FA' : '#3B82F6'} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Icon
              name={icon as any}
              iconStyle={'solid'}
              size={20}
              color={
                disabled || isLoading
                  ? isDark
                    ? '#6B7280'
                    : '#9CA3AF'
                  : variant === 'primary'
                  ? isDark
                    ? '#FFFFFF'
                    : '#1F2937'
                  : isDark
                  ? '#FFFFFF'
                  : '#1F2937'
              }
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            className={`text-base font-semibold ${getTextClasses()}`}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Icon
              name={icon as any}
              iconStyle={'solid'}
              size={20}
              color={
                disabled || isLoading
                  ? isDark
                    ? '#6B7280'
                    : '#9CA3AF'
                  : variant === 'primary'
                  ? isDark
                    ? '#FFFFFF'
                    : '#1F2937'
                  : isDark
                  ? '#FFFFFF'
                  : '#1F2937'
              }
              style={{ marginLeft: 8 }}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};
