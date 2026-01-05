// src/types/navigation.ts

import { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Root Stack Parameter List
 * Defines all 13 screens and their required parameters
 */
export type RootStackParamList = {
  // Dashboard & Driver Management
  Dashboard: undefined;
  ProfileSettings: undefined;
  Earnings: undefined;

  // Trip Screens
  TripList: undefined;
  TripDetail: {
    tripId: string;
    autoStart?: boolean;
  };
  TripNavigation: {
    tripId: string;
  };

  // Delivery Screens
  DeliveryPoint: {
    deliveryPointId: string;
  };
  PODCapture: {
    deliveryPointId: string;
  };
  DeliveryComplete: {
    deliveryPointId: string;
  };

  // Payment Screens
  CODPayment: {
    deliveryPointId: string;
  };

  // Common Screens
  QRScanner: {
    deliveryPointId: string;
    onScan: (data: string) => void;
  };
  Notifications: undefined;
  HelpCenter: undefined;

  // Additional Screens (if needed)
  DocumentUpload?: {
    type: 'DRIVERS_LICENSE' | 'VEHICLE_REGISTRATION' | 'INSURANCE';
  };
  SupportChat?: undefined;
  About?: undefined;

  // Existing screens
  Welcome?: undefined;
  Showcase?: undefined;
};


export type MainTabParamList = {
  Welcome: undefined;
};


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

/**
 * Screen Props Types
 * Use these for screen components with proper TypeScript typing
 */

// Dashboard & Driver
export type DashboardScreenProps = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;
export type ProfileSettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'ProfileSettings'>;
export type EarningsScreenProps = NativeStackScreenProps<RootStackParamList, 'Earnings'>;

// Trip Screens
export type TripListScreenProps = NativeStackScreenProps<RootStackParamList, 'TripList'>;
export type TripDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'TripDetail'>;
export type TripNavigationScreenProps = NativeStackScreenProps<RootStackParamList, 'TripNavigation'>;

// Delivery Screens
export type DeliveryPointScreenProps = NativeStackScreenProps<RootStackParamList, 'DeliveryPoint'>;
export type PODCaptureScreenProps = NativeStackScreenProps<RootStackParamList, 'PODCapture'>;
export type DeliveryCompleteScreenProps = NativeStackScreenProps<RootStackParamList, 'DeliveryComplete'>;

// Payment Screens
export type CODPaymentScreenProps = NativeStackScreenProps<RootStackParamList, 'CODPayment'>;

// Common Screens
export type QRScannerScreenProps = NativeStackScreenProps<RootStackParamList, 'QRScanner'>;
export type NotificationsScreenProps = NativeStackScreenProps<RootStackParamList, 'Notifications'>;
export type HelpCenterScreenProps = NativeStackScreenProps<RootStackParamList, 'HelpCenter'>;

/**
 * Navigation Prop Type
 * Use for navigation object in hooks or utilities
 */
export type RootStackNavigationProp = NativeStackScreenProps<RootStackParamList>['navigation'];

/**
 * Example Usage:
 * 
 * // In a screen component with typed props
 * const MyScreen: React.FC<TripDetailScreenProps> = ({ navigation, route }) => {
 *   const { tripId } = route.params;
 *   navigation.navigate('TripNavigation', { tripId });
 * };
 * 
 * // In a hook with navigation
 * const useMyHook = () => {
 *   const navigation = useNavigation<RootStackNavigationProp>();
 *   navigation.navigate('Dashboard');
 * };
 * 
 * // Navigate with parameters
 * navigation.navigate('DeliveryPoint', { deliveryPointId: '123' });
 * 
 * // Navigate and replace (no back button)
 * navigation.replace('TripNavigation', { tripId: '456' });
 * 
 * // Go back
 * navigation.goBack();
 * 
 * // Reset navigation stack
 * navigation.reset({
 *   index: 0,
 *   routes: [{ name: 'Dashboard' }],
 * });
 */
