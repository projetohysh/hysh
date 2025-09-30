import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { FontAwesome6 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <FontAwesome6 size={24} name="house" color={color} solid/>,
        }}
      />
      <Tabs.Screen
        name="Comunidades"
        options={{
          title: 'Comunidades',
          tabBarIcon: ({ color }) => <FontAwesome6 size={24} name="users" color={color} solid/>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color }) => <FontAwesome6 size={24} name="magnifying-glass" color={color}/>,
        }}
      />
<Tabs.Screen
        name="notificacoes"
        options={{
          title: 'Notificações',
          tabBarIcon: ({ color }) => <FontAwesome6 size={24} name="bell" color={color} solid/>,
        }}
      />
    </Tabs>
  );
}
