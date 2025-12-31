import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

// import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

export type RootStackParamList = AuthStackParamList & {
  Welcome: undefined;
  Showcase: undefined;
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
  Welcome: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type RouteProps<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type AuthScreenNavigationProp = CompositeNavigationProp<AuthStackNavigationProp, RootStackNavigationProp>;
export type NavigationParamList = AuthStackParamList & RootStackParamList & MainTabParamList;
