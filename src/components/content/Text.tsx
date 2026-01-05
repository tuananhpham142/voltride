// src/components/content/Text.tsx

import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

export type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline'
  | 'button';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  children?: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body1',
  color,
  align = 'left',
  weight,
  style,
  children,
  ...props
}) => {
  const { colors } = useTheme();

  const variantStyles = {
    display: {
      fontSize: 34,
      lineHeight: 41,
      fontWeight: '700' as const,
      letterSpacing: 0.25,
    },
    h1: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '700' as const,
      letterSpacing: 0,
    },
    h2: {
      fontSize: 24,
      lineHeight: 29,
      fontWeight: '600' as const,
      letterSpacing: 0,
    },
    h3: {
      fontSize: 20,
      lineHeight: 24,
      fontWeight: '600' as const,
      letterSpacing: 0.15,
    },
    subtitle1: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600' as const,
      letterSpacing: 0.15,
    },
    subtitle2: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '600' as const,
      letterSpacing: 0.1,
    },
    body1: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
      letterSpacing: 0.5,
    },
    body2: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '400' as const,
      letterSpacing: 0.25,
    },
    caption: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: '400' as const,
      letterSpacing: 0.4,
    },
    overline: {
      fontSize: 10,
      lineHeight: 16,
      fontWeight: '500' as const,
      letterSpacing: 1.5,
      textTransform: 'uppercase' as const,
    },
    button: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '600' as const,
      letterSpacing: 1.25,
      textTransform: 'uppercase' as const,
    },
  };

  const textStyle = [
    styles.base,
    variantStyles[variant],
    {
      color: color || colors.text,
      textAlign: align,
    },
    weight && { fontWeight: weight },
    style,
  ];

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'System', // Replace with your custom font family
  },
});

export default Text;
