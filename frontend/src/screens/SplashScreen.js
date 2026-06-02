/**
 * Pantalla de Splash
 * ISO/IEC 25022: Interfaz clara de carga
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useAuthStore from '../store/authStore';

const SplashScreen = () => {
  const { restoreToken } = useAuthStore();

  useEffect(() => {
    restoreToken();
  }, []);

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>MVP Auth</Text>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.subtitle}>Cargando...</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 15,
  },
});

export default SplashScreen;
