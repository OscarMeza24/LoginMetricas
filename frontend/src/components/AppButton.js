import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, radius, typography } from '../theme/tokens';

const VARIANTS = {
  primary: {
    container: { backgroundColor: colors.primary },
    text: { color: colors.white },
    spinner: colors.white,
  },
  accent: {
    container: { backgroundColor: colors.accent },
    text: { color: colors.white },
    spinner: colors.white,
  },
  outline: {
    container: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    text: { color: colors.primary },
    spinner: colors.primary,
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: { color: colors.accent },
    spinner: colors.accent,
  },
  danger: {
    container: { backgroundColor: colors.error },
    text: { color: colors.white },
    spinner: colors.white,
  },
  surface: {
    container: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    text: { color: colors.ink },
    spinner: colors.primary,
  },
};

const AppButton = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.base, v.container, isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={v.spinner} size="small" />
      ) : (
        <Text style={[styles.text, v.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.md,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default AppButton;
