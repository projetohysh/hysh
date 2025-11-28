import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Usuario = {
  id: string;
  usuario_nome: string;
  usuario_foto_url: string | null;
};

type Comunidade = {
  comunidade_id: number;
  comunidade_nome: string;
  comunidade_foto_url: string | null;
};

type Postagem = {
  postagem_id: number;
  postagem_conteudo: string;
};

export default function Explore() {
  const [query, setQuery] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [comunidades, setComunidades] = useState<Comunidade[]>([]);
  const [postagens, setPostagens] = useState<Postagem[]>([]);

  useEffect(() => {
    if (query.trim().length === 0) {
      setUsuarios([]);
      setComunidades([]);
      setPostagens([]);
      return;
    }

    const timeout = setTimeout(() => {
      buscar();
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  async function buscar() {
    try {
      const [u, c, p] = await Promise.all([
        supabase
          .from('usuarios')
          .select('id, usuario_nome, usuario_foto_url')
          .ilike('usuario_nome', `%${query}%`),

        supabase
          .from('comunidades')
          .select('comunidade_id, comunidade_nome, comunidade_foto_url')
          .ilike('comunidade_nome', `%${query}%`),

        supabase
          .from('postagens')
          .select('postagem_id, postagem_conteudo')
          .ilike('postagem_conteudo', `%${query}%`),
      ]);

      if (!u.error) setUsuarios(u.data || []);
      if (!c.error) setComunidades(c.data || []);
      if (!p.error) setPostagens(p.data || []);
    } catch (err) {
      console.log('Erro ao buscar:', err);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle="Explorar" />

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Busque comunidades, posts, pessoas"
          placeholderTextColor="#999"
          style={styles.input}
          value={query}
          onChangeText={setQuery}
        />
        <FontAwesome6 name="magnifying-glass" size={24} color="#5C39BE" />
      </View>

      <ScrollView style={{ paddingHorizontal: 10 }}>

        {/* Usuários */}
        {usuarios.length > 0 && (
          <>
            <Text style={styles.title}>Usuários</Text>
            {usuarios.map((u) => (
              <TouchableOpacity
                key={u.id}
                style={styles.item}
                onPress={() => router.push(`/${u.id}`)}
              >
                <Image
                  source={{ uri: u.usuario_foto_url || 'https://via.placeholder.com/50' }}
                  style={styles.avatar}
                />
                <Text style={styles.itemText}>{u.usuario_nome}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Comunidades */}
        {comunidades.length > 0 && (
          <>
            <Text style={styles.title}>Comunidades</Text>
            {comunidades.map((c) => (
              <TouchableOpacity
                key={c.comunidade_id}
                style={styles.item}
                onPress={() => router.push(`/ComunidadePagina/${c.comunidade_id}`)}
              >
                <Image
                  source={{ uri: c.comunidade_foto_url || 'https://via.placeholder.com/50' }}
                  style={styles.avatar}
                />
                <Text style={styles.itemText}>{c.comunidade_nome}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Postagens */}
        {postagens.length > 0 && (
          <>
            <Text style={styles.title}>Postagens</Text>
            {postagens.map((p) => (
              <TouchableOpacity
                key={p.postagem_id}
                style={styles.item}              >
                <FontAwesome6 name="file-alt" size={28} color="#5C39BE" />
                <Text style={styles.itemText} numberOfLines={1}>
                  {p.postagem_conteudo}
                </Text>
              </TouchableOpacity>
            ))}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#ede5f7', flex: 1, paddingTop: Platform.OS === 'android' ? 25 : 0 },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    justifyContent: 'center',
    marginBottom: 20,
  },

  input: {
    width: 300,
    backgroundColor: 'white',
    height: 40,
    borderRadius: 50,
    paddingLeft: 15,
    fontSize: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 20,
    marginBottom: 8,
    color: '#5C39BE',
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 10,
  },

  itemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: '#ddd',
  },
});
