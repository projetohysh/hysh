import LogoutButton from '@/components/LogoutButton';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const getVisitorCommunities = async (visitorId: string | null | undefined) => {
  if (!visitorId) return [];
  const { data } = await supabase
    .from('comunidades_usuarios')
    .select('comunidade_id')
    .eq('usuario_id', visitorId);
  return (data || []).map((item: any) => item.comunidade_id);
};

export default function UserProfile() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();

  if (!userId || typeof userId !== 'string') {
    router.replace('/(tabs)/profile');
    return null;
  }

  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);
      try {
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('id, usuario_nome, usuario_biografia, usuario_foto_url')
          .eq('id', userId)
          .single();

        if (userError || !userData) {
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(userData);

        const { data: { user: currentUser } } = await supabase.auth.getUser();
        const isOwn = currentUser?.id === userId;
        setIsOwnProfile(isOwn);

        const { data: communityData } = await supabase
          .from('comunidades_usuarios')
          .select(`
            comunidades (
              comunidade_id,
              comunidade_nome
            )
          `)
          .eq('usuario_id', userId);

        setCommunities(communityData?.map((c) => c.comunidades) || []);

        if (isOwn || currentUser?.id) {
          const visitorCommunities = await getVisitorCommunities(currentUser?.id);
          if (visitorCommunities.length > 0) {
            const { data: postData } = await supabase
              .from('postagens')
              .select(`
                postagem_id,
                postagem_conteudo,
                postagem_criado_em,
                comunidades!postagens_comunidade_id_fkey(comunidade_nome),
                usuarios!postagens_usuario_id_fkey(usuario_nome, usuario_foto_url)
              `)
              .eq('usuario_id', userId)
              .in('comunidade_id', visitorCommunities)
              .order('postagem_criado_em', { ascending: false });

            setPosts(postData || []);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  },[userId]);

  if (loading){
    return (<View style={styles.fullScreenCenter}><Text>Carregando perfil...</Text></View>);
  }

  if (!user) {
    return (
      <View style={styles.fullScreenCenter}><Text style={styles.error}>Usuário não encontrado</Text></View>
    );
  }

  return (
    <View style={styles.fullScreen}> 
      <ScrollView style={styles.scrollContainer}>
        <SafeAreaView>
          <View style={styles.header}>
            <Image
              source={
                user.usuario_foto_url
                  ? { uri: user.usuario_foto_url }
                  : { uri: 'https://img.icons8.com/?size=100&id=7819&format=png&color=5C39BE' }
              }
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.name}>{user.usuario_nome}</Text>
              <Text style={styles.username}>@{user.id.slice(0, 8)}</Text>
              {user.usuario_biografia && (
              <Text style={styles.bio}>{user.usuario_biografia}</Text>
              )}
            </View>
            <View>
              {isOwnProfile && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => router.push(`/(profile)/EditarPerfil?userId=${userId}`)}
                >
                <Text style={styles.editButtonText}>Editar Perfil</Text>
                </TouchableOpacity>
              )}
              {isOwnProfile && <LogoutButton />}
            </View>
          </View>
          <View style={styles.sidebar}>
            <Text style={styles.sectionTitle}>Comunidades</Text>
            {communities.length > 0 ? (
              <FlatList
                data={communities}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                keyExtractor={(item) => String(item.comunidade_id)}
                renderItem={({ item }) => (
                  <View style={styles.communityBadge}>
                    <Text style={styles.communityText}>{item.comunidade_nome}</Text>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.emptyText}>Nenhuma comunidade</Text>
            )}
          </View>
          <View style={styles.postsSection}>
            <Text style={styles.sectionTitle}>Posts</Text>
            {posts.length > 0 ? (
              posts.map((post) => (
                <View key={post.postagem_id} style={styles.postCard}>
                  <Text style={styles.postContent}>{post.postagem_conteudo}</Text>
                  <Text style={styles.postMeta}>
                  {post.comunidades?.comunidade_nome} •{' '}
                  {new Date(post.postagem_criado_em).toLocaleDateString()}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Nenhum post visível para você</Text>
            )}
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#f5f0ff', 
  },
  fullScreenCenter: {
    flex: 1,
    backgroundColor: '#f5f0ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  error: {
    color: 'red',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    backgroundColor: '#ddd',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 14,
    color: '#666',
  },
  bio: {
    fontSize: 14,
    marginTop: 4,
    color: '#333',
  },
  editButton: {
    backgroundColor: '#5C39BE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  sidebar: {
    padding: 20,
    backgroundColor: 'white',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  communityBadge: {
    backgroundColor: '#ede5f7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  communityText: {
    fontSize: 14,
    color: '#5C39BE',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 10,
  },
  postsSection: {
    padding: 20,
    backgroundColor: 'white',
    marginVertical: 10,
  },
  postCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  postContent: {
    fontSize: 16,
    marginBottom: 8,
  },
  postMeta: {
    fontSize: 12,
    color: '#666',
  },
});