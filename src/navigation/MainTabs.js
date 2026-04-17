import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Routes } from './Routes';
import HomeScreen from '@screens/HomeScreen/HomeScreen';
import ProgressScreen from '@screens/ProgressScreen/ProgressScreen';
import ChatBotScreen from '@screens/ChatBotScreen/ChatBotScreen';
import ProfileScreen from '@screens/ProfileScreen/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName={Routes.HomeScreen}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name={Routes.HomeScreen}
        component={HomeScreen}
        options={{ title: 'Home' }}
      
      />
      <Tab.Screen
        name={Routes.ProgressScreen}
        component={ProgressScreen}
        options={{ title: 'Progress' }}
      />
      <Tab.Screen
        name={Routes.ChatBotScreen}
        component={ChatBotScreen}
        options={{ title: 'ChatBot' }}
      />
      <Tab.Screen
        name={Routes.ProfileScreen}
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
