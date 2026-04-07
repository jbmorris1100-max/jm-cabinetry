import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

import DashboardScreen from '../screens/DashboardScreen';
import ProductionScreen from '../screens/ProductionScreen';
import CraftsmanScreen from '../screens/CraftsmanScreen';
import TeamScreen from '../screens/TeamScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgHeader,
          borderTopColor: colors.borderSub,
          borderTopWidth: 1,
          paddingBottom: 6,
          paddingTop: 6,
          height: 62,
        },
        tabBarActiveTintColor: colors.amber,
        tabBarInactiveTintColor: colors.textTiny,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'monospace',
          letterSpacing: 0.5,
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Dashboard: focused ? 'grid' : 'grid-outline',
            Production: focused ? 'layers' : 'layers-outline',
            Craftsman: focused ? 'construct' : 'construct-outline',
            Team: focused ? 'people' : 'people-outline',
          };
          return <Ionicons name={icons[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Production" component={ProductionScreen} />
      <Tab.Screen name="Craftsman" component={CraftsmanScreen} />
      <Tab.Screen name="Team" component={TeamScreen} />
    </Tab.Navigator>
  );
}
