// src/navigation/AppNavigator.tsx
import { LoadingScreen } from '@/components/LoadingScreen';
import CompleteProfileScreen from '@/screens/Auth/CompleteProfileScreen';
import LoginScreen from '@/screens/Auth/LoginScreen';
import OTPVerificationScreen from '@/screens/Auth/OTPVerificationScreen';
import RegisterScreen from '@/screens/Auth/RegisterScreen';
import ThankYouScreen from '@/screens/Auth/ThankyouScreen';
import NotificationScreen from '@/screens/Notification/NotificationScreen';
import EditProfileScreen from '@/screens/ProfileScreen/EditProfileScreen';
import SettingsScreen from '@/screens/SettingScreen';
import LanguageSettingsScreen from '@/screens/SettingScreen/LanguageSetting';
import NotificationsSettingsScreen from '@/screens/SettingScreen/NotificationSetting';
import PrivacySecuritySettingsScreen from '@/screens/SettingScreen/PrivacySetting';
import WelcomeScreen from '@/screens/WelcomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { RootStackParamList } from '../types/navigation';
import { TabbarNavigator } from './TabbarNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const isAuthenticated = false;
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

        {isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen name='Home' component={TabbarNavigator} />

            {/* Notifications */}
            <Stack.Screen name='Notifications' component={NotificationScreen} />

            {/* Settings */}
            <Stack.Screen name='Profile' component={EditProfileScreen} />
            <Stack.Screen name='Settings' component={SettingsScreen} />
            <Stack.Screen name='LanguageSettings' component={LanguageSettingsScreen} />
            <Stack.Screen name='NotificationsSettings' component={NotificationsSettingsScreen} />
            <Stack.Screen name='PrivacySecuritySettings' component={PrivacySecuritySettingsScreen} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='ThankyouRegister' component={ThankYouScreen} />
            <Stack.Screen name='Register' component={RegisterScreen} />
            <Stack.Screen name='OTPVerification' component={OTPVerificationScreen} />
            <Stack.Screen name='CompleteProfile' component={CompleteProfileScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
