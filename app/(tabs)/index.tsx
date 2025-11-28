import Header from '@/components/Header';
import NewPost from '@/components/NewPost';
import NewPostButton from '@/components/NewPostButton';
import Popup from '@/components/Popup';
import PostCard from '@/components/PostCard';
import { supabase } from "@/lib/supabase";
import { FontAwesome6 } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
export default function HomeScreen() {
const [showPopup, setShowPopup] = useState(false);
const [selectedComm, setSelectedComm] = useState<number | null>(null);
const [communities, setCommunities] = useState<Comunidade[]>([]);
const [loadingCommunities, setLoadingCommunities] = useState(false);
const [showCommunityOptions, setShowCommunityOptions] = useState(false);
type Usuario = {
  usuario_nome: string;
  usuario_foto_url: string | null;
};

type Comunidade = {
  comunidade_id: number;
  comunidade_nome: string;
};
type Post = {
  id: string;
  usuario_id: string; 
  postagem_conteudo: string;
  postagem_criado_em: string;
  comunidades: Comunidade | null;   
  usuarios: Usuario | null;  
};


const [posts, setPosts] = useState<Post[]>([])
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadFeed() {
    setLoading(true);

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();
    

    if (userError || !user) {
      setPosts([]);
      setLoading(false);
      return;
    }

    const userId = user.id;

    const { data: userCommunities, error: commError } = await supabase
      .from("comunidades_usuarios")
      .select("comunidade_id")
      .eq("usuario_id", userId);

    if (commError || !userCommunities.length) {
      setPosts([]);
      setLoading(false);
      return;
    }

    const communityIds = userCommunities.map(c => c.comunidade_id);

const {  data, error: postsError } = await supabase
  .from("postagens")
  .select(`
    postagem_id,
    usuario_id,
    postagem_conteudo,
    postagem_criado_em,
    comunidades!postagens_comunidade_id_fkey(comunidade_nome),
    usuarios!postagens_usuario_id_fkey(usuario_nome, usuario_foto_url)
  `)
  .in("comunidade_id", communityIds)
  .order("postagem_criado_em", { ascending: false });
if (postsError) {
  console.log(postsError);
  setPosts([]);
} else {
  const postsMapped = data.map((p: any) => ({
    id: p.postagem_id,
    usuario_id: p.usuario_id,
    postagem_conteudo: p.postagem_conteudo,
    postagem_criado_em: p.postagem_criado_em,
    comunidades: p.comunidades,
    usuarios: p.usuarios,
  }));
  setPosts(postsMapped);
}

    setLoading(false);
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeed();
    setRefreshing(false);
  };
async function loadCommunities() {
  setLoadingCommunities(true);

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    setCommunities([]);
    setLoadingCommunities(false);
    return;
  }

  const { data: membershipData, error: membershipError } = await supabase
    .from("comunidades_usuarios")
    .select("comunidade_id")
    .eq("usuario_id", user.id);

  if (membershipError || !membershipData?.length) {
    setCommunities([]);
    setLoadingCommunities(false);
    return;
  }

  const communityIds = membershipData.map(m => m.comunidade_id);

  const { data: communitiesData, error: communitiesError } = await supabase
    .from("comunidades")
    .select("comunidade_id, comunidade_nome")
    .in("comunidade_id", communityIds);

  if (communitiesError) {
    console.error("Erro ao carregar detalhes das comunidades:", communitiesError);
    setCommunities([]);
  } else {
    setCommunities(communitiesData as Comunidade[]); 
    setSelectedComm(communitiesData.length > 0 ? communitiesData[0].comunidade_id : null);
  }

  setLoadingCommunities(false);
}
  useEffect(() => {
    loadFeed();
    loadCurrentUser();

  }, []);
useEffect(() => {
  if (showPopup) loadCommunities();
  
}, [showPopup]);

const [currentUser, setCurrentUser] = useState<Usuario | null>(null);

async function loadCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from("usuarios")
    .select("usuario_nome, usuario_foto_url")
    .eq("id", user.id)
    .maybeSingle();

  if (!error && data) {
    setCurrentUser(data);
  }
} 

  return (
    <SafeAreaView style={styles.container}>

      <Header headerTitle="Hysh"/>

      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
        <FontAwesome6 name="spinner" size={20} color="#5C39BE" iconStyle='solid'/>
        </Text>
      ) : posts.length === 0 ? (
        <View style={{ marginTop: 30, padding: 20 }}>
          <Text style={{ fontSize: 18, textAlign: 'center', color: '#333' }}>
            👋 Bem-vindo ao Hysh!
          </Text>
          <Text style={{ marginTop: 10, textAlign: 'center', color: '#666' }}>
            Participe de comunidades para ver postagens no seu feed.
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#5C39BE']}
              tintColor="#5C39BE"
            />
          }
          renderItem={({ item }) => (
  <PostCard
    id={item.id}
    userId={item.usuario_id}
    postOwner={item.usuarios?.usuario_nome || "Usuário Hysh"}
    profPic={item.usuarios?.usuario_foto_url}
    content={item.postagem_conteudo}
    username="@usuario"
    postTime={item.postagem_criado_em}
comunidade={item.comunidades?.comunidade_nome || "Comunidade"}  />
)}

        />
      )}
  <Pressable         onPress={() => setShowPopup(true)}>
  {!loading && !refreshing ? <NewPostButton /> : null}
      </Pressable>
<Popup visible={showPopup} onClose={() => setShowPopup(false)}>
  <View style={{ gap: 20 }}>

    {loadingCommunities ? (
      <Text style={{ textAlign: "center" }}>Carregando comunidades...</Text>
    ) : (
      <View>
<Pressable
  onPress={() => setShowCommunityOptions(!showCommunityOptions)}
  style={{
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}
>
  <Text style={{ fontSize: 16, color: selectedComm ? '#333' : '#999' }}>
    {selectedComm
      ? communities.find(c => c.comunidade_id === selectedComm)?.comunidade_nome
      : 'Selecione uma comunidade'}
  </Text>
  <FontAwesome6 name="chevron-down" size={16} color="#666" />
</Pressable>
{showCommunityOptions && (
  <View style={{ marginTop: 10, gap: 8 }}>
    {communities.map((c) => (
      <Pressable
        key={c.comunidade_id}
        onPress={() => {
          setSelectedComm(c.comunidade_id);
          setShowCommunityOptions(false);
        }}
        style={{
          padding: 12,
          backgroundColor: selectedComm === c.comunidade_id ? '#5c39bec5' : '#f5f5f5',
          borderRadius: 8,
          borderWidth: selectedComm === c.comunidade_id ? 1 : 0,
          borderColor: '#5C39BE',
        }}
      >
        <Text style={{ fontSize: 16, color: selectedComm === c.comunidade_id ? '#ffffff' : 'black' }}>{c.comunidade_nome}</Text>
      </Pressable>
    ))}
  </View>
)}
</View>
    )}

    {selectedComm && (
      <NewPost
        comunidadeId={selectedComm}
        onPostCreated={() => {
          setShowPopup(false);
          loadFeed();
        }}
      />
    )}
  </View>
</Popup>

    </SafeAreaView>
    
    
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === "android" ? 0 : 16,
    backgroundColor: "#ede5f7",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
});
