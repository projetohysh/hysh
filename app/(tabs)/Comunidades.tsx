import { Text, Image, SafeAreaView, Platform} from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { HeaderTitle } from "@react-navigation/elements";
import Header from "@/components/Header";

export default function Comunidades() {
  return(
    <SafeAreaView style={styles.container}>
      <Header/>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {backgroundColor: '#ede5f7', flex: 1, paddingTop: Platform.OS === 'android' ? 25 : 0, },
});