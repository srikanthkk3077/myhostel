import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import UserComplaintsScreen from '../screens/user/UserComplaintsScreen';
import RaiseComplaintScreen from '../screens/user/RaiseComplaintScreen';
import ComplaintDetailsScreen from '../screens/user/ComplaintDetailsScreen';

export type UserComplaintsStackParamList = {
  UserComplaintsMain: undefined;
  RaiseComplaint: undefined;
  ComplaintDetails: { id: string };
};

const Stack = createNativeStackNavigator<UserComplaintsStackParamList>();

export default function UserComplaintsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserComplaintsMain" component={UserComplaintsScreen} />
      <Stack.Screen name="RaiseComplaint" component={RaiseComplaintScreen} />
      <Stack.Screen name="ComplaintDetails" component={ComplaintDetailsScreen} />
    </Stack.Navigator>
  );
}
