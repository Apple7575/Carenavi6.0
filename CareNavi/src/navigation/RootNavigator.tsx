// T021: Root Navigator with bottom tabs
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import StoreScreen from '../screens/StoreScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Tab icon placeholder component
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => (
  <Text style={{ fontSize: 20, color: focused ? '#4A90D9' : '#999' }}>
    {name === 'Record' && '📋'}
    {name === 'Home' && '🏠'}
    {name === 'Settings' && '⚙️'}
  </Text>
);

export type RootTabParamList = {
  Record: undefined;
  Home: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: '#4A90D9',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Record"
        component={StoreScreen}
        options={{ tabBarLabel: '기록' }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: '홈' }}
      />
      <Tab.Screen
        name="Settings"
        component={ProfileScreen}
        options={{ tabBarLabel: '관리' }}
      />
    </Tab.Navigator>
  );
}
