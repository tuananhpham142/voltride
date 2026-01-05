// src/components/assets/QRCode.tsx

import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import QRCodeSvg from 'react-native-qrcode-svg';

export interface QRCodeProps {
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
  logo?: any; // Image source for logo in center
  logoSize?: number;
  logoBackgroundColor?: string;
  logoMargin?: number;
  logoBorderRadius?: number;
  quietZone?: number;
  enableLinearGradient?: boolean;
  gradientDirection?: [number, number, number, number];
  linearGradient?: [string, string];
  ecl?: 'L' | 'M' | 'Q' | 'H'; // Error correction level
  getRef?: (ref: any) => void;
  onError?: (error: any) => void;
  style?: ViewStyle;
}

export const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 200,
  color,
  backgroundColor,
  logo,
  logoSize = 50,
  logoBackgroundColor = 'white',
  logoMargin = 2,
  logoBorderRadius = 5,
  quietZone = 10,
  enableLinearGradient = false,
  gradientDirection,
  linearGradient,
  ecl = 'M',
  getRef,
  onError,
  style,
}) => {
  const { colors, isDark } = useTheme();

  // Default colors based on theme
  const qrColor = color || colors.text;
  const qrBgColor = backgroundColor || colors.surface;

  if (!value) {
    return null;
  }

  return (
    <View style={[styles.container, { padding: quietZone }, style]}>
      <QRCodeSvg
        value={value}
        size={size}
        color={qrColor}
        backgroundColor={qrBgColor}
        logo={logo}
        logoSize={logoSize}
        logoBackgroundColor={logoBackgroundColor}
        logoMargin={logoMargin}
        logoBorderRadius={logoBorderRadius}
        ecl={ecl}
        getRef={getRef}
        onError={onError}
        enableLinearGradient={enableLinearGradient}
        // gradientDirection={gradientDirection}
        linearGradient={linearGradient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default QRCode;
