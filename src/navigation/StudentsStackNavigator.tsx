import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentsListScreen from '../screens/merchant/members/StudentsListScreen';
import RegisterStudentScreen from '../screens/merchant/members/RegisterStudentScreen';
import StudentDetailsScreen from '../screens/merchant/members/StudentDetailsScreen';
import MemberTransactionsScreen from '../screens/merchant/members/MemberTransactionsScreen';

const Stack = createNativeStackNavigator();

export default function StudentsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="StudentsList" component={StudentsListScreen} />
      <Stack.Screen name="RegisterStudent" component={RegisterStudentScreen} />
      <Stack.Screen name="StudentDetails" component={StudentDetailsScreen} />
      <Stack.Screen name="MemberTransactions" component={MemberTransactionsScreen} />
    </Stack.Navigator>
  );
}
