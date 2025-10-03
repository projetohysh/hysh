import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {


  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    BukkariScript: require('@/assets/fonts/BukhariScript.ttf'),

  });
 const [loggedIn, setLoggedIn] = useState(true);
  const onLayoutRootView = useCallback (async () => {
    
    if(fontsLoaded || fontError) {
      
    await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack>
  {!loggedIn ? (
    <Stack.Screen
      name="Login"
      options={{ headerShown: false }}
    />
  ) : (
    <Stack.Screen
      name="(tabs)"
      options={{ headerShown: false }}
    />
  )}
  <Stack.Screen name="+not-found" />
</Stack>
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
