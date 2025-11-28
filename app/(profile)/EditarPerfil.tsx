// app/(profile)/EditarPerfil.tsx
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditarPerfil() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [usuario_nome, setUsuarioNome] = useState('');
  const [usuario_biografia, setUsuarioBiografia] = useState('');
  const [usuario_foto_url, setUsuarioFotoUrl] = useState('');
  const [loading, setLoading] = useState(true);

  // Carregar dados do usuário
  useEffect(() => {
    if (!userId) {
      Alert.alert('Erro', 'Usuário não especificado');
      router.back();
      return;
    }
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('usuarios')
      .select('usuario_nome, usuario_biografia, usuario_foto_url')
      .eq('id', userId)
      .single();

    if (error || !data) {
      Alert.alert('Erro', 'Não foi possível carregar o perfil');
      router.back();
    } else {
      setUsuarioNome(data.usuario_nome || '');
      setUsuarioBiografia(data.usuario_biografia || '');
      setUsuarioFotoUrl(data.usuario_foto_url || '');
    }
    setLoading(false);
  };

  // Selecionar imagem
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // funciona
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      uploadProfileImage(uri);
    }
  };

  // Enviar imagem para Supabase Storage usando ArrayBuffer
const uploadProfileImage = async (uri: string) => {
  try {
    if (!userId) throw new Error('Usuário não definido');

    const fileExt = uri.split('.').pop()?.split('?')[0] || 'jpg';
    const fileName = `avatar_${userId}.${fileExt}`;

    // Pegar arquivo como ArrayBuffer
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();

    // Upload no Supabase
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, arrayBuffer, {
        upsert: true,
        contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
      });

    if (uploadError) throw uploadError;

    // URL pública
    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    const publicUrl = data.publicUrl;

    // Atualizar no banco
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ usuario_foto_url: publicUrl })
      .eq('id', userId);

    if (updateError) throw updateError;
const timestamp = new Date().getTime();
const publicUrlWithCacheBuster = `${publicUrl}?t=${timestamp}`;
setUsuarioFotoUrl(publicUrlWithCacheBuster);

    Alert.alert('Sucesso', 'Foto atualizada!');
  } catch (err) {
    console.error('Erro ao enviar imagem:', err);
    Alert.alert('Erro', 'Não foi possível enviar a imagem');
  }
  
};


  // Salvar alterações
  const handleSave = async () => {
    if (!usuario_nome.trim()) {
      Alert.alert('Atenção', 'O nome é obrigatório');
      return;
    }

    const { error } = await supabase
      .from('usuarios')
      .update({
        usuario_nome: usuario_nome.trim(),
        usuario_biografia: usuario_biografia.trim() || null,
      })
      .eq('id', userId);

    if (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
    } else {
      Alert.alert('Sucesso', 'Perfil atualizado!');
      router.back();
    }
  };

  if (loading) {
    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f0ff', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}
  style={{ backgroundColor: '#f5f0ff' }} >
      <SafeAreaView>
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          <Image
            source={
              usuario_foto_url
                ? { uri: usuario_foto_url }
                : { uri: 'https://placehold.co/100' }
            }
            style={styles.avatar}
          />
          <Text style={styles.changePhotoText}>Alterar foto</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={usuario_nome}
          onChangeText={setUsuarioNome}
        />

        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="Biografia (opcional)"
          value={usuario_biografia}
          onChangeText={setUsuarioBiografia}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f0ff' },
  avatarContainer: { alignSelf: 'center', alignItems: 'center', marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#eee' },
  changePhotoText: { marginTop: 8, color: '#5C39BE', fontWeight: '600' },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0d6f0',
  },
  bioInput: { height: 100, textAlignVertical: 'top' },
  saveButton: { backgroundColor: '#5C39BE', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});