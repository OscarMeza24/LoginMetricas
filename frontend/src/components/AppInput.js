import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme/tokens';

const AppInput = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  editable = true,
  multiline = false,
  style,
  ...rest
}) => (
  <TextInput
    style={[styles.input, multiline && styles.multiline, style]}
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor={colors.inkLight}
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType}
    autoCapitalize={autoCapitalize}
    editable={editable}
    multiline={multiline}
    {...rest}
  />
);

const styles = StyleSheet.create({
  input: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.md,
    color: colors.ink,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
});

export default AppInput;
