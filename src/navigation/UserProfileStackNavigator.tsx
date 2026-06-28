import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import UserProfileScreen from '../screens/user/UserProfileScreen';
import EditProfileScreen from '../screens/user/EditProfileScreen';
import SecurityScreen from '../screens/user/SecurityScreen';
import PreferencesScreen from '../screens/user/PreferencesScreen';
import HelpSupportScreen from '../screens/user/HelpSupportScreen';

export type UserProfileStackParamList = {
  UserProfileMain: undefined;
  EditProfile: undefined;
  Security: undefined;
  Preferences: undefined;
  HelpSupport: undefined;
};

const Stack = createNativeStackNavigator<UserProfileStackParamList>();

export default function UserProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserProfileMain" component={UserProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="Preferences" component={PreferencesScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
    </Stack.Navigator>
  );
}
