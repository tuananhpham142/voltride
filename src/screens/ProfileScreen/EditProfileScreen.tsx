// src/screens/Profile/EditProfileScreen.tsx
import AppLayout from '@/components/layout/AppLayout';
import { setUser } from '@/store/slices/authSlice';
import { getMyProfile, updateUserProfile, uploadAvatar } from '@/store/slices/userSlice';
import { AppDispatch, RootState } from '@/store/store';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { GENDER_OPTIONS, GenderOption } from './profile.types';

interface FormData {
  fullName: string;
  dateOfBirth: Date;
  gender: GenderOption | null;
  mobileNumber: string;
  email: string;
  weight: string;
  height: string;
}

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const { isUpdating, isUploadingAvatar, currentUser } = useSelector((state: RootState) => state.user);
  const [refreshing, setRefreshing] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: new Date('2002-07-07'),
    gender: null,
    mobileNumber: '',
    email: '',
    weight: '',
    height: '',
  });

  useEffect(() => {
    dispatch(getMyProfile({}));
  }, [dispatch, token]);

  useEffect(() => {
    console.log(currentUser);
    if (currentUser) {
      setFormData({
        fullName: `${currentUser.name || ''}`.trim(),
        dateOfBirth: new Date('2002-07-07'),
        gender: null,
        mobileNumber: currentUser.email || '',
        email: currentUser.email || '',
        weight: '',
        height: '',
      });
    }
  }, [currentUser]);
  const renderDatePicker = () => (
    <Modal visible={showDatePicker} transparent animationType='slide' onRequestClose={handleDatePickerClose}>
      <View className='flex-1 justify-end'>
        <View className='bg-white rounded-t-3xl'>
          <View className='flex-row justify-between items-center px-6 py-4 bg-white border-b border-gray-100'>
            <TouchableOpacity onPress={handleDatePickerClose}>
              <Text className='text-blue-600 font-medium text-base'>Close</Text>
            </TouchableOpacity>

            <Text className='font-semibold text-lg text-gray-900'>Select Completion Date</Text>

            <TouchableOpacity onPress={handleDatePickerSave}>
              <Text className='font-medium text-base text-blue-600'>Save</Text>
            </TouchableOpacity>
          </View>

          <View className='p-4'>
            <DateTimePicker
              value={tempDate}
              mode='date'
              display='spinner'
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setTempDate(selectedDate);
                }
              }}
              textColor='#000000'
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  const handleDatePickerClose = useCallback(() => {
    setShowDatePicker(false);
    setTempDate(formData.dateOfBirth);
  }, [formData.dateOfBirth]);

  const handleDatePickerSave = useCallback(() => {
    setFormData((old) => ({
      ...old,
      dateOfBirth: tempDate,
    }));
    setShowDatePicker(false);
  }, [tempDate]);

  const handlePickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
        maxWidth: 1000,
        maxHeight: 1000,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Failed to pick image');
        return;
      }

      if (result.assets && result.assets[0] && currentUser?.id) {
        const asset = result.assets[0];
        const formDataAvatar = new FormData();

        formDataAvatar.append('file', {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || 'avatar.jpg',
        } as any);

        const resultAction = await dispatch(uploadAvatar({ userId: currentUser.id, formData: formDataAvatar }));

        if (uploadAvatar.fulfilled.match(resultAction)) {
          Alert.alert('Success', 'Avatar updated successfully');
          // Update auth user state
          dispatch(setUser(resultAction.payload.user));
        } else {
          Alert.alert('Error', resultAction.payload as string);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload avatar');
      console.error('Avatar upload error:', error);
    }
  };

  const handleDateConfirm = (date: Date) => {
    setFormData({ ...formData, dateOfBirth: date });
    setDatePickerVisible(false);
  };

  const handleSave = async () => {
    if (!currentUser?.id) return;
    try {
      const [firstName, ...lastNameParts] = formData.fullName.split(' ');
      const lastName = lastNameParts.join(' ');

      const updateData = {
        id: currentUser.id,
        firstName: firstName || '',
        lastName: lastName || '',
        phoneNumber: formData.mobileNumber,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth.toISOString(),
        gender: formData.gender || undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
      };

      const resultAction = await dispatch(updateUserProfile(updateData));

      if (updateUserProfile.fulfilled.match(resultAction)) {
        Alert.alert('Success', 'Profile updated successfully');
        // Update auth user state
        dispatch(setUser(resultAction.payload));
        navigation.goBack();
      } else {
        Alert.alert('Error', resultAction.payload as string);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error('Profile update error:', error);
    }
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleString('en', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  return (
    <AppLayout>
      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor='#8B5CF6' />}
      >
        {/* Avatar Section */}
        <View className='items-center mb-8'>
          <View className='relative'>
            <Image
              source={
                currentUser?.avatar
                  ? { uri: currentUser.avatar }
                  : { uri: 'https://i.pinimg.com/1200x/05/ad/11/05ad113ccb60629835d19dc0e013c5e4.jpg' }
              }
              className='w-28 h-28 rounded-full'
            />
            <TouchableOpacity
              onPress={handlePickImage}
              className='absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full items-center justify-center border-4 border-white'
              disabled={isUploadingAvatar}
            >
              {isUploadingAvatar ? (
                <ActivityIndicator size='small' color='#fff' />
              ) : (
                <Icon iconStyle='solid' name='camera' size={18} color='#fff' />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View className='px-6'>
          {/* Basic Detail Section */}
          <Text className='text-lg font-bold text-gray-900 mb-4'>Basic Detail</Text>

          <View className='mb-4'>
            <Text className='text-sm font-medium text-gray-700 mb-2'>Full name</Text>
            <TextInput
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              placeholder='Enter your full name'
              className='bg-white rounded-xl px-4 py-3.5 text-gray-900 border border-gray-200'
            />
          </View>

          <View className='mb-4'>
            <Text className='text-sm font-medium text-gray-700 mb-2'>Date of birth</Text>
            <TouchableOpacity
              onPress={() => setDatePickerVisible(true)}
              className='bg-white rounded-xl px-4 py-3.5 flex-row justify-between items-center border border-gray-200'
            >
              <Text className='text-gray-900'>{formatDate(formData.dateOfBirth)}</Text>
              <Icon name='chevron-down' iconStyle='solid' size={20} color='#9CA3AF' />
            </TouchableOpacity>
          </View>

          {renderDatePicker()}

          <View className='mb-6'>
            <Text className='text-sm font-medium text-gray-700 mb-2'>Gender</Text>
            <View className='flex-row gap-3'>
              {GENDER_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setFormData({ ...formData, gender: option.value })}
                  className={`flex-1 py-3.5 rounded-xl border ${
                    formData.gender === option.value ? 'bg-primary-50 border-primary-300' : 'bg-white border-gray-200'
                  }`}
                >
                  <View className='flex-row items-center justify-center'>
                    <View
                      className={`w-5 h-5 rounded-full border-2 mr-2 items-center justify-center ${
                        formData.gender === option.value ? 'border-primary-300' : 'border-gray-300'
                      }`}
                    >
                      {formData.gender === option.value && <View className='w-3 h-3 rounded-full bg-primary' />}
                    </View>
                    <Text
                      className={`font-medium ${formData.gender === option.value ? 'text-blue-600' : 'text-gray-700'}`}
                    >
                      {option.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Contact Detail Section */}
          <Text className='text-lg font-bold text-gray-900 mb-4 mt-2'>Contact Detail</Text>

          <View className='mb-4'>
            <Text className='text-sm font-medium text-gray-700 mb-2'>Mobile number</Text>
            <TextInput
              value={formData.mobileNumber}
              onChangeText={(text) => setFormData({ ...formData, mobileNumber: text })}
              placeholder='+62 821 1234 1234'
              keyboardType='phone-pad'
              className='bg-white rounded-xl px-4 py-3.5 text-gray-900 border border-gray-200'
            />
          </View>

          <View className='mb-6'>
            <Text className='text-sm font-medium text-gray-700 mb-2'>Email</Text>
            <TextInput
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder='your.email@example.com'
              keyboardType='email-address'
              autoCapitalize='none'
              className='bg-white rounded-xl px-4 py-3.5 text-gray-900 border border-gray-200'
            />
          </View>

          {/* Personal Detail Section */}
          <Text className='text-lg font-bold text-gray-900 mb-4 mt-2'>Personal Detail</Text>

          <View className='mb-4'>
            <Text className='text-sm font-medium text-gray-700 mb-2'>Weight (kg)</Text>
            <TextInput
              value={formData.weight}
              onChangeText={(text) => setFormData({ ...formData, weight: text })}
              placeholder='64'
              keyboardType='decimal-pad'
              className='bg-white rounded-xl px-4 py-3.5 text-gray-900 border border-gray-200'
            />
          </View>

          <View className='mb-8'>
            <Text className='text-sm font-medium text-gray-700 mb-2'>Height (cm)</Text>
            <TextInput
              value={formData.height}
              onChangeText={(text) => setFormData({ ...formData, height: text })}
              placeholder='175,5'
              keyboardType='decimal-pad'
              className='bg-white rounded-xl px-4 py-3.5 text-gray-900 border border-gray-200'
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={isUpdating}
            className='bg-primary rounded-xl py-4 items-center justify-center mb-8 shadow-sm'
            activeOpacity={0.8}
          >
            {isUpdating ? (
              <ActivityIndicator size='small' color='#fff' />
            ) : (
              <Text className='text-white text-base font-semibold'>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default EditProfileScreen;
