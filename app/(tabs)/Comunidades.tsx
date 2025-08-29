import CommunityCard from "@/components/communityCard";
import Header from "@/components/Header";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Platform, Pressable, SafeAreaView, StyleSheet, Text } from "react-native";

export default function Comunidades() {

    function createCom(){
        alert('Comunidade Criada com Sucesso!');
    }

  return(
    <SafeAreaView style={styles.container}>
      <Header headerTitle='Suas Comunidades' font='Poppins'/>
      <CommunityCard/>
      <Pressable onPress={createCom} style={{backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 12, alignItems: 'center', bottom: 200, boxShadow: '0px 10px 10px 00px #0000002f', height: 80, justifyContent: 'center', flexDirection: 'row', gap: 10}}>
      <IconSymbol name="plus.circle.fill" size={24} color="#5C39BE" />
      <Text style={{color: '##717171', fontSize: 16, fontWeight: 'bold'}}>Criar nova comunidade</Text>
      </Pressable>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {backgroundColor: '#ede5f7', flex: 1, paddingTop: Platform.OS === 'android' ? 25 : 0, },
});