
// src/components/input/TextArea.tsx
import React, { memo } from 'react';
import { TextField, TextFieldProps } from "./TextField";

/**
 * TextArea Component  
 * 
 * A multiline text input field.
 */
export const TextArea = memo<TextFieldProps>((props) => {
  return <TextField {...props} multiline />;
});

TextArea.displayName = 'TextArea';
