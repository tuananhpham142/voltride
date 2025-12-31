// src/components/advanced/BottomSheetComponent.tsx
import React, { memo } from 'react';
import { View } from 'react-native';
import { Button } from '../control/Button';
import { BottomSheetComponent, BottomSheetComponentProps } from './BottomSheetComponent';

/**
 * FormBottomSheet - For forms with footer buttons
 */
export interface FormBottomSheetProps extends Omit<BottomSheetComponentProps, 'footer'> {
  primaryButtonText: string;
  onPrimaryPress: () => void;
  secondaryButtonText?: string;
  onSecondaryPress?: () => void;
  primaryButtonDisabled?: boolean;
}

export const FormBottomSheet = memo<FormBottomSheetProps>(({
  primaryButtonText,
  onPrimaryPress,
  secondaryButtonText,
  onSecondaryPress,
  primaryButtonDisabled = false,
  children,
  ...props
}) => {
  const footer = (
    <View style={{ gap: 12 }}>
      <Button
        title={primaryButtonText}
        variant="primary"
        size="md"
        onPress={onPrimaryPress}
        disabled={primaryButtonDisabled}
        fullWidth
      />
      {secondaryButtonText && (
        <Button
          title={secondaryButtonText}
          variant="outline"
          size="md"
          onPress={onSecondaryPress}
          fullWidth
        />
      )}
    </View>
  );

  return (
    <BottomSheetComponent {...props} footer={footer}>
      {children}
    </BottomSheetComponent>
  );
});

FormBottomSheet.displayName = 'FormBottomSheet';