import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

// import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

export type RootStackParamList = AuthStackParamList & {
  Auth: undefined;
  Main: undefined;
  Loading: undefined;
  Home: undefined;

  // Utility Screens
  ImageViewer: {
    images: string[];
    initialIndex?: number;
  };
  // Notifications
  Notifications: undefined;
  // Settings
  Profile: undefined;
  Settings: undefined;
  LanguageSettings: undefined;
  NotificationsSettings: undefined;
  PrivacySecuritySettings: undefined;
};

export type RootScreenProps<S extends keyof RootStackParamList = keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  S
>;
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ThankyouRegister: undefined;
  OTPVerification: undefined;
  CompleteProfile: undefined;
  SocialAuth: { provider: 'facebook' | 'google' | 'apple' };
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Notifications: undefined;
  Auth: undefined;
  Settings: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type RouteProps<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type AuthScreenNavigationProp = CompositeNavigationProp<AuthStackNavigationProp, RootStackNavigationProp>;
export type NavigationParamList = AuthStackParamList & RootStackParamList & MainTabParamList;
