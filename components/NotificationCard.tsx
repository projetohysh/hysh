import { Image, StyleSheet, Text, View } from "react-native";
export default function NotificationCard({tipo, content} : {tipo : string, content: string} ){
    return(
        <View style={styles.container}>
<Image source={require('../assets/images/logo hysh.png')} style={{ width: 50, height: 50, }} />
            <View style={{alignItems: 'flex-start'}}>
        <Text>{tipo}</Text>
        <Text style={{color: 'grey'}}>{content}</Text>
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { backgroundColor: 'white', width: 400, justifyContent: 'flex-start', height: 100, gap: 20, flexDirection: 'row', alignItems: 'center', padding: 10, marginBottom: 5}
})