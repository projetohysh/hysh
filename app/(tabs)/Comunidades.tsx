import { Text, Image} from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { HeaderTitle } from "@react-navigation/elements";

export default function Comunidades() {
  return(
    <ParallaxScrollView
          headerBackgroundColor={{ light: '#5C39BE', dark: '#5C39BE' }}
          headerImage={
            <Image
            source={require('@/assets/images/logo hysh.png')}
            style={{ width: 100, height: 200, alignSelf: 'center', marginTop: 30 }}
            resizeMode="contain"
          />
          }
            >
          
          
      <Text>Testando texto</Text>
      <HeaderTitle style={{color: 'black'}}>Comunidades</HeaderTitle>
      <Image source={require('@/assets/images/logo transp roxa.png')} style={{ width: 100, height: 200, alignSelf: 'center', marginTop: 30 }} resizeMode="contain" />

    </ParallaxScrollView>
  );
}