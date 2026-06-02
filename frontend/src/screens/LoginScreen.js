/**
 * Pantalla de Login
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import useAuthStore from '../store/authStore';
import { ScreenShell, AppButton, FormField } from '../components';
import { colors, spacing, typography } from '../theme/tokens';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const signIn = useAuthStore((s) => s.signIn);
  const error = useAuthStore((s) => s.error);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      Alert.alert('Error de login', err.message || error || 'No se pudo iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenShell
      title="Bienvenido"
      subtitle="Inicia sesión en tu cuenta"
      keyboardAware
    >
      <FormField
        label="Email"
        inputProps={{
          value: email,
          onChangeText: setEmail,
          placeholder: 'tu@email.com',
          keyboardType: 'email-address',
          editable: !isLoading,
          autoComplete: 'email',
        }}
      />

      <FormField
        label="Contraseña"
        inputProps={{
          value: password,
          onChangeText: setPassword,
          placeholder: 'Tu contraseña',
          secureTextEntry: true,
          editable: !isLoading,
          autoComplete: 'password',
        }}
      />

      <TouchableOpacity
        style={styles.forgotLink}
        onPress={() => navigation.navigate('ForgotPassword')}
        disabled={isLoading}
        accessibilityRole="link"
      >
        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <AppButton
        title="Iniciar sesión"
        onPress={handleLogin}
        loading={isLoading}
        style={styles.submit}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>¿No tienes cuenta? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          disabled={isLoading}
          accessibilityRole="link"
        >
          <Text style={styles.linkText}>Regístrate</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.demoHint}>
        <Text style={styles.demoTitle}>Demo admin</Text>
        <Text style={styles.demoText}>admin@admin.com / Admin123!</Text>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.accent,
  },
  submit: {
    marginBottom: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.inkMuted,
  },
  linkText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.primary,
  },
  demoHint: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  demoTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: colors.primaryDark,
    marginBottom: spacing.xs,
  },
  demoText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.ink,
  },
});

export default LoginScreen;
