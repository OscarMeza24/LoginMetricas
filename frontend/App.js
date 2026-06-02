import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import client from './src/services/graphqlClient';
import useAuthStore from './src/store/authStore';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import { colors } from './src/theme/tokens';

export default function App() {
  const { isLoading, isSignedIn } = useAuthStore();
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  if (!fontsLoaded || isLoading) {
    return (
      <>
        <SplashScreen />
        <StatusBar style="dark" backgroundColor={colors.paper} />
      </>
    );
  }

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        {isSignedIn ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
      <StatusBar style="dark" backgroundColor={colors.paper} />
    </ApolloProvider>
  );
}
