import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { SocialButton } from '@/components/SocialButton';
import { useTheme } from '@/hooks/useTheme';
import { RootStackParamList } from '@/types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

 const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { isDark } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
      return;
    }

    try {
      setIsLoading(true);
      // Add your phone authentication logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Navigate to OTP verification screen
      navigation.navigate('OTPVerification', {
        phoneNumber: `${countryCode} ${phoneNumber}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = (provider: 'github' | 'twitter' | 'google' | 'apple') => {
    Alert.alert('Social Auth', `Authenticating with ${provider}`);
    // Add your social authentication logic here
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          className="px-6"
        >
          <View className="flex-1 justify-center py-8">
            {/* Header */}
            <View className="mb-12">
              <Text
                className={`text-4xl font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Welcome Back
              </Text>
              <Text
                className={`text-base ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Sign in to start riding.
              </Text>
            </View>

            {/* Tab Selector */}
            <View
              className={`flex-row p-1 rounded-2xl mb-6 ${
                isDark ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <View className="flex-1 bg-gray-700 rounded-xl py-3">
                <Text className="text-white text-center font-semibold">
                  Phone Number
                </Text>
              </View>
              <View className="flex-1 rounded-xl py-3">
                <Text
                  className={`text-center font-semibold ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Email
                </Text>
              </View>
            </View>

            {/* Phone Number Input */}
            <View className="mb-6">
              <Text
                className={`text-sm font-medium mb-3 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Phone Number
              </Text>
              <View
                className={`flex-row rounded-2xl border overflow-hidden ${
                  isDark
                    ? 'bg-gray-800/50 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}
              >
                {/* Country Code Input */}
                <View
                  className={`px-4 justify-center border-r ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <Text
                    className={`text-base font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {countryCode}
                  </Text>
                </View>

                {/* Phone Number Input */}
                <CustomInput
                  value={phoneNumber}
                  onChangeText={text => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
                  placeholder="Phone number"
                  keyboardType="phone-pad"
                  maxLength={15}
                  icon="phone"
                  containerClassName="mb-0 flex-1"
                  inputClassName="border-0"
                />
              </View>
            </View>

            {/* Continue Button */}
            <CustomButton
              title="Continue"
              onPress={handleContinue}
              isLoading={isLoading}
              icon="arrow-right"
              className="mb-8"
            />

            {/* Divider */}
            <View className="flex-row items-center mb-8">
              <View
                className={`flex-1 h-px ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}
              />
              <Text
                className={`mx-4 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Or continue with
              </Text>
              <View
                className={`flex-1 h-px ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}
              />
            </View>

            {/* Social Login Buttons */}
            <View className="flex-row gap-4 mb-8">
              <SocialButton
                provider="github"
                onPress={() => handleSocialAuth('github')}
              />
              <SocialButton
                provider="twitter"
                onPress={() => handleSocialAuth('twitter')}
              />
            </View>

            {/* Terms */}
            <Text
              className={`text-xs text-center leading-5 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              By continuing you agree to our{' '}
              <Text className="text-primary-300">Terms</Text> &{' '}
              <Text className="text-primary-300">Privacy Policy</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
 };
export default LoginScreen
