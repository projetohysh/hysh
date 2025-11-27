import Header from "@/components/Header";
import NewPost from "@/components/NewPost";
import PostCard from "@/components/PostCard";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



type Usuario = {
  usuario_nome: string;
  usuario_foto_url?: string | null;
};

type Post = {
  postagem_id: number;
  usuario_id: string;
  postagem_conteudo: string;
  postagem_criado_em: string;
  usuarios: Usuario | null; // ✅ objeto único ou null
};




type Community = {
  id: number;
  comunidade_nome: string;
  comunidade_descricao?: string;
  comunidade_foto_url?: string | null;
};

export default function ComunidadePagina() {
  // ✅ Pega o communityId da rota
const { communityId } = useLocalSearchParams<{ communityId: string }>();

const [refreshing, setRefreshing] = useState(false);

const onRefresh = async () => {
  setRefreshing(true);
  await loadCommunity();
  setRefreshing(false);
};


  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCommunity() {
    if (!communityId) return;

    setLoading(true);

    // 1️⃣ Buscar dados da comunidade
    const { data: communityData, error: communityError } = await supabase
      .from("comunidades")
      .select("comunidade_id, comunidade_nome, comunidade_descricao, comunidade_foto_url")
      .eq("comunidade_id", communityId)
      .single();

    if (communityError || !communityData) {
      console.log("Erro ao buscar comunidade:", communityError);
      setLoading(false);
      return;
    }

    setCommunity({
      id: communityData.comunidade_id,
      comunidade_nome: communityData.comunidade_nome,
      comunidade_descricao: communityData.comunidade_descricao,
      comunidade_foto_url: communityData.comunidade_foto_url,
    });

    // 2️⃣ Buscar posts da comunidade
const { data: postsData, error: postsError } = await supabase
  .from("postagens")
.select(`
  postagem_id,
  postagem_conteudo,
  postagem_criado_em,
  usuario_id,
  usuarios!postagens_usuario_id_fkey (
    usuario_nome,
    usuario_foto_url
  )
`)
  .eq("comunidade_id", communityId)
  .order("postagem_criado_em", { ascending: false });






    if (postsError) {
      console.log("Erro ao buscar posts:", postsError);
      setPosts([]);
    } else {
const normalizedPosts = (postsData || []).map(post => {
  const usuario = Array.isArray(post.usuarios) 
    ? post.usuarios[0] || null 
    : post.usuarios || null;

  return {
    ...post,
    usuarios: usuario,
  };
});

setPosts(normalizedPosts);    }

    setLoading(false);
  }

  useEffect(() => {
    loadCommunity();
  }, [communityId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#5C39BE" style={{ marginTop: 30 }} />
      </SafeAreaView>
    );
  }

  if (!community) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 50, fontSize: 18 }}>
          Comunidade não encontrada.
        </Text>
      </SafeAreaView>
    );
  }

 return (
  <SafeAreaView style={styles.container}>
    <Header headerTitle={community.comunidade_nome} font="Poppins" />

    <FlatList
      data={posts}
      keyExtractor={(item) => item.postagem_id.toString()}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#5C39BE']}
          tintColor="#5C39BE"
        />
      }
      ListHeaderComponent={
        <View style={{ padding: 20 }}>
          
          {/* Foto da comunidade */}
          {community.comunidade_foto_url && (
            <Image
              source={{ uri: community.comunidade_foto_url }}
              style={styles.communityImage}
            />
          )}

          {/* Nome e descrição */}
          <Text style={styles.communityName}>{community.comunidade_nome}</Text>

          {community.comunidade_descricao && (
            <Text style={styles.communityDescription}>
              {community.comunidade_descricao}
            </Text>
          )}

          {/* Criar novo post */}
          <NewPost
            comunidadeId={community.id}
            onPostCreated={() => loadCommunity()}
          />

          <Text style={styles.sectionTitle}>Postagens</Text>

          {posts.length === 0 && (
            <Text style={{ textAlign: "center", color: "#717171", marginTop: 10 }}>
              Nenhuma postagem ainda.
            </Text>
          )}
        </View>
      }
      renderItem={({ item }) => (
        <PostCard
        userId={item.usuario_id}
          id={item.postagem_id.toString()}
          postOwner={item.usuarios?.usuario_nome || "Usuário"}
          profPic={item.usuarios?.usuario_foto_url || null}
          content={item.postagem_conteudo}
          username="@usuario"
          postTime={item.postagem_criado_em}
          comunidade={community.comunidade_nome}
        />
      )}
      ListFooterComponent={<View style={{ height: 30 }} />}
      contentContainerStyle={{ paddingBottom: 40 }}
    />
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ede5f7",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  communityImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
  communityName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5C39BE",
    marginBottom: 8,
  },
  communityDescription: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5C39BE",
    marginBottom: 10,
  },
  postCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postContent: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  postDate: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
  },
});
