// src/navigation/AppNavigator.tsx
import { LoadingScreen } from '@/components/LoadingScreen';
import {
  CODPaymentScreen,
  DashboardScreen,
  DeliveryCompleteScreen,
  DeliveryPointScreen,
  PODCaptureScreen,
  TripDetailScreen,
  TripListScreen,
  TripNavigationScreen,
} from '@/screens';
import AllComponentsShowcase from '@/screens/AllComponentsShowcase';
import WelcomeScreen from '@/screens/WelcomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  // const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: Platform.select({
            ios: 'default',
            android: 'slide_from_right',
          }),
          animationDuration: 250,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          fullScreenGestureEnabled: true,
        }}
      >
        <Stack.Screen name='Welcome' component={WelcomeScreen} />
        <Stack.Screen name='Showcase' component={AllComponentsShowcase} />

        <Stack.Screen name='Dashboard' component={DashboardScreen} />
        <Stack.Screen name='TripList' component={TripListScreen} />
        <Stack.Screen name='TripDetail' component={TripDetailScreen} />
        <Stack.Screen name='TripNavigation' component={TripNavigationScreen} />
        <Stack.Screen name='DeliveryPoint' component={DeliveryPointScreen} />
        <Stack.Screen name='PODCapture' component={PODCaptureScreen} />
        <Stack.Screen name='CODPayment' component={CODPaymentScreen} />
        <Stack.Screen name='DeliveryComplete' component={DeliveryCompleteScreen} />
        {/* {isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen name='Home' component={TabbarNavigator} />

         
          </Stack.Group>
        ) : (
          <Stack.Group>
       
          </Stack.Group>
        )} */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
