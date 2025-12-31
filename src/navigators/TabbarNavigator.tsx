import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { CustomBottomTabBar } from '@/components/template/Navigations/BottomNavigation';
import HomeScreen from '@/screens/HomeScreen';
import MonthlyScreen from '@/screens/MonthlyScreen';
import ProfileScreen from '@/screens/ProfileScreen/ProfileScreen';
import ScanScreen from '@/screens/ScanScreen';
import ShopScreen from '@/screens/ShopScreen';
import { MainTabParamList } from '@/types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomBottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Monthly" component={MonthlyScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
export default BottomTabNavigator;