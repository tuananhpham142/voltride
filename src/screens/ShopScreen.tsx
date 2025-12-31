import { useTheme } from '@/hooks/useTheme';
import { RootStackParamList } from '@/types/navigation';
import Icon from '@react-native-vector-icons/fontawesome6';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Shop'>;

const ShopScreen: React.FC<Props> = ({ navigation }) => {
  const { isDark } = useTheme();

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 px-6 pt-6">
          {/* Header */}
          <View className="mb-8">
            <Text
              className={`text-3xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Shop
            </Text>
            <Text
              className={`text-base ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Browse accessories and merchandise
            </Text>
          </View>

          {/* Coming Soon Card */}
          <View
            className={`rounded-3xl p-8 items-center justify-center ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
            } border`}
            style={{ minHeight: 300 }}
          >
            <View
              className={`w-24 h-24 rounded-full items-center justify-center mb-6 ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            >
              <Icon
                name="bag-shopping"
                iconStyle="solid"
                size={48}
                color={isDark ? '#9CA3AF' : '#6B7280'}
              />
            </View>
            <Text
              className={`text-2xl font-bold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Coming Soon
            </Text>
            <Text
              className={`text-center text-base ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Our shop is being stocked with great products. Stay tuned!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShopScreen;
