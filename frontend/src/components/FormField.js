import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppInput from './AppInput';
import { colors, spacing, typography } from '../theme/tokens';

const FormField = ({
  label,
  error,
  hint,
  inputProps = {},
  children,
}) => (
  <View style={styles.container}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    {children || <AppInput {...inputProps} />}
    {hint && !error ? <Text style={styles.hint}>{hint}</Text> : null}
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  hint: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.xs,
    color: colors.inkMuted,
    marginTop: spacing.xs,
  },
  error: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
});

export default FormField;
