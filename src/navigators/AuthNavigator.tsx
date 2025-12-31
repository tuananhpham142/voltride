// src/navigation/AuthNavigator.tsx

import WelcomeScreen from '@/screens/WelcomeScreen';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { AuthStackParamList } from '../types/navigation';

// Import your auth screens here

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName='Welcome'
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
        cardStyleInterpolator: ({ current }) => ({
          cardStyle: {
            opacity: current.progress,
          },
        }),
      }}
    >
      <Stack.Screen name='Welcome' component={WelcomeScreen} />
    </Stack.Navigator>
  );
};
