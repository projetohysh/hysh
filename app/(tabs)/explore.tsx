import Header from '@/components/Header';
import { FontAwesome6 } from '@expo/vector-icons';
import { Platform, SafeAreaView, StyleSheet, TextInput, View } from 'react-native';


export default function TabTwoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle='Explorar' font='Roboto'/>
      <View style={{flexDirection: 'row', gap: 20, alignItems: 'center', justifyContent: 'center'}}>
<TextInput         placeholderTextColor="#999"
 placeholder='    Busque comunidades, posts, pessoas' style={styles.input}></TextInput>
        <FontAwesome6 name="magnifying-glass" size={30} color="#5C39BE"/>
    
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {backgroundColor: '#ede5f7', flex: 1, paddingTop: Platform.OS === 'android' ? 25 : 0 },
  input: {width: 300, backgroundColor: 'white', height: 40, borderRadius: 50}
});

