/**
 * Pantalla de Home/Dashboard
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import useAuthStore from '../store/authStore';
import { ScreenShell, AppButton } from '../components';
import { colors, spacing, typography, radius } from '../theme/tokens';

const roleLabel = (role) => (role === 'admin' ? 'Administrador' : 'Cliente');

const HomeScreen = ({ navigation }) => {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          try {
            await signOut();
          } catch (err) {
            Alert.alert('Error', err.message || 'No se pudo cerrar sesión');
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <ScreenShell
      scrollable
      title={`Hola, ${user?.fullName || user?.username || 'Usuario'}`}
      subtitle={roleLabel(user?.role)}
    >
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Información de cuenta</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email || '—'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Usuario</Text>
          <Text style={styles.infoValue}>{user?.username || '—'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Estado</Text>
          <View
            style={[
              styles.badge,
              user?.isActive ? styles.badgeActive : styles.badgeInactive,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                user?.isActive ? styles.badgeTextActive : styles.badgeTextInactive,
              ]}
            >
              {user?.isActive ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <AppButton
          title="Ver perfil"
          variant="surface"
          onPress={() => navigation.navigate('Profile')}
        />
        <AppButton
          title="Cambiar contraseña"
          variant="outline"
          onPress={() => navigation.navigate('ChangePassword')}
        />
        {user?.role === 'admin' && (
          <AppButton
            title="Gestionar usuarios"
            variant="accent"
            onPress={() => navigation.navigate('Users')}
          />
        )}
        <AppButton
          title="Cerrar sesión"
          variant="danger"
          onPress={handleLogout}
          loading={loggingOut}
          style={styles.logout}
        />
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  infoSection: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.md,
    color: colors.ink,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  infoLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    color: colors.inkMuted,
  },
  infoValue: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.ink,
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  badgeActive: {
    backgroundColor: colors.successLight,
  },
  badgeInactive: {
    backgroundColor: colors.errorLight,
  },
  badgeText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
  },
  badgeTextActive: {
    color: colors.success,
  },
  badgeTextInactive: {
    color: colors.error,
  },
  actions: {
    gap: spacing.sm,
  },
  logout: {
    marginTop: spacing.sm,
  },
});

export default HomeScreen;
