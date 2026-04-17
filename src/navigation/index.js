import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from './Routes';
import { navigationRef } from './NavigationService';
import MainTabs from './MainTabs';
import AuthStack from './AuthStack';
import ScanScreen from '@screens/ScanScreen/ScanScreen';

const Stack = createNativeStackNavigator();
const AppNavigation = () => {
  const onboardingDone = useSelector(state => state.authReducer?.onboarding);
  const scanComplete = useSelector(state => state.authReducer?.scanComplete);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!onboardingDone ? (
          <Stack.Screen name={Routes.AuthStack} component={AuthStack} />
        ) : !scanComplete ? (
          <Stack.Screen name={Routes.ScanScreen} component={ScanScreen} />
        ) : (
          <Stack.Screen name={Routes.MainTabs} component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigation;
