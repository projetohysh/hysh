import { Image } from 'expo-image';
import { Platform, StyleSheet, SafeAreaView, Text } from 'react-native';
import Header from '@/components/Header';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {backgroundColor: '#ede5f7', flex: 1, paddingTop: Platform.OS === 'android' ? 25 : 0, },
});

