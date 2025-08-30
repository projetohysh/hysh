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
      backgroundColor: '#cbcbcbff',
      display: 'flex',
      flexDirection: 'row',
      paddingHorizontal: 5,
      gap: 10,
      alignItems: 'center',
      borderRadius: 8,
      opacity: 0.4,
      left: 60,
      bottom: 12,
      maxWidth:  100



    }
});


