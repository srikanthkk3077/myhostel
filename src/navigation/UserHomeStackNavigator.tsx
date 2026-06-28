import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import UserDashboardScreen from '../screens/user/UserDashboardScreen';
import GatePassScreen from '../screens/user/GatePassScreen';
import MessRebateScreen from '../screens/user/MessRebateScreen';
import NoticeBoardScreen from '../screens/user/NoticeBoardScreen';

export type UserHomeStackParamList = {
  UserDashboardMain: undefined;
  GatePass: undefined;
  MessRebate: undefined;
  NoticeBoard: undefined;
};

const Stack = createNativeStackNavigator<UserHomeStackParamList>();

export default function UserHomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserDashboardMain" component={UserDashboardScreen} />
      <Stack.Screen name="GatePass" component={GatePassScreen} />
      <Stack.Screen name="MessRebate" component={MessRebateScreen} />
      <Stack.Screen name="NoticeBoard" component={NoticeBoardScreen} />
    </Stack.Navigator>
  );
}
