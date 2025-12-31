import { CustomButton } from '@/components/CustomButton';
import { SocialButton } from '@/components/SocialButton';
import { useTheme } from '@/hooks/useTheme';
import { RootStackParamList } from '@/types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'OTPVerification'>;

 const OTPVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { isDark } = useTheme();
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    // Start countdown timer
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit code');
      return;
    }

    try {
      setIsLoading(true);
      // Add your OTP verification logic here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Navigate to next screen (e.g., Home or CompleteProfile)
      navigation.navigate('Welcome');
    } catch (error) {
      Alert.alert('Error', 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
    const handleSocialAuth = (provider: 'github' | 'twitter' | 'google' | 'apple') => {
      Alert.alert('Social Auth', `Authenticating with ${provider}`);
      // Add your social authentication logic here
    };

  const handleResend = () => {
    if (timer > 0) return;
    
    Alert.alert('OTP Resent', 'A new verification code has been sent to your phone');
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
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

            {/* Phone Number Display */}
            <View className="mb-6">
              <Text
                className={`text-sm font-medium mb-3 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Phone Number
              </Text>
              <View
                className={`rounded-2xl border px-4 py-4 ${
                  isDark
                    ? 'bg-gray-800/50 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text
                  className={`text-base ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {phoneNumber}
                </Text>
              </View>
            </View>

            {/* OTP Input */}
            <View className="mb-8">
              <Text
                className={`text-sm font-medium mb-3 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                One-Time Password
              </Text>
              <View
                className={`rounded-2xl border px-6 py-6 ${
                  isDark
                    ? 'bg-gradient-to-r from-teal-500/10 to-teal-500/5 border-teal-500/30'
                    : 'bg-teal-50 border-teal-200'
                }`}
              >
                <View className="flex-row justify-between">
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      //@ts-ignore
                      ref={ref => (inputRefs.current[index] = ref)}
                      value={digit}
                      onChangeText={value => handleOtpChange(value, index)}
                      onKeyPress={e => handleKeyPress(e, index)}
                      keyboardType="number-pad"
                      placeholder='-'
                      maxLength={1}
                      className={`text-center text-2xl font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                      style={{ width: 40 }}
                    />
                  ))}
                </View>
              </View>

              {/* Resend Timer */}
              <View className="mt-3 flex-row justify-center">
                {timer > 0 ? (
                  <Text
                    className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Resend code in {timer}s
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleResend}>
                    <Text className="text-sm text-primary-300 font-semibold">
                      Resend Code
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Verify Button */}
            <CustomButton
              title="Verify & Login"
              onPress={handleVerify}
              isLoading={isLoading}
              icon="arrow-right"
              className="mb-8"
            />

            {/* Social Login Buttons */}
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
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

 export default OTPVerificationScreen
