/**
 * Pantalla de Registro
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import useAuthStore from '../store/authStore';
import { ScreenShell, AppButton, FormField } from '../components';
import { colors, spacing, typography, radius } from '../theme/tokens';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const signUp = useAuthStore((s) => s.signUp);

  const validateForm = () => {
    if (!email || !username || !password || !confirmPassword || !fullName) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }
    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signUp(email.trim(), username.trim(), password, fullName.trim());
      Alert.alert('Éxito', 'Cuenta creada. Por favor inicia sesión.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenShell
      title="Crear cuenta"
      subtitle="Regístrate para continuar"
      keyboardAware
      headerAction={
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button">
          <Text style={styles.backLink}>Atrás</Text>
        </TouchableOpacity>
      }
    >
      <FormField
        label="Nombre completo"
        inputProps={{
          value: fullName,
          onChangeText: setFullName,
          placeholder: 'Tu nombre',
          autoCapitalize: 'words',
          editable: !isLoading,
        }}
      />
      <FormField
        label="Email"
        inputProps={{
          value: email,
          onChangeText: setEmail,
          placeholder: 'tu@email.com',
          keyboardType: 'email-address',
          editable: !isLoading,
        }}
      />
      <FormField
        label="Usuario"
        inputProps={{
          value: username,
          onChangeText: setUsername,
          placeholder: 'nombre_usuario',
          editable: !isLoading,
        }}
      />
      <FormField
        label="Contraseña"
        inputProps={{
          value: password,
          onChangeText: setPassword,
          placeholder: 'Mínimo 8 caracteres',
          secureTextEntry: true,
          editable: !isLoading,
        }}
      />
      <FormField
        label="Confirmar contraseña"
        inputProps={{
          value: confirmPassword,
          onChangeText: setConfirmPassword,
          placeholder: 'Repite tu contraseña',
          secureTextEntry: true,
          editable: !isLoading,
        }}
      />

      <View style={styles.requirements}>
        <Text style={styles.reqTitle}>La contraseña debe incluir:</Text>
        <Text style={styles.reqItem}>• Mínimo 8 caracteres</Text>
        <Text style={styles.reqItem}>• Una mayúscula, minúscula, número y carácter especial</Text>
      </View>

      <AppButton title="Crear cuenta" onPress={handleRegister} loading={isLoading} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
          <Text style={styles.linkText}>Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  backLink: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.accent,
    paddingTop: spacing.sm,
  },
  requirements: {
    backgroundColor: colors.accentLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  reqTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  reqItem: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.xs,
    color: colors.inkMuted,
    marginBottom: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
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
});

export default RegisterScreen;
