import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import UserPaymentsScreen from '../screens/user/UserPaymentsScreen';
import CheckoutScreen from '../screens/user/CheckoutScreen';
import ReceiptScreen from '../screens/user/ReceiptScreen';

export type UserPaymentsStackParamList = {
  UserPaymentsMain: undefined;
  Checkout: undefined;
  Receipt: undefined;
};

const Stack = createNativeStackNavigator<UserPaymentsStackParamList>();

export default function UserPaymentsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserPaymentsMain" component={UserPaymentsScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Receipt" component={ReceiptScreen} />
    </Stack.Navigator>
  );
}
