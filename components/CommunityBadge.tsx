import { StyleSheet, Text, View } from 'react-native';
import { IconSymbol } from "./ui/IconSymbol";

export default function CommunityBadge(){
  return(
    <View style={styles.badge}>
    <IconSymbol name="person.3" color={'black'} size={20}></IconSymbol>
    <Text style={{fontSize: 10}}>ADS Noturno</Text>
    </View>
  )
};

const styles = StyleSheet.create({
    badge: {
      backgroundColor: '#cbcbcb67',
      display: 'flex',
      flexDirection: 'row',
      paddingHorizontal: 8,
      gap: 10,
      alignItems: 'center',
      borderRadius: 8,
      opacity: 0.4,
      left: 50,
      bottom: 25,
      maxWidth:  110,



    }
});


