import { HapticTab } from '@/components/HapticTab';
import { FontAwesome6 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
<Tabs
  screenOptions={{
    tabBarActiveTintColor: '#5C39BE',   
    tabBarInactiveTintColor: "grey", 
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarStyle: {
      backgroundColor: '#fff', 
      position: 'absolute', 
    },
  }}
>

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
