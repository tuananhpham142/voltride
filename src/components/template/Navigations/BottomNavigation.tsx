import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/fontawesome6';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TabConfig {
  route: string;
  icon: string;
  iconFamily?: 'solid' | 'regular' | 'light' | 'thin';
  label: string;
}

const TAB_CONFIGS: Record<string, TabConfig> = {
  Home: {
    route: 'Home',
    icon: 'house',
    iconFamily: 'solid',
    label: 'Home',
  },
  Monthly: {
    route: 'Monthly',
    icon: 'calendar',
    iconFamily: 'regular',
    label: 'Monthly',
  },
  Scan: {
    route: 'Scan',
    icon: 'qrcode',
    iconFamily: 'solid',
    label: 'Scan',
  },
  Shop: {
    route: 'Shop',
    icon: 'bag-shopping',
    iconFamily: 'solid',
    label: 'Shop',
  },
  Profile: {
    route: 'Profile',
    icon: 'user',
    iconFamily: 'solid',
    label: 'Profile',
  },
};

export const CustomBottomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { isDark } = useTheme();

  const handlePress = (routeName: string, isFocused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes[state.index].key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const renderTabButton = (routeName: string, index: number) => {
    const isFocused = state.index === index;
    const config = TAB_CONFIGS[routeName];

    if (!config) return null;

    // Special handling for center Scan button
    if (routeName === 'Scan') {
      return (
        <TouchableOpacity
          key={routeName}
          onPress={() => handlePress(routeName, isFocused)}
          style={styles.scanButton}
          activeOpacity={0.8}
        >
          <View style={styles.scanButtonInner}>
            <Icon
              name={config.icon as any}
              iconStyle={'solid'}
              size={28}
              color="#FFFFFF"
            />
          </View>
        </TouchableOpacity>
      );
    }

    // Regular tab buttons
    const activeColor = '#10B981'; // Teal/Green
    const inactiveColor = isDark ? '#6B7280' : '#9CA3AF';

    return (
      <TouchableOpacity
        key={routeName}
        onPress={() => handlePress(routeName, isFocused)}
        style={styles.tabButton}
        activeOpacity={0.7}
      >
        <Icon
          name={config.icon as any}
          iconStyle={'solid'}
          size={22}
          color={isFocused ? activeColor : inactiveColor}
        />
        <Text
          style={[
            styles.tabLabel,
            {
              color: isFocused ? activeColor : inactiveColor,
              fontWeight: isFocused ? '600' : '400',
            },
          ]}
        >
          {config.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          borderTopColor: isDark ? '#374151' : '#E5E7EB',
        },
      ]}
    >
      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          return renderTabButton(route.name, index);
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  scanButton: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -32,
    width: 64,
    height: 64,
  },
  scanButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
