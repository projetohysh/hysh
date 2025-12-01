import { useAuth } from '@/hooks/useAuth';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Autolink from "react-native-autolink";
import LinkPreview from "react-native-link-preview";
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

const extractUrl = (text: string) => {
  const regex = /(https?:\/\/[^\s]+)/g;
  const match = text.match(regex);
  return match ? match[0] : null;
};

const link = extractUrl(content);
const [preview, setPreview] = useState<any>(null);

useEffect(() => {
  if (link) {
    LinkPreview.getPreview(link)
.then((data: any) => setPreview(data))
      .catch(() => {});
  }
}, [link]);


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
function handleOptions() {
  if (user && user.id === userId) {
    Alert.alert(
      "Opções do post",
      "Escolha uma ação",
      [
        {
          text: "Apagar post",
          style: "destructive",
          onPress: deletePost
        },
        {
          text: "Cancelar",
          style: "cancel"
        }
      ]
    );
  }
}

async function deletePost() {
  try {
    // Deletar comentários
    const { error: errComentarios } = await supabase
      .from("comentarios")
      .delete()
      .eq("postagem_id", Number(id));
    if (errComentarios) throw errComentarios;

    // Deletar curtidas
    const { error: errCurtidas } = await supabase
      .from("curtidas_post")
      .delete()
      .eq("postagem_id", Number(id));
    if (errCurtidas) throw errCurtidas;

    // Agora apagar o post
    const { error } = await supabase
      .from("postagens")
      .delete()
      .eq("postagem_id", Number(id));

    if (error) throw error;

    Alert.alert("Post apagado", "Seu post foi removido com sucesso.");
  } catch (err) {
    console.log("Erro ao deletar post:", err);
    Alert.alert("Erro", "Não foi possível deletar o post.");
  }
}



  return (
    <View style={styles.card}>
<Pressable onPress={handleOptions}>
  <FontAwesome6 name="ellipsis" size={20} color="gray" style={{ alignSelf: 'flex-end' }}/>
</Pressable>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
  <Pressable onPress={() => router.push(`/(profile)/${userId}`)}style={{marginRight:10}}>
    <Image 
      source={typeof profPic === 'string' ? { uri: profPic } : profPic} 
      style={{ width: 50, height: 50, borderRadius: 25 }} // 
    />
  </Pressable>
        <Text style={styles.postOwner}>{postOwner.substring(0,15)}</Text>
        <Text style={styles.postDetails}>{postOwner.substring(0,6)} • {getTime(postTime)}</Text>
      </View>
      <CommunityBadge comunidade={comunidade}/>
<Autolink
  text={content}
  style={styles.content}
  linkStyle={{ color: "#5C39BE", textDecorationLine: "underline" }}
/>
{preview && (
  <View style={{
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    marginTop: 10
  }}>
    {preview.images?.[0] && (
      <Image
        source={{ uri: preview.images[0] }}
        style={{ width: "100%", height: 180, borderRadius: 10 }}
        resizeMode="cover"
      />
    )}

    {preview.title && (
      <Text style={{ fontWeight: "bold", marginTop: 8 }}>
        {preview.title}
      </Text>
    )}

    {preview.description && (
      <Text style={{ marginTop: 4, opacity: 0.7 }}>
        {preview.description}
      </Text>
    )}

    <Text style={{ marginTop: 6, color: "blue" }}>
      {preview.url}
    </Text>
  </View>
)}


      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, gap: 20, marginRight: likesCount>0?0:10}}>
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
