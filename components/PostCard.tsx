import { FontAwesome6 } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';
import CommunityBadge from './CommunityBadge';

export interface PostCardProps {
  id: string;
  postOwner: string;
  content: string;
  profPic: any;
  username: string;
  postTime: string;
}

export default function PostCard({ postOwner, content, profPic, username, postTime }: PostCardProps) {
  return (
    <View style={styles.card}>
       <FontAwesome6 name="ellipsis" size={20} color="gray" style={{alignSelf: 'flex-end'}}/>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Image source={typeof profPic === 'string' ? { uri: profPic } : profPic} style={{ width: 50, height: 50, borderRadius: 25, right: 10 }} />
        <Text style={styles.postOwner}>{postOwner}</Text>
        <Text style={styles.postDetails}>{username} • {postTime}</Text>
      </View>
      <CommunityBadge/>
      <Text style={styles.content}>{content}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, gap: 20 }}>
        <FontAwesome6 name="repeat" size={20} color="#5C39BE" iconStyle='solid'/>
        <FontAwesome6 name="message" size={20} color="#5C39BE" />
        <FontAwesome6 name="star" size={20} color="#5C39BE" />
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, backgroundColor: '#fdfdfd', borderRadius: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  postOwner: { fontSize: 16, fontWeight: 'bold', marginBottom: 25, right: 10 },
  content: { fontSize: 16, color: 'black', marginTop: 0, marginHorizontal: 5 },
  postDetails: { fontSize: 16, color: 'gray', marginBottom: 25, right: 10},
});
