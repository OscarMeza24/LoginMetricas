/**
 * Navegador principal de la aplicación
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import UsersScreen from '../screens/UsersScreen';
import { colors, typography } from '../theme/tokens';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.paper },
  headerTintColor: colors.primary,
  headerTitleStyle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.md,
    color: colors.ink,
  },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.paper },
};

const AppNavigator = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Mi Perfil' }}
    />
    <Stack.Screen
      name="ChangePassword"
      component={ChangePasswordScreen}
      options={{ title: 'Cambiar Contraseña' }}
    />
    <Stack.Screen
      name="Users"
      component={UsersScreen}
      options={{ title: 'Gestión de Usuarios' }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
