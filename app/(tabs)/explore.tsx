import Header from '@/components/Header';
import { Platform, SafeAreaView, StyleSheet } from 'react-native';


export default function TabTwoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle='Explorar' font='Roboto'/>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {backgroundColor: '#ede5f7', flex: 1, paddingTop: Platform.OS === 'android' ? 25 : 0, },
});

