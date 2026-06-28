import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PendingFeesScreen from '../screens/merchant/fees/PendingFeesScreen';
import CollectFeeScreen from '../screens/merchant/fees/CollectFeeScreen';
import PaymentHistoryScreen from '../screens/merchant/fees/PaymentHistoryScreen';
import ExpenseTrackingScreen from '../screens/merchant/fees/ExpenseTrackingScreen';
import ExpenseDetailsScreen from '../screens/merchant/fees/ExpenseDetailsScreen';
import AddExpenseScreen from '../screens/merchant/fees/AddExpenseScreen';

const Stack = createNativeStackNavigator();

export default function FeesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="FeesDashboard" component={PendingFeesScreen} />
      <Stack.Screen name="CollectFee" component={CollectFeeScreen} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
      <Stack.Screen name="ExpenseTracking" component={ExpenseTrackingScreen} />
      <Stack.Screen name="ExpenseDetails" component={ExpenseDetailsScreen} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
    </Stack.Navigator>
  );
}
