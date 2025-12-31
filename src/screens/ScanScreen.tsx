import { CustomButton } from '@/components/CustomButton';
import { useTheme } from '@/hooks/useTheme';
import { RootStackParamList } from '@/types/navigation';
import Icon from '@react-native-vector-icons/fontawesome6';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Scan'>;

 const ScanScreen: React.FC<Props> = ({ navigation }) => {
  const { isDark } = useTheme();
  const [isScanning, setIsScanning] = useState(false);

  const handleStartScan = () => {
    setIsScanning(true);
    // Simulate scanning
    setTimeout(() => {
      setIsScanning(false);
      Alert.alert(
        'QR Code Scanned',
        'Bike #V12345 is now unlocked!',
        [
          {
            text: 'Start Ride',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    }, 2000);
  };

  const handleManualEntry = () => {
    Alert.alert(
      'Enter Bike ID',
      'Please enter the bike ID manually',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
    >
      <View className="flex-1 px-6 pt-6">
        {/* Header */}
        <View className="mb-8">
          <Text
            className={`text-3xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Scan QR Code
          </Text>
          <Text
            className={`text-base ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Position the QR code within the frame
          </Text>
        </View>

        {/* Scanner Area */}
        <View className="flex-1 items-center justify-center mb-8">
          <View
            className={`relative w-64 h-64 rounded-3xl border-4 items-center justify-center ${
              isScanning
                ? 'border-success bg-success/10'
                : isDark
                ? 'border-gray-700 bg-gray-800/50'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            {/* Corner Decorations */}
            <View className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-success rounded-tl-2xl" />
            <View className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-success rounded-tr-2xl" />
            <View className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-success rounded-bl-2xl" />
            <View className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-success rounded-br-2xl" />

            {/* Center Icon */}
            <View
              className={`w-24 h-24 rounded-3xl items-center justify-center ${
                isScanning
                  ? 'bg-success'
                  : isDark
                  ? 'bg-gray-700'
                  : 'bg-gray-200'
              }`}
            >
              <Icon
                name={isScanning ? 'spinner' : 'qrcode'}
                iconStyle="solid"
                size={48}
                color={isScanning ? '#FFFFFF' : isDark ? '#9CA3AF' : '#6B7280'}
              />
            </View>

            {/* Scanning Line Animation */}
            {isScanning && (
              <View className="absolute top-1/2 left-0 right-0 h-1 bg-success opacity-50" />
            )}
          </View>

          {/* Status Text */}
          <Text
            className={`text-center text-base mt-8 ${
              isScanning
                ? 'text-success font-semibold'
                : isDark
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}
          >
            {isScanning ? 'Scanning...' : 'Position QR code in the frame'}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="gap-3 mb-8">
          <CustomButton
            title={isScanning ? 'Scanning...' : 'Start Scanning'}
            onPress={handleStartScan}
            isLoading={isScanning}
            icon="qrcode"
            variant="primary"
          />

          <TouchableOpacity
            onPress={handleManualEntry}
            className={`py-4 rounded-2xl border ${
              isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-gray-50 border-gray-200'
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-center text-base font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Enter Bike ID Manually
            </Text>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <View
          className={`rounded-2xl p-4 border ${
            isDark
              ? 'bg-primary-900/20 border-blue-800/30'
              : 'bg-primary-50 border-blue-200'
          }`}
        >
          <View className="flex-row">
            <Icon
              name="circle-info"
              iconStyle="solid"
              size={20}
              color={isDark ? '#60A5FA' : '#3B82F6'}
              style={{ marginRight: 12, marginTop: 2 }}
            />
            <View className="flex-1">
              <Text
                className={`text-sm font-semibold mb-1 ${
                  isDark ? 'text-blue-400' : 'text-blue-900'
                }`}
              >
                How to scan
              </Text>
              <Text
                className={`text-xs leading-5 ${
                  isDark ? 'text-blue-300/80' : 'text-blue-800'
                }`}
              >
                Point your camera at the QR code on the bike's handlebars. Hold
                steady until the scan completes.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default ScanScreen