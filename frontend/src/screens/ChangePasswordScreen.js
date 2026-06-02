/**
 * Pantalla de Cambio de Contraseña
 */

import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import useAuthStore from '../store/authStore';
import { ScreenShell, AppButton, FormField } from '../components';
import { spacing } from '../theme/tokens';

const ChangePasswordScreen = ({ navigation }) => {
  const user = useAuthStore((s) => s.user);
  const changePassword = useAuthStore((s) => s.changePassword);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await changePassword(user.id, currentPassword, newPassword);
      Alert.alert('Éxito', 'Contraseña actualizada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenShell
      title="Nueva contraseña"
      subtitle="Introduce tu contraseña actual y la nueva"
      keyboardAware
    >
      <FormField
        label="Contraseña actual"
        inputProps={{
          value: currentPassword,
          onChangeText: setCurrentPassword,
          placeholder: 'Contraseña actual',
          secureTextEntry: true,
          editable: !isLoading,
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
        label="Confirmar nueva contraseña"
        inputProps={{
          value: confirmPassword,
          onChangeText: setConfirmPassword,
          placeholder: 'Repite la nueva contraseña',
          secureTextEntry: true,
          editable: !isLoading,
        }}
      />
      <AppButton title="Actualizar contraseña" onPress={handleChange} loading={isLoading} style={styles.submit} />
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  submit: {
    marginTop: spacing.sm,
  },
});

export default ChangePasswordScreen;
