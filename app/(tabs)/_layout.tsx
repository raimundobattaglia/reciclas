import React from 'react';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Icon, type IconName } from '@/components/ui/Icon';

function TabIcon({ name, color }: { name: IconName; color: string }) {
  return <Icon name={name} size={22} color={color} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const c = Colors[colorScheme];
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: c.tint,
        tabBarInactiveTintColor: c.textMuted,
        headerShown: true,
        headerStyle: { backgroundColor: c.background },
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '800', color: c.text, fontSize: 18 },
        tabBarStyle: {
          backgroundColor: c.background,
          borderTopColor: c.border,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <TabIcon name="recycle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="escanear"
        options={{
          title: 'Escanear',
          tabBarIcon: ({ color }) => <TabIcon name="scan" color={color} />,
        }}
      />
      <Tabs.Screen
        name="puntos"
        options={{
          title: 'Puntos',
          tabBarIcon: ({ color }) => <TabIcon name="pin" color={color} />,
        }}
      />
    </Tabs>
  );
}
