import { ImageBackground } from "expo-image";
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from "react-native";


// As comunidades  são estáticas para fins de demonstração.
//No aplicativo final essas serão dinaâmicas, a partir do nosso backend.

export default function CommunityCard() {

    return(
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{marginVertical: 20, flexGrow:1}}>
                <View style={styles.card}>
                    <ImageBackground
                      source={{ uri: 'https://horadecodar.com.br/wp-content/uploads/2023/04/dia-do-dev.jpg' }}
                      style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden', justifyContent: 'flex-end' }}
                    >
                      <LinearGradient
                        colors={['transparent', 'rgba(89, 0, 190, 0.8)']}
                        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '70%', borderRadius: 12 }}
                      />               
                       <Text style={styles.title}>Devs Feira de Santana e região</Text>
                       </ImageBackground>
                                   </View>
                                  
                <View style={styles.card}>
                    <ImageBackground
                      source={{ uri: 'https://levelupnews.com.br/wp-content/uploads/2025/06/e602af47-bb0b-493f-a18b-60b103d1366b-1.jpg' }}
                      style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden', justifyContent: 'flex-end' }}
                    >
                      <LinearGradient
                        colors={['transparent', 'rgba(89, 0, 190, 0.8)']}
                        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '70%', borderRadius: 12 }}
                      />    
                       <Text style={styles.title}>One Piece BR</Text>
                       </ImageBackground>
                                   </View> 
                <View style={styles.card}>
                    <ImageBackground
                      source={{ uri: 'https://preview.redd.it/max-verstappen-has-26-wins-in-the-last-45-grand-prix-since-v0-cy6u7j08vn1a1.jpg?auto=webp&s=e73b64d699172e34be2ff663b6885ca0bcc7f8b8' }}
                      style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden', justifyContent: 'flex-end' }}
                    >
                      <LinearGradient
                        colors={['transparent', 'rgba(89, 0, 190, 0.8)']}
                        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '70%', borderRadius: 12 }}
                      />               
                       <Text style={styles.title}>Comunidade de Fórmula 1</Text>
                       </ImageBackground>
                                   </View>                                      
                <View style={styles.card}>
                    <ImageBackground
                      source={{ uri: 'https://blog.ucpel.edu.br/wp-content/uploads/2018/07/Psicologia-na-ucpel.jpg' }}
                      style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden', justifyContent: 'flex-end' }}
                    >
                      <LinearGradient
                        colors={['transparent', 'rgba(89, 0, 190, 0.8)']}
                        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '70%', borderRadius: 12 }}
                      />               
                       <Text style={styles.title}>Psicologia 2025.2</Text>
                       </ImageBackground>
                                   </View>                 
              </ScrollView>
    )

}
const styles = StyleSheet.create({
  card: {
    margin: 20,
    fontSize: 16,
    color: 'purple',
    width: 200,
    height: 300,
    borderRadius: 12,
    backgroundColor: '#5C39BE',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    position: 'absolute',
    bottom: 10,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    padding: 5,
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
    paddingHorizontal: 6
  }
});