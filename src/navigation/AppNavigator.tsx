import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../screens/auth/LoginScreen';
import RegistrationScreen from '../screens/auth/RegistrationScreen';
import TabNavigator from './TabNavigator';
import UserTabNavigator from './UserTabNavigator';
import SubscriptionUpgradeScreen from '../screens/merchant/profile/SubscriptionUpgradeScreen';

export type RootStackParamList = {
  Login: undefined;
  Registration: undefined;
  Dashboard: undefined;
  UserDashboard: undefined;
  SubscriptionUpgrade: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Login');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const role = await AsyncStorage.getItem('userRole');
        
        if (token) {
          if (role === 'merchant') {
            setInitialRoute('Dashboard');
          } else {
            setInitialRoute('UserDashboard');
          }
        }
      } catch (e) {
        console.error('Failed to check auth:', e);
      } finally {
        setIsReady(true);
      }
    };
    checkAuth();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="Dashboard" component={TabNavigator} />
      <Stack.Screen name="UserDashboard" component={UserTabNavigator} />
      <Stack.Screen name="SubscriptionUpgrade" component={SubscriptionUpgradeScreen} />
    </Stack.Navigator>
  );
}
