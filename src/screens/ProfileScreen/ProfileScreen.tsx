import { MenuItem } from '@/components/MenuItem';
import { StatCard } from '@/components/StatCard';
import { useTheme } from '@/hooks/useTheme';
import { RootStackParamList } from '@/types/navigation';
import Icon from '@react-native-vector-icons/fontawesome6';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { isDark } = useTheme();

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="px-6"
      >
        {/* Profile Header */}
        <View className="pt-6 pb-6">
          {/* Profile Picture & Name */}
          <View className="items-center mb-6">
            <View className="relative mb-4">
              <Image
                source={{
                  uri: 'https://i.pravatar.cc/150?img=12',
                }}
                className="w-24 h-24 rounded-full"
              />
              <View
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full items-center justify-center border-2"
                style={{
                  backgroundColor: '#10B981',
                  borderColor: isDark ? '#111827' : '#FFFFFF',
                }}
              >
                <Icon name="check" iconStyle='solid' size={12} color="#FFFFFF" />
              </View>
            </View>

            <Text
              className={`text-2xl font-bold mb-1 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Alex Doe
            </Text>

            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-success mr-2" />
              <Text
                className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Verified Member
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View className="flex-row gap-3 mb-6">
            <StatCard
              label="Wallet Balance"
              value="$24.50"
              icon="wallet"
              iconColor="#10B981"
            />
            <StatCard
              label="Total Rides"
              value="142"
              icon="bicycle"
              iconColor="#3B82F6"
            />
          </View>

          {/* Shipper Mode Toggle */}
          <MenuItem
            icon="truck"
            title="Shipper Mode"
            subtitle="Switch to Driver Dashboard"
            onPress={() => console.log('Switch to Shipper Mode')}
            variant="primary"
            iconColor="#FFFFFF"
            className="mb-6"
          />

          {/* Account Section */}
          <View className="mb-2">
            <Text
              className={`text-sm font-semibold mb-3 ml-1 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              ACCOUNT
            </Text>

            <MenuItem
              icon="clock-rotate-left"
              title="Ride History"
              onPress={() => console.log('Ride History')}
            />

            <MenuItem
              icon="credit-card"
              title="Payment Methods"
              onPress={() => console.log('Payment Methods')}
            />

            <MenuItem
              icon="gear"
              title="Settings"
              onPress={() => navigation.navigate('Settings')}
            />

            <MenuItem
              icon="palette"
              title="App Icon Generator"
              onPress={() => console.log('App Icon Generator')}
            />
          </View>

          {/* Additional Options */}
          <View className="mt-4 gap-2">
            <TouchableOpacity
              className={`p-4 rounded-2xl border ${
                isDark
                  ? 'bg-gray-800/30 border-gray-700/50'
                  : 'bg-gray-50/50 border-gray-200/50'
              }`}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View
                    className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
                      isDark ? 'bg-gray-700' : 'bg-white'
                    }`}
                  >
                    <Icon
                      name="circle-question"
                      iconStyle='solid'
                      size={20}
                      color={isDark ? '#9CA3AF' : '#6B7280'}
                    />
                  </View>
                  <Text
                    className={`text-base font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Help & Support
                  </Text>
                </View>
                <Icon
                  name="chevron-right"
                  iconStyle='solid'
                  size={16}
                  color={isDark ? '#6B7280' : '#9CA3AF'}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className={`p-4 rounded-2xl border ${
                isDark
                  ? 'bg-gray-800/30 border-gray-700/50'
                  : 'bg-gray-50/50 border-gray-200/50'
              }`}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View
                    className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
                      isDark ? 'bg-gray-700' : 'bg-white'
                    }`}
                  >
                    <Icon
                      name="shield-halved"
                      iconStyle='solid'
                      size={20}
                      color={isDark ? '#9CA3AF' : '#6B7280'}
                    />
                  </View>
                  <Text
                    className={`text-base font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Privacy & Security
                  </Text>
                </View>
                <Icon
                  name="chevron-right"
                  iconStyle='solid'
                  size={16}
                  color={isDark ? '#6B7280' : '#9CA3AF'}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className={`p-4 rounded-2xl border border-error/30 ${
                isDark ? 'bg-error/10' : 'bg-error/5'
              }`}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View
                    className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
                      isDark ? 'bg-error/20' : 'bg-error/10'
                    }`}
                  >
                    <Icon
                      name="right-from-bracket"
                      iconStyle='solid'
                      size={20}
                      color="#EF4444"
                    />
                  </View>
                  <Text className="text-base font-semibold text-error">
                    Logout
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* App Version */}
          <Text
            className={`text-center text-xs mt-8 ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`}
          >
            VoltRide v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default ProfileScreen;