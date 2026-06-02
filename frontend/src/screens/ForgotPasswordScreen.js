/**
 * Pantalla de Recuperación de Contraseña
 */

import React, { useState } from 'react';
import { Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import useAuthStore from '../store/authStore';
import { ScreenShell, AppButton, FormField } from '../components';
import { colors, spacing, typography } from '../theme/tokens';

const ForgotPasswordScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset);
  const resetPassword = useAuthStore((s) => s.resetPassword);

  const handleRequestReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return;
    }

    setIsLoading(true);
    try {
      await requestPasswordReset(email.trim());
      Alert.alert('Éxito', 'Si la cuenta existe, recibirás instrucciones de recuperación');
      setStep(2);
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!token || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token.trim(), newPassword);
      Alert.alert('Éxito', 'Tu contraseña ha sido reseteada', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo resetear la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenShell
      title="Recuperar contraseña"
      subtitle={
        step === 1
          ? 'Ingresa tu email para recibir instrucciones'
          : 'Ingresa el token y tu nueva contraseña'
      }
      keyboardAware
      headerAction={
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button">
          <Text style={styles.backLink}>Atrás</Text>
        </TouchableOpacity>
      }
    >
      {step === 1 ? (
        <>
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
          <AppButton
            title="Enviar instrucciones"
            onPress={handleRequestReset}
            loading={isLoading}
          />
        </>
      ) : (
        <>
          <FormField
            label="Token de recuperación"
            inputProps={{
              value: token,
              onChangeText: setToken,
              placeholder: 'Pega el token recibido',
              editable: !isLoading,
              multiline: true,
            }}
          />
          <FormField
            label="Nueva contraseña"
            inputProps={{
              value: newPassword,
              onChangeText: setNewPassword,
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
          <AppButton
            title="Resetear contraseña"
            onPress={handleResetPassword}
            loading={isLoading}
            style={styles.submit}
          />
          <TouchableOpacity
            onPress={() => {
              setStep(1);
              setToken('');
              setNewPassword('');
              setConfirmPassword('');
            }}
            disabled={isLoading}
            accessibilityRole="button"
          >
            <Text style={styles.changeEmail}>¿Usar otro email?</Text>
          </TouchableOpacity>
        </>
      )}
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
  submit: {
    marginBottom: spacing.md,
  },
  changeEmail: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.accent,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

export default ForgotPasswordScreen;
