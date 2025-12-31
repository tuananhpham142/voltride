import { ActionCard } from '@/components/ActionCard';
import { PromotionalBanner } from '@/components/PromotionalBanner';
import { StatCard } from '@/components/StatCard';
import { useTheme } from '@/hooks/useTheme';
import { RootStackParamList } from '@/types/navigation';
import Icon from '@react-native-vector-icons/fontawesome6';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface RecentRide {
  id: string;
  from: string;
  to: string;
  date: string;
  amount: string;
  status: 'completed' | 'cancelled';
}

 const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { isDark } = useTheme();

  const recentRides: RecentRide[] = [
    {
      id: '1',
      from: 'Downtown Station',
      to: 'City Mall',
      date: 'Dec 10, 2025',
      amount: '$12.50',
      status: 'completed',
    },
    {
      id: '2',
      from: 'Home',
      to: 'Office Building',
      date: 'Dec 9, 2025',
      amount: '$8.30',
      status: 'completed',
    },
  ];

  const renderRideItem = ({ item }: { item: RecentRide }) => (
    <TouchableOpacity
      className={`mb-3 p-4 rounded-2xl border ${
        isDark
          ? 'bg-gray-800/50 border-gray-700'
          : 'bg-white border-gray-200'
      }`}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center flex-1">
          <View
            className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            <Icon
              name="location-dot"
              iconStyle="solid"
              size={18}
              color={isDark ? '#60A5FA' : '#3B82F6'}
            />
          </View>
          <View className="flex-1">
            <Text
              className={`text-sm font-semibold mb-1 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {item.from} → {item.to}
            </Text>
            <Text
              className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {item.date}
            </Text>
          </View>
        </View>
        <Text
          className={`text-base font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {item.amount}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text
                className={`text-base ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Good Morning,
              </Text>
              <Text
                className={`text-3xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Alex Doe
              </Text>
            </View>
            <TouchableOpacity
              className={`w-12 h-12 rounded-full items-center justify-center ${
                isDark ? 'bg-gray-800' : 'bg-gray-100'
              }`}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Icon
                name="bell"
                iconStyle="solid"
                size={20}
                color={isDark ? '#FCD34D' : '#F59E0B'}
              />
            </TouchableOpacity>
          </View>

          {/* Stats Cards */}
          <View className="flex-row gap-3 mb-6">
            <StatCard
              label="Balance"
              value="$24.50"
              icon="wallet"
              iconColor="#10B981"
            />
            <StatCard
              label="Saved"
              value="12kg CO2"
              icon="bolt"
              iconColor="#3B82F6"
            />
          </View>

          {/* Action Cards */}
          <View className="flex-row gap-3 mb-6">
            <ActionCard
              title="Find a Station"
              subtitle="Map View"
              icon="map-location-dot"
              onPress={() => console.log('Find Station')}
              colors={['#10B981', '#059669']}
              className="flex-1"
            />
            <ActionCard
              title="Quick Ride"
              subtitle="Scan QR"
              icon="bolt"
              onPress={() => console.log('Quick Ride')}
              colors={isDark ? ['#374151', '#1F2937'] : ['#1F2937', '#111827']}
              className="flex-1"
            />
          </View>

          {/* Promotional Banner */}
          <PromotionalBanner
            badge="SUMMER SALE"
            title="Get 50% Off"
            description="On your first monthly subscription plan."
            buttonText="View Plans"
            onPress={() => console.log('View Plans')}
            colors={['#8B5CF6', '#3B82F6']}
            className="mb-6"
          />
        </View>

        {/* Recent Rides Section */}
        <View className="px-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text
              className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Recent Rides
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-primary-300 text-sm font-semibold">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={recentRides}
            renderItem={renderRideItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default HomeScreen