/**
 * Pantalla de Perfil — edición de datos del usuario
 */

import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import useAuthStore from '../store/authStore';
import { ScreenShell, AppButton, FormField } from '../components';
import { spacing } from '../theme/tokens';

const ProfileScreen = ({ navigation }) => {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setUsername(user.username || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!fullName || !email || !username) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile(user.id, fullName.trim(), email.trim(), username.trim());
      Alert.alert('Éxito', 'Perfil actualizado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenShell title="Editar perfil" subtitle="Actualiza tu información personal" keyboardAware>
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
      <AppButton title="Guardar cambios" onPress={handleSave} loading={isLoading} style={styles.submit} />
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  submit: {
    marginTop: spacing.sm,
  },
});

export default ProfileScreen;
