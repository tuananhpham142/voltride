import { CustomButton } from '@/components/CustomButton';
import { UploadBox } from '@/components/UploadBox';
import { useTheme } from '@/hooks/useTheme';
import { RootStackParamList } from '@/types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyIdentity'>;

interface UploadedFile {
  uri: string;
  fileName: string;
  type: string;
}

export const VerifyIdentityScreen: React.FC<Props> = ({ navigation }) => {
  const { isDark } = useTheme();
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = () => {
    Alert.alert(
      'Upload ID',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => openCamera(),
        },
        {
          text: 'Choose from Library',
          onPress: () => openImageLibrary(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const openCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      cameraType: 'back',
      quality: 0.8,
    });

    if (result.assets && result.assets[0]) {
      setUploadedFile({
        uri: result.assets[0].uri || '',
        fileName: result.assets[0].fileName || 'photo.jpg',
        type: result.assets[0].type || 'image/jpeg',
      });
    }
  };

  const openImageLibrary = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets[0]) {
      setUploadedFile({
        uri: result.assets[0].uri || '',
        fileName: result.assets[0].fileName || 'image.jpg',
        type: result.assets[0].type || 'image/jpeg',
      });
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Verification',
      'You can verify your identity later in settings. Continue without verification?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          onPress: () => navigation.navigate('Home'),
        },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!uploadedFile) {
      Alert.alert('No File', 'Please upload your ID document first');
      return;
    }

    try {
      setIsLoading(true);
      // Add your file upload logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      Alert.alert(
        'Success',
        'Your identity has been submitted for verification',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="px-6"
      >
        <View className="flex-1 py-8">
          {/* Header */}
          <View className="mb-8">
            <Text
              className={`text-4xl font-bold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Verify Identity
            </Text>
            <Text
              className={`text-base leading-6 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Upload a photo of your Driver's License or ID card to activate
              your account.
            </Text>
          </View>

          {/* Upload Box */}
          <UploadBox
            title="Tap to upload ID"
            subtitle="JPG, PNG or PDF (max. 5MB)"
            onPress={handleUpload}
            isUploaded={!!uploadedFile}
            uploadedFileName={uploadedFile?.fileName}
            className="mb-8"
          />

          {/* Info Card */}
          <View
            className={`rounded-2xl p-4 mb-8 border ${
              isDark
                ? 'bg-primary-900/20 border-blue-800/30'
                : 'bg-primary-50 border-blue-200'
            }`}
          >
            <View className="flex-row">
              <View className="mr-3 mt-0.5">
                <View
                  className={`w-6 h-6 rounded-full items-center justify-center ${
                    isDark ? 'bg-blue-800' : 'bg-primary-100'
                  }`}
                >
                  <Text className="text-primary-300 text-sm font-bold">ℹ️</Text>
                </View>
              </View>
              <View className="flex-1">
                <Text
                  className={`text-sm font-semibold mb-1 ${
                    isDark ? 'text-blue-400' : 'text-blue-900'
                  }`}
                >
                  Why do we need this?
                </Text>
                <Text
                  className={`text-xs leading-5 ${
                    isDark ? 'text-blue-300/80' : 'text-blue-800'
                  }`}
                >
                  We verify your identity to ensure the safety and security of
                  all riders in our community.
                </Text>
              </View>
            </View>
          </View>

          {/* Spacer */}
          <View className="flex-1" />

          {/* Buttons */}
          <View className="gap-3">
            <CustomButton
              title={uploadedFile ? 'Submit for Verification' : 'Upload Document'}
              onPress={uploadedFile ? handleSubmit : handleUpload}
              isLoading={isLoading}
              icon={uploadedFile ? 'check' : 'upload'}
            />

            <TouchableOpacity
              onPress={handleSkip}
              className="py-4 items-center"
              activeOpacity={0.7}
            >
              <Text
                className={`text-sm font-semibold ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Skip for now (Demo only)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
