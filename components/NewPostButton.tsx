import {View, StyleSheet} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function NewPostButton(){
    return(
        <View style={styles.button}>
            <IconSymbol name="plus.circle.fill" size={60} color="#5C39BE" />
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 100,
        right: 30,
        width: 40,
        height: 40,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        opacity: 0.9,
    },
});