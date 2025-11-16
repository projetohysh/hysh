import Header from '@/components/Header';
import NewPostButton from '@/components/NewPostButton';
import PostCard from '@/components/PostCard';
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function HomeScreen() {

type Usuario = {
  usuario_nome: string;
  usuario_foto_url: string | null;
};

type Comunidade = {
  comunidade_nome: string;
};

type Post = {
  id: string;
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

    // 1️⃣ Buscar usuário logado
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

    // 2️⃣ Buscar comunidades que ele participa
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

    // 3️⃣ Buscar posts dessas comunidades
const {  data, error: postsError } = await supabase
  .from("postagens")
  .select(`
    postagem_id,
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
  // mapear postagem_id para id
  const postsMapped = data.map((p: any) => ({
    id: p.postagem_id,
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

  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      <Header headerTitle="Hysh" />

      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          Carregando feed...
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
    postOwner={item.usuarios?.usuario_nome || "Usuário Hysh"}
    profPic={item.usuarios?.usuario_foto_url}
    content={item.postagem_conteudo}
    username="@usuario"
    postTime={item.postagem_criado_em}
comunidade={item.comunidades?.comunidade_nome || "Comunidade"}  />
)}

        />
      )}

      <NewPostButton />
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
