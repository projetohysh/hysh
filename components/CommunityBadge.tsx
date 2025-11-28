import { StyleSheet, Text, View } from 'react-native';
import { IconSymbol } from "./ui/IconSymbol";


interface CommunityBadgeProps {
comunidade: string;
}

export default function CommunityBadge({comunidade}: CommunityBadgeProps){
  return(
    <View style={styles.badge}>
    <IconSymbol name="person.3" color={'black'} size={20}></IconSymbol>
      <Text style={{fontSize:10}} numberOfLines={1} ellipsizeMode="tail">
{comunidade.substring(0,20)}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
    badge: {
backgroundColor: '#cbcbcb86',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 6,
    alignItems: 'center',
    borderRadius: 20,
    opacity: 0.4, 
    bottom: 25,
    left:50,
    alignSelf: 'flex-start'
    }
});


