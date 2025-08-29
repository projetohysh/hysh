import { useFonts } from 'expo-font';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function Header({headerTitle, font}: {headerTitle: string; font?: string}) {

    const [fontsLoaded] = useFonts({
    'BukkariScript': require('@/assets/fonts/BukhariScript.ttf'),
  });
   if (!fontsLoaded) {
    return null; // ou algum <Text>Carregando...</Text>
  }
    return(
        <View style={styles.bg}>
                <Text style={[styles.header, font ? {fontFamily: font}: null]}>{headerTitle}</Text>
                <Image
                  source={{ uri: 'https://pbs.twimg.com/profile_images/1951145033362468864/QZaHayVH_400x400.jpg' }}
                  style={{ width: 40, height: 40, borderRadius: 100 }}
                  resizeMode="contain"
                />
              </View>
    )


}
const styles = StyleSheet.create({
  header: { fontSize: 30, fontWeight: 'bold', color: '#5C39BE', fontFamily: 'BukkariScript', lineHeight: 70, paddingVertical: 5 },
  bg: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30 , backgroundColor: '#ede5f7', justifyContent:'space-between', maxHeight: 80, marginBottom: -10, marginTop: -10},
});