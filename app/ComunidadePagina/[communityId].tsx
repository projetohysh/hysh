import Header from "@/components/Header";
import NewPost from "@/components/NewPost";
import PostCard from "@/components/PostCard";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image, Modal, Platform,
  Pressable,
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
  usuarios: Usuario | null;
};

type Community = {
  id: number;
  comunidade_nome: string;
  comunidade_descricao?: string;
  comunidade_foto_url?: string | null;
};

export default function ComunidadePagina() {
  const { communityId } = useLocalSearchParams<{ communityId: string }>();

  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [userId, setUserId] = useState<string | null>(null); 
  const [isMember, setIsMember] = useState(false);
  //testando botão membros
  const [membersModalVisible, setMembersModalVisible] = useState(false);
const [members, setMembers] = useState<Usuario[]>([]);
const [loadingMembers, setLoadingMembers] = useState(false);

useEffect(() => {
  const session = supabase.auth.getSession(); 
  session.then(res => {
    if (res.data.session?.user?.id) {
      setUserId(res.data.session.user.id);
    }
  });
}, []);

  async function loadCommunity() {
    if (!communityId) return;

    setLoading(true);

    const { data: communityData, error: communityError } = await supabase
      .from("comunidades")
      .select(
        "comunidade_id, comunidade_nome, comunidade_descricao, comunidade_foto_url"
      )
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

    // 2️⃣ Buscar posts
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
      const normalizedPosts = (postsData || []).map((post) => {
        const usuario = Array.isArray(post.usuarios)
          ? post.usuarios[0] || null
          : post.usuarios || null;
        return { ...post, usuarios: usuario };
      });
      setPosts(normalizedPosts);
    }

    setLoading(false);
  }

  async function loadMembers() {
  if (!communityId) return;

  setLoadingMembers(true);

  const { data, error } = await supabase
    .from("comunidades_usuarios")
    .select(`
      usuarios:usuarios!comunidades_usuarios_usuario_id_fkey (
        usuario_nome,
        usuario_foto_url
      )
    `)
    .eq("comunidade_id", communityId);

  if (error) {
    console.log("Erro ao carregar membros:", error);
    setMembers([]);
  } else {
const parsed = data
  .map((row) => Array.isArray(row.usuarios) ? row.usuarios[0] : row.usuarios)
  .filter((u) => u !== null && u !== undefined) as Usuario[];


    setMembers(parsed);
  }

  setLoadingMembers(false);
}

  // Função para verificar se usuário é membro
  async function checkMembership() {
    if (!communityId || !userId) return;

    const { data, error } = await supabase
      .from("comunidades_usuarios")
      .select("*")
      .eq("comunidade_id", communityId)
      .eq("usuario_id", userId)
      .single();

    if (error) {
      console.log("Erro ao verificar participação:", error);
      setIsMember(false);
    } else {
      setIsMember(!!data);
    }
  }

  async function joinCommunity() {
    if (!communityId || !userId) return;

    const { error } = await supabase
      .from("comunidades_usuarios")
      .insert([{ comunidade_id: communityId, usuario_id: userId }]);

    if (error) {
      console.log("Erro ao entrar na comunidade:", error);
    } else {
      setIsMember(true);
    }
  }

  async function leaveCommunity() {
    if (!communityId || !userId) return;

    const { error } = await supabase
      .from("comunidades_usuarios")
      .delete()
      .eq("comunidade_id", communityId)
      .eq("usuario_id", userId);

    if (error) {
      console.log("Erro ao sair da comunidade:", error);
    } else {
      setIsMember(false);
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCommunity();
    setRefreshing(false);
  };

  useEffect(() => {
    loadCommunity();
  }, [communityId]);

  useEffect(() => {
    if (userId) {
      checkMembership();
    }
  }, [communityId, userId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#5C39BE"
          style={{ marginTop: 30 }}
        />
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
  {membersModalVisible && (
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Text style={styles.modalTitle}>Membros da comunidade</Text>

<Modal
  visible={membersModalVisible}
  animationType="fade"
  transparent={true}
  onRequestClose={() => setMembersModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Text style={styles.modalTitle}>Membros da comunidade</Text>

      {loadingMembers ? (
        <ActivityIndicator size="large" color="#5C39BE" />
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.memberRow}>
              <Image
                source={{
                  uri:
                    item.usuario_foto_url ??
                    "https://ui-avatars.com/api/?name=" + item.usuario_nome,
                }}
                style={styles.memberAvatar}
              />
              <Text style={styles.memberName}>{item.usuario_nome}</Text>
            </View>
          )}
        />
      )}

      <Pressable
        onPress={() => setMembersModalVisible(false)}
        style={styles.closeButton}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Fechar</Text>
      </Pressable>
    </View>
  </View>
</Modal>
    </View>
  </View>
)}

      <FlatList
        data={posts}
        keyExtractor={(item) => item.postagem_id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#5C39BE"]}
            tintColor="#5C39BE"
          />
        }
        ListHeaderComponent={
          <View style={{ padding: 20 }}>
            {community.comunidade_foto_url && (
              <Image
                source={{ uri: community.comunidade_foto_url }}
                style={styles.communityImage}
              />
            )}

            <Text style={styles.communityName}>{community.comunidade_nome}</Text>

            {community.comunidade_descricao && (
              <Text style={styles.communityDescription}>
                {community.comunidade_descricao}
              </Text>
            )}
<View style={{flexDirection: "row", flex:1, gap:10}}>
<Pressable
  onPress={() => {
    loadMembers();
    setMembersModalVisible(true);
  }}
  style={{
    backgroundColor: "#6841d3ff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
    flex:1
  }}
>
  <Text style={{ color: "#fff", fontWeight: "bold" }}>Ver membros</Text>
</Pressable>

            {/* Botão entrar/sair */}
            {userId && (
              <Pressable
                onPress={isMember ? leaveCommunity : joinCommunity}
                style={{
                  backgroundColor: isMember ? "#ccc" : "#5C39BE",
                  padding: 10,
                  borderRadius: 8,
                  marginBottom: 15,
                  alignItems: "center",
                  flex:1
                }}
              >
                <Text
                  style={{
                    color: isMember ? "#333" : "#fff",
                    fontWeight: "bold",
                  }}
                >
                  {isMember ? "Sair da comunidade" : "Entrar na comunidade"}
                </Text>
              </Pressable>
            )}
</View>
            {/* Criar novo post */}
            <NewPost comunidadeId={community.id} onPostCreated={loadCommunity} />

            <Text style={styles.sectionTitle}>Postagens</Text>

            {posts.length === 0 && (
              <Text
                style={{ textAlign: "center", color: "#717171", marginTop: 10 }}
              >
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
  modalOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
},
modalBox: {
  width: "100%",
  maxHeight: "70%",
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 20,
},
modalTitle: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#5C39BE",
  marginBottom: 15,
},
memberRow: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,
},
memberAvatar: {
  width: 40,
  height: 40,
  borderRadius: 20,
  marginRight: 10,
},
memberName: {
  fontSize: 16,
  color: "#333",
},
closeButton: {
  backgroundColor: "#5C39BE",
  padding: 10,
  borderRadius: 8,
  marginTop: 15,
  alignItems: "center",
},

});
