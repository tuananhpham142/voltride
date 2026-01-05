// src/components/content/Heading.tsx

import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { Text, TextProps } from './Text';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends Omit<TextProps, 'variant'> {
  level?: HeadingLevel;
  children?: React.ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({ level = 1, style, children, ...props }) => {
  const { colors } = useTheme();

  const levelVariants = {
    1: 'h1' as const,
    2: 'h2' as const,
    3: 'h3' as const,
    4: 'subtitle1' as const,
    5: 'subtitle2' as const,
    6: 'subtitle2' as const,
  };

  const levelStyles = {
    1: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '700' as const,
      marginBottom: 16,
    },
    2: {
      fontSize: 24,
      lineHeight: 29,
      fontWeight: '600' as const,
      marginBottom: 12,
    },
    3: {
      fontSize: 20,
      lineHeight: 24,
      fontWeight: '600' as const,
      marginBottom: 12,
    },
    4: {
      fontSize: 18,
      lineHeight: 22,
      fontWeight: '600' as const,
      marginBottom: 8,
    },
    5: {
      fontSize: 16,
      lineHeight: 20,
      fontWeight: '600' as const,
      marginBottom: 8,
    },
    6: {
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '600' as const,
      marginBottom: 8,
    },
  };

  const headingStyle = [levelStyles[level], style];

  return (
    <Text variant={levelVariants[level]} style={headingStyle} color={colors.text} {...props}>
      {children}
    </Text>
  );
};

export default Heading;
