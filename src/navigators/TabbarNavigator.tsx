import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { CustomBottomTabBar } from '@/components/template/Navigations/BottomNavigation';
import WelcomeScreen from '@/screens/WelcomeScreen';
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
      <Tab.Screen name="Welcome" component={WelcomeScreen} />
    </Tab.Navigator>
  );
};
export default BottomTabNavigator;