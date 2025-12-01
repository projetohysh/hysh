import { useColorScheme } from '@/hooks/useColorScheme';
import "@/utils/notificationHandler";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Session } from '@supabase/supabase-js';
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { supabase } from '../lib/supabase';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setIsReady(true);

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      await SplashScreen.hideAsync();
    }

    init();
  }, []);
useEffect(() => {
  const sub = Notifications.addNotificationReceivedListener((notification) => {
    const body = notification.request?.content?.body ?? "Você recebeu uma notificação!";
  });

  return () => sub.remove();
}, []);

  useEffect(() => {
    if (!isReady) return;

    if (session) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/Login');
    }
  }, [session, isReady]);

  if (!isReady) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(modal)" />
          <Stack.Screen name="+not-found" />
          
        </Stack>
      </View>
    </ThemeProvider>
  );
}
