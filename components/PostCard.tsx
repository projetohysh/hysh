import { useAuth } from '@/hooks/useAuth';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from "../lib/supabase";
import CommunityBadge from './CommunityBadge';

export interface PostCardProps {
  id: string;
  userId: string; 
  postOwner: string;
  content: string;
  profPic: any;
  username: string;
  postTime: string;
  comunidade: string;
}

export default function PostCard({ id,postOwner, content, profPic, username, postTime, comunidade, userId }: PostCardProps) {

const [liked, setLiked] = useState(false);
const [likesCount, setLikesCount] = useState(0);
const scaleAnim = useState(new Animated.Value(1))[0];
const { user } = useAuth(); // usuário logado
const [comentariosCount, setComentariosCount] = useState(0);


async function loadLikes() {
  if (!id) return;

  // quantidade total
  const { count } = await supabase
    .from("curtidas_post")
    .select("*", { count: "exact", head: true })
    .eq("postagem_id", Number(id));

  setLikesCount((count) || 0);

  if (!user) {
    setLiked(false);
    return;
  }

  const { data: userLike } = await supabase
    .from("curtidas_post")
    .select("*")
    .eq("postagem_id", Number(id))
    .eq("usuario_id", user.id)
    .maybeSingle(); 

  setLiked(!!userLike);
}



async function toggleLike() {
  if (!user) return;

  if (liked) {
    // remover curtida
    await supabase
const { error } = await supabase
  .from("curtidas_post")
  .delete()
  .eq("usuario_id", user.id)
  .eq("postagem_id", Number(id));

if (error) console.log("DELETE ERROR:", error);

    setLiked(false);
    setLikesCount((l) => l - 1);
  } else {
    // adicionar curtida
    await supabase.from("curtidas_post").insert({
      usuario_id: user.id,
      postagem_id: Number(id),
    });

    setLiked(true);
    setLikesCount((l) => l + 1);
    runLikeAnimation();
  }
}

useEffect(() => {
  loadLikes();

  async function carregarComentarios() {
    const { count, error } = await supabase
      .from("comentarios")
      .select("*", { count: "exact", head: true })
      .eq("postagem_id", Number(id));

    if (!error) setComentariosCount(count || 0);
  }

  carregarComentarios();
}, [user, id]);



function runLikeAnimation() {
  Animated.sequence([
    Animated.timing(scaleAnim, {
      toValue: 1.8,
      duration: 120,
      useNativeDriver: true,
    }),
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    })
  ]).start();
}


const router = useRouter()
function getTime(timestamp: string) {
  const postDate = new Date(timestamp);
  const now = new Date();

  const isToday =
    postDate.getDate() === now.getDate() &&
    postDate.getMonth() === now.getMonth() &&
    postDate.getFullYear() === now.getFullYear();

  if (isToday) {
    // Mostra só a hora: HH:MM
    return postDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    // Mostra só a data: DD/MM/YYYY
    return postDate.toLocaleDateString();
  }
}


  return (
    <View style={styles.card}>
       <FontAwesome6 name="ellipsis" size={20} color="gray" style={{alignSelf: 'flex-end'}}/>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
  <Pressable onPress={() => router.push(`/(profile)/${userId}`)}style={{marginRight:10}}>
    <Image 
      source={typeof profPic === 'string' ? { uri: profPic } : profPic} 
      style={{ width: 50, height: 50, borderRadius: 25 }} // 
    />
  </Pressable>
        <Text style={styles.postOwner}>{postOwner}</Text>
        <Text style={styles.postDetails}>{username} • {getTime(postTime)}</Text>
      </View>
      <CommunityBadge comunidade={comunidade}/>
      <Text style={styles.content}>{content}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, gap: 20, marginRight: likesCount>0?0:10}}>
        <FontAwesome6 name="repeat" size={20} color="#5C39BE" iconStyle='solid'/>
        <Pressable style={{ flexDirection: "row", alignItems: "center"}}>
        <FontAwesome6 name="message" size={20} color="#5C39BE" 
onPress={() => router.push({
  pathname: "/(modal)/comentarios/[postId]",
  params: { postId:id }
})}

/>
{  comentariosCount >0 && (<Text style={{marginLeft: 6, color: "#5C39BE" }}>{comentariosCount}</Text>)
}
</Pressable>
<Pressable onPress={toggleLike} style={{ flexDirection: "row", alignItems: "center"}}>
  <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
    <FontAwesome6
      name={liked ? "star" : "star"}
      size={22}
      color={"#5C39BE"}
      solid={liked}
    />
  </Animated.View>

 {likesCount > 0 &&  (<Text style={{ marginLeft: 4, color: "#5C39BE" }}>
    {likesCount}
  </Text>)}
</Pressable>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, backgroundColor: '#fdfdfd', borderRadius: 8, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom:8},
  postOwner: { fontSize: 16, fontWeight: 'bold', marginBottom: 25, right: 10 },
  content: { fontSize: 16, color: 'black', marginTop: 0, marginHorizontal: 5 },
  postDetails: { fontSize: 16, color: 'gray', marginBottom: 25, right: 10},
});
