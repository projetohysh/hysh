import { View, Text, Image, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

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
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Image source={typeof profPic === 'string' ? { uri: profPic } : profPic} style={{ width: 50, height: 50, borderRadius: 25 }} />
        <Text style={styles.postOwner}>{postOwner}</Text>
        <Text style={styles.postDetails}>{username} • {postTime}</Text>
      </View>
      <Text style={styles.content}>{content}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, gap: 20 }}>
        <IconSymbol name="arrow.2.circlepath" size={24} color="#5C39BE" />        
        <IconSymbol name="message" size={24} color="#5C39BE" />
        <IconSymbol name="star" size={24} color="#5C39BE" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, backgroundColor: '#fdfdfd', borderRadius: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  postOwner: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  content: { fontSize: 14, color: 'black', marginTop: 8 },
  postDetails: { fontSize: 16, color: 'gray' },
});
