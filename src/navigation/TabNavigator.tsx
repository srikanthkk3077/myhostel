import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, Building2, Users, CreditCard } from 'lucide-react-native';
import { View, Text, StyleSheet } from 'react-native';
import DashboardStackNavigator from './DashboardStackNavigator';
import RoomsStackNavigator from './RoomsStackNavigator';
import StudentsStackNavigator from './StudentsStackNavigator';
import FeesStackNavigator from './FeesStackNavigator';
import { colors, typography } from '../theme/colors';

const Tab = createBottomTabNavigator();

// Placeholder screens for other tabs
function PlaceholderScreen({ name }: { name: string }) {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>{name} Screen</Text>
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          let IconComponent;
          let label = '';
          if (route.name === 'DashboardTab') {
            IconComponent = LayoutDashboard;
            label = 'Dashboard';
          } else if (route.name === 'RoomsTab') {
            IconComponent = Building2;
            label = 'Rooms';
          } else if (route.name === 'StudentsTab') {
            IconComponent = Users;
            label = 'Members';
          } else if (route.name === 'FeesTab') {
            IconComponent = CreditCard;
            label = 'Fees';
          }

          if (!IconComponent) return null;

          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? `${colors.primary}15` : 'transparent',
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 20,
              }}
            >
              <IconComponent 
                color={focused ? colors.primary : colors.textSecondary} 
                size={22} 
              />
              <Text 
                style={{
                  color: focused ? colors.primary : colors.textSecondary,
                  fontSize: 10,
                  fontWeight: focused ? '700' : '500',
                  marginTop: 2,
                }}
              >
                {label}
              </Text>
            </View>
          );
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          backgroundColor: colors.surface,
          borderRadius: 30,
          height: 70,
          borderTopWidth: 0,
          paddingBottom: 0,
          paddingTop: 0,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 10,
        },
      })}
    >
      <Tab.Screen name="DashboardTab" component={DashboardStackNavigator} />
      <Tab.Screen name="RoomsTab" component={RoomsStackNavigator} />
      <Tab.Screen name="StudentsTab" component={StudentsStackNavigator} />
      <Tab.Screen name="FeesTab" component={FeesStackNavigator} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...typography.h2,
    color: colors.textSecondary,
  },
});
