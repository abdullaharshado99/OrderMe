import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from './Routes';
import OnBordingScreen from '@screens/OnBoardingScreen/OnBoardingScreen';
import ScanScreen from '@screens/ScanScreen/ScanScreen';

export default function AuthStack() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName={Routes.OnBordingScreen}
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true,
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name={Routes.OnBordingScreen} component={OnBordingScreen} />
      <Stack.Screen name={Routes.ScanScreen} component={ScanScreen} />
    </Stack.Navigator>
  );
}
