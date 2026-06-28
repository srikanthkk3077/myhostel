import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import UserDashboardScreen from '../screens/user/UserDashboardScreen';
import VisitorRequestsScreen from '../screens/user/VisitorRequestsScreen';
import ApplyVisitorRequestScreen from '../screens/user/ApplyVisitorRequestScreen';
import MessRebateScreen from '../screens/user/MessRebateScreen';
import NoticeBoardScreen from '../screens/user/NoticeBoardScreen';

export type UserHomeStackParamList = {
  UserDashboardMain: undefined;
  VisitorRequests: undefined;
  ApplyVisitorRequest: undefined;
  MessRebate: undefined;
  NoticeBoard: undefined;
};

const Stack = createNativeStackNavigator<UserHomeStackParamList>();

export default function UserHomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserDashboardMain" component={UserDashboardScreen} />
      <Stack.Screen name="VisitorRequests" component={VisitorRequestsScreen} />
      <Stack.Screen name="ApplyVisitorRequest" component={ApplyVisitorRequestScreen} />
      <Stack.Screen name="MessRebate" component={MessRebateScreen} />
      <Stack.Screen name="NoticeBoard" component={NoticeBoardScreen} />
    </Stack.Navigator>
  );
}
