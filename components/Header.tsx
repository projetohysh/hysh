import { SafeAreaView, Text, FlatList, View, Image, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

export default function Header(){
    return(
        <View style={styles.bg}>
                <Text style={styles.header}>Hysh</Text>
                <Image
                  source={{ uri: 'https://pbs.twimg.com/profile_images/1951145033362468864/QZaHayVH_400x400.jpg' }}
                  style={{ width: 50, height: 50, borderRadius: 100 }}
                  resizeMode="contain"
                />
              </View>
    )


}
const styles = StyleSheet.create({
  header: { fontSize: 30, fontWeight: 'bold', color: '#5C39BE', fontFamily: 'BukkariScript', lineHeight: 70, paddingVertical: 10 },
  bg: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 30 , backgroundColor: '#ede5f7' },
});