/**
 * Pantalla de Gestión de Usuarios (admin)
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import useAuthStore from '../store/authStore';
import { ScreenShell, AppButton } from '../components';
import { colors, spacing, typography, radius } from '../theme/tokens';

const roleLabel = (role) => (role === 'admin' ? 'Admin' : 'Cliente');

const UsersScreen = () => {
  const listUsers = useAuthStore((s) => s.listUsers);
  const activateUser = useAuthStore((s) => s.activateUser);
  const deactivateUser = useAuthStore((s) => s.deactivateUser);
  const deleteUser = useAuthStore((s) => s.deleteUser);
  const currentUser = useAuthStore((s) => s.user);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionId, setActionId] = useState(null);

  const loadUsers = async () => {
    try {
      const result = await listUsers();
      setUsers(result.users);
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo cargar la lista de usuarios');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadUsers();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const runAction = async (label, action, userId) => {
    Alert.alert(label, `¿Confirmas esta acción?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        style: label === 'Eliminar usuario' ? 'destructive' : 'default',
        onPress: async () => {
          setActionId(userId);
          try {
            await action(userId);
            await loadUsers();
          } catch (err) {
            Alert.alert('Error', err.message);
          } finally {
            setActionId(null);
          }
        },
      },
    ]);
  };

  const renderUser = ({ item }) => {
    const isSelf = item.id === currentUser?.id;
    const busy = actionId === item.id;

    return (
      <View style={styles.userRow}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.fullName || item.username}</Text>
          <Text style={styles.userMeta}>{item.email}</Text>
          <View style={styles.tags}>
            <Text style={styles.tag}>{roleLabel(item.role)}</Text>
            <Text
              style={[
                styles.tag,
                item.isActive ? styles.tagActive : styles.tagInactive,
              ]}
            >
              {item.isActive ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>

        {!isSelf && (
          <View style={styles.actions}>
            {item.isActive ? (
              <AppButton
                title="Desactivar"
                variant="outline"
                onPress={() => runAction('Desactivar usuario', deactivateUser, item.id)}
                loading={busy}
                style={styles.actionBtn}
                textStyle={styles.actionBtnText}
              />
            ) : (
              <AppButton
                title="Activar"
                variant="primary"
                onPress={() => runAction('Activar usuario', activateUser, item.id)}
                loading={busy}
                style={styles.actionBtn}
              />
            )}
            <AppButton
              title="Eliminar"
              variant="danger"
              onPress={() => runAction('Eliminar usuario', deleteUser, item.id)}
              loading={busy}
              style={styles.actionBtn}
            />
          </View>
        )}
        {isSelf && <Text style={styles.selfNote}>Tu cuenta</Text>}
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <ScreenShell scrollable={false}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell scrollable={false} contentStyle={styles.listContainer}>
      <FlatList
        data={users}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderUser}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No hay usuarios registrados</Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    marginHorizontal: -spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userRow: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  userInfo: {
    marginBottom: spacing.sm,
  },
  userName: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.md,
    color: colors.ink,
  },
  userMeta: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.inkMuted,
    marginTop: spacing.xs,
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  tag: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    color: colors.inkMuted,
    backgroundColor: colors.paperDark,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  tagActive: {
    color: colors.success,
    backgroundColor: colors.successLight,
  },
  tagInactive: {
    color: colors.error,
    backgroundColor: colors.errorLight,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    minWidth: 100,
    minHeight: 40,
    paddingVertical: spacing.sm,
  },
  actionBtnText: {
    fontSize: typography.size.sm,
  },
  selfNote: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.xs,
    color: colors.inkMuted,
    fontStyle: 'italic',
  },
  empty: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.inkMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

export default UsersScreen;
