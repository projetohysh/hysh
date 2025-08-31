import { Image, Pressable, StyleSheet, Text, View } from "react-native";

// As comunidades sugeridas abaixo são estáticas para fins de demonstração.
//No aplicativo final essas serão dinaâmicas, a partir do nosso backend.

export default function CommunitySuggestions() {
    return(
        <View>
            <Text style={{fontSize:20, left: 25, color:'#5C39BE', fontWeight: 'bold', top: 30, marginBottom: 30}}>Talvez você se interesse:</Text>
            <View style={styles.container} >
                <View style={styles.community}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                    <Image source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSfpvGSMIL49fbiBkkdau08NHjEiJ0WpqiDg&s'}} style={styles.icon}/>
                    <Text>UNIFAN - Professores</Text>
                    </View>
                    <View>
                        <Pressable><Text style={styles.button}>Participar</Text></Pressable>
                    </View>
                    
                </View>
                
            </View>
            <View style={styles.container} >
                <View style={styles.community}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                    <Image source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiZAvls8H9BKG0mvYDtR_3Bh4UQ2BTwPK-KjsJdlzjuNSwwXdZ6KKgfWpUOAsqqpK5REw&usqp=CAU'}} style={styles.icon}/>
                    <Text>Economia UEFS</Text>
                    </View>
                    <View>
                        <Pressable><Text style={styles.button}>Participar</Text></Pressable>
                    </View>
                    
                </View>
                
            </View>
            <View style={styles.container} >
                <View style={styles.community}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                    <Image source={{uri: 'https://m.media-amazon.com/images/I/81sBKBIcwvL._UF1000,1000_QL80_.jpg'}} style={styles.icon}/>
                    <Text>Fãs de bandas alternativas</Text>
                    </View>
                    <View>
                        <Pressable><Text style={styles.button}>Participar</Text></Pressable>
                    </View>
                    
                </View>
                
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {alignItems: 'center', marginTop: 15, gap: 10},
    community: {backgroundColor: 'white',padding: 20, borderRadius: 12, alignItems: 'center',boxShadow: '0px 1px 5px 00px #0000002f', width:'90%', justifyContent: 'space-between', flexDirection: 'row'},
    icon: {width: 60, height: 60,borderRadius: 10},
    button: {backgroundColor: '#5C39BE', padding: 10, borderRadius: 8, color: 'white'},
})