import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, CreditCard, PenTool, User } from 'lucide-react-native';
import { colors } from '../theme/colors';

import UserHomeStackNavigator from './UserHomeStackNavigator';
import UserPaymentsStackNavigator from './UserPaymentsStackNavigator';
import UserComplaintsStackNavigator from './UserComplaintsStackNavigator';
import UserProfileStackNavigator from './UserProfileStackNavigator';

const Tab = createBottomTabNavigator();

const CustomTabBarIcon = ({ focused, Icon }: { focused: boolean; Icon: any }) => {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <Icon
        color={focused ? colors.primary : colors.textTertiary}
        size={24}
        strokeWidth={focused ? 2.5 : 2}
      />
    </View>
  );
};

export default function UserTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tab.Screen
        name="HomeTab"
        component={UserHomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <CustomTabBarIcon focused={focused} Icon={Home} />,
        }}
      />
      <Tab.Screen
        name="PaymentsTab"
        component={UserPaymentsStackNavigator}
        options={{
          tabBarLabel: 'Payments',
          tabBarIcon: ({ focused }) => <CustomTabBarIcon focused={focused} Icon={CreditCard} />,
        }}
      />
      <Tab.Screen
        name="ComplaintsTab"
        component={UserComplaintsStackNavigator}
        options={{
          tabBarLabel: 'Complaints',
          tabBarIcon: ({ focused }) => <CustomTabBarIcon focused={focused} Icon={PenTool} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={UserProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <CustomTabBarIcon focused={focused} Icon={User} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 88 : 70,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    paddingTop: 10,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 16,
  },
  iconContainerFocused: {
    backgroundColor: colors.primaryBg,
  },
});
