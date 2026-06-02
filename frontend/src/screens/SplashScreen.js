/**
 * Pantalla de Splash
 */

import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import useAuthStore from '../store/authStore';
import { colors, spacing, typography } from '../theme/tokens';

const SplashScreen = () => {
  const restoreToken = useAuthStore((s) => s.restoreToken);

  useEffect(() => {
    restoreToken();
  }, [restoreToken]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LoginMetricas</Text>
      <Text style={styles.tagline}>Autenticación segura</Text>
      <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      <Text style={styles.subtitle}>Cargando…</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.paper,
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xxl,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.inkMuted,
    marginBottom: spacing.xl,
  },
  loader: {
    marginBottom: spacing.md,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.inkMuted,
  },
});

export default SplashScreen;
