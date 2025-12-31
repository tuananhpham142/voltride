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
  // Settings
  LanguageSettings: undefined;
  NotificationsSettings: undefined;
  PrivacySecuritySettings: undefined;
  // Main App Routes
  Profile: undefined;
  Notifications: undefined;
  Settings: undefined;
  
  // Bottom Tab Routes
  Monthly: undefined;
  Shop: undefined;
  Scan: undefined;
};

export type RootScreenProps<S extends keyof RootStackParamList = keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  S
>;
export type AuthStackParamList = {
  Welcome: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ThankyouRegister: undefined;
  CompleteProfile: undefined;
  SocialAuth: { provider: 'facebook' | 'google' | 'apple' };
  Login: undefined;
  OTPVerification: {
    phoneNumber: string;
  };
  VerifyIdentity: undefined;
};
export type MainTabParamList = {
  Home: undefined;
  Monthly: undefined;
  Scan: undefined;
  Shop: undefined;
  Profile: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type RouteProps<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type AuthScreenNavigationProp = CompositeNavigationProp<AuthStackNavigationProp, RootStackNavigationProp>;
export type NavigationParamList = AuthStackParamList & RootStackParamList & MainTabParamList;
