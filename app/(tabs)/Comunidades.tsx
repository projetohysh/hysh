import CommunityCard from "@/components/communityCard";
import CommunitySuggestions from "@/components/CommunitySuggestions";
import Header from "@/components/Header";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

// As comunidades  são estáticas para fins de demonstração.
//No aplicativo final essas serão dinaâmicas, a partir do nosso backend.

export default function Comunidades() {

    function createCom(){
        alert('Comunidade Criada com Sucesso!');
    }

  return(
    <SafeAreaView style={styles.container}>
      <Header headerTitle='Suas Comunidades' font='Poppins'/>
      <ScrollView>
      <View>
      <CommunityCard/>
      </View>
      <Pressable onPress={createCom} style={{backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 12, alignItems: 'center',boxShadow: '0px 10px 10px 00px #0000002f', height: 80, justifyContent: 'center', flexDirection: 'row', gap: 10}}>
      <IconSymbol name="plus.circle.fill" size={24} color="#5C39BE" />
      <Text style={{color: '#717171', fontSize: 16, fontWeight: 'bold'}}>Criar nova comunidade</Text>
      </Pressable>
      <CommunitySuggestions/>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {backgroundColor: '#ede5f7', flex: 1, paddingTop: Platform.OS === 'android' ? 25 : 0, },
});