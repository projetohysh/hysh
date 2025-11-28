import Header from "@/components/Header";
import CommunityCard from "@/components/communityCard";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Community = {
  id: string;
  comunidade_nome: string;
  comunidade_descricao?: string | null;
  comunidade_foto_url?: string | null;
};

export default function Comunidades() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [recomendacoes, setRecomendacoes] = useState<Community[]>([]);
  const [loadingRecomendacoes, setLoadingRecomendacoes] = useState(true);

  useEffect(() => {
    loadUserCommunities();
    loadRecomendacoes();
  }, []);

  async function loadUserCommunities() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setCommunities([]); setLoading(false); return; }

    const { data: userCommunities, error: commError } = await supabase
      .from("comunidades_usuarios")
      .select("comunidade_id")
      .eq("usuario_id", user.id);

    if (commError) { console.log(commError); setLoading(false); return; }
    if (!userCommunities.length) { setCommunities([]); setLoading(false); return; }

    const ids = userCommunities.map(c => c.comunidade_id);
    const { data: communitiesData, error } = await supabase
      .from("comunidades")
      .select("comunidade_id, comunidade_nome, comunidade_descricao, comunidade_foto_url")
      .in("comunidade_id", ids);

    if (error) { console.log(error); setLoading(false); return; }

    setCommunities(communitiesData.map(c => ({
      id: String(c.comunidade_id),
      comunidade_nome: c.comunidade_nome,
      comunidade_descricao: c.comunidade_descricao ?? null,
      comunidade_foto_url: c.comunidade_foto_url ?? null,
    })));
    setLoading(false);
  }

  async function loadRecomendacoes() {
    setLoadingRecomendacoes(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setRecomendacoes([]); setLoadingRecomendacoes(false); return; }

    const { data: recData } = await supabase
      .from("recomendacoes_comunidades")
      .select("comunidade1, comunidade2, comunidade3")
      .eq("usuario_id", user.id)
      .maybeSingle();

    if (!recData) { setRecomendacoes([]); setLoadingRecomendacoes(false); return; }

    const ids = [recData.comunidade1, recData.comunidade2, recData.comunidade3]
      .filter(Boolean)
      .map(Number);

    if (!ids.length) { setRecomendacoes([]); setLoadingRecomendacoes(false); return; }

    const { data: comunidadesData, error } = await supabase
      .from("comunidades")
      .select("comunidade_id, comunidade_nome, comunidade_descricao, comunidade_foto_url")
      .in("comunidade_id", ids);

    if (error) { setRecomendacoes([]); setLoadingRecomendacoes(false); return; }

    setRecomendacoes(comunidadesData.map(c => ({
      id: String(c.comunidade_id),
      comunidade_nome: c.comunidade_nome,
      comunidade_descricao: c.comunidade_descricao ?? null,
      comunidade_foto_url: c.comunidade_foto_url ?? null,
    })));

    setLoadingRecomendacoes(false);
  }

  async function entrarNaComunidade(comunidadeId: string | number) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return Alert.alert("Erro", "Você precisa estar logado!");

      const { data: already } = await supabase
        .from("comunidades_usuarios")
        .select("id")
        .eq("usuario_id", user.id)
        .eq("comunidade_id", comunidadeId)
        .maybeSingle();

      if (already) { Alert.alert("Atenção", "Você já participa desta comunidade."); return; }

      const { error } = await supabase
        .from("comunidades_usuarios")
        .insert([{ usuario_id: user.id, comunidade_id: comunidadeId }]);

      if (error) throw error;

      setRecomendacoes(prev => prev.filter(c => String(c.id) !== String(comunidadeId)));
      Alert.alert("Sucesso", "Agora você participa desta comunidade!");
      loadUserCommunities();
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível entrar na comunidade.");
    }
  }

  async function pickImage() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) { alert("Permissão de acesso à galeria é necessária!"); return; }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!pickerResult.canceled && pickerResult.assets?.[0]?.uri) {
      setImageUri(pickerResult.assets[0].uri);
    }
  }

  async function uploadImage(uri: string, comunidadeId: number) {
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();
    const fileExt = uri.split(".").pop();
    const fileName = `comunidade_${comunidadeId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, arrayBuffer, {
        upsert: true,
        contentType: `image/${fileExt === "jpg" ? "jpeg" : fileExt}`,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    return `${publicUrlData.publicUrl}?t=${new Date().getTime()}`;
  }

  async function handleCreateCommunity() {
    if (!newName.trim()) { Alert.alert("Erro", "O nome da comunidade é obrigatório!"); return; }
    setCreating(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { Alert.alert("Erro", "Você precisa estar logado!"); setCreating(false); return; }

    try {
      const { data: newCommunity, error: insertError } = await supabase
  .from("comunidades")
  .insert([{
    comunidade_nome: newName,
    comunidade_descricao: newDescription || null,
    comunidade_criado_por: user.id
  }])
  .select()
  .single();

if (insertError) throw insertError;

let fotoUrl = null;
if (imageUri) {
  fotoUrl = await uploadImage(imageUri, newCommunity.comunidade_id);
  await supabase
    .from("comunidades")
    .update({ comunidade_foto_url: fotoUrl })
    .eq("comunidade_id", newCommunity.comunidade_id);
}

// Inserir na tabela de relação corretamente
const { data: linkData, error: linkError } = await supabase
  .from("comunidades_usuarios")
  .insert([{ usuario_id: user.id, comunidade_id: newCommunity.comunidade_id }]);

if (linkError) throw linkError;

setCommunities(prev => [
  ...prev,
  {
    id: String(newCommunity.comunidade_id),
    comunidade_nome: newCommunity.comunidade_nome,
    comunidade_descricao: newCommunity.comunidade_descricao ?? undefined,
    comunidade_foto_url: fotoUrl ?? undefined,
  }
]);


      setModalVisible(false);
      setNewName("");
      setNewDescription("");
      setImageUri(null);
      Alert.alert("Sucesso", "Comunidade criada!");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível criar a comunidade.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle="Comunidades" font="Poppins" />
      <ScrollView>
        <ScrollView horizontal>
          {loading ? (
            <ActivityIndicator style={{ marginTop: 30 }} size="large" color="#5C39BE" />
          ) : communities.length === 0 ? (
            <View style={{ padding: 20, marginTop: 30 }}>
              <Text style={{ textAlign: "center", fontSize: 18 }}>
                Você ainda não participa de nenhuma comunidade.
              </Text>
            </View>
          ) : (
            communities.map(item => (
<CommunityCard
  key={item.id}
  id={item.id}
  name={item.comunidade_nome}
  description={item.comunidade_descricao ?? undefined}
  image={item.comunidade_foto_url ?? undefined}
/>

            ))
          )}
        </ScrollView>

        <Pressable
          onPress={() => setModalVisible(true)}
          style={styles.createButton}
        >
          <IconSymbol name="plus.circle.fill" size={24} color="#5C39BE" />
          <Text style={styles.createButtonText}>Criar nova comunidade</Text>
        </Pressable>

        {loadingRecomendacoes ? (
          <ActivityIndicator style={{ marginTop: 20 }} size="small" color="#5C39BE" />
        ) : recomendacoes.length > 0 ? (
          <View style={{ padding: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
              Você também pode gostar:
            </Text>
            {recomendacoes.map(item => (
              <Pressable
                key={item.id}
                onPress={() => router.push(`/ComunidadePagina/${item.id}`)}
                style={{
                  flexDirection: "row",
                  marginBottom: 10,
                  backgroundColor: "white",
                  padding: 10,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Image
                  source={item.comunidade_foto_url
                    ? { uri: item.comunidade_foto_url }
                    : require("@/assets/images/logo hysh.png")}
                  style={{ width: 60, height: 60, borderRadius: 12 }}
                />
                <View style={{ marginLeft: 15, flex: 1, flexDirection: "row", alignItems: "center", justifyContent:"space-between" }}>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.comunidade_nome}</Text>
                  <Pressable
                    onPress={async () => await entrarNaComunidade(item.id)}
                    style={{
                      marginTop: 6,
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      backgroundColor: "#5C39BE",
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 13 }}>Participar</Text>
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </View>
        ) : null}

      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nova Comunidade</Text>
            <TextInput
              placeholder="Nome da comunidade" placeholderTextColor="grey"
              value={newName} onChangeText={setNewName} style={styles.input}
            />
            <TextInput
              placeholder="Descrição (opcional)" placeholderTextColor="grey"
              value={newDescription} onChangeText={setNewDescription}
              style={[styles.input, { height: 80 }]} multiline
            />

            <Pressable onPress={pickImage} style={styles.pickImageButton}>
              <Text style={{ color: "white" }}>
                {imageUri ? "Alterar foto" : "Escolher foto"}
              </Text>
            </Pressable>

            {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}

            <View style={styles.modalButtons}>
              <Pressable onPress={() => setModalVisible(false)} style={[styles.modalButton, { backgroundColor: "#ccc" }]}>
                <Text>Cancelar</Text>
              </Pressable>
              <Pressable onPress={handleCreateCommunity} style={[styles.modalButton, { backgroundColor: "#5C39BE" }]} disabled={creating}>
                <Text style={{ color: "white" }}>{creating ? "Criando..." : "Criar"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#ede5f7", flex: 1, paddingTop: Platform.OS === "android" ? 25 : 0 },
  createButton: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    height: 80,
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    ...Platform.select({ android: { elevation: 5 } }) 
  },
  createButtonText: { color: "#717171", fontSize: 16, fontWeight: "bold" },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.36)", justifyContent: "center", alignItems: "center" },
  modalContainer: { backgroundColor: "white", width: "85%", borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 15 },
  pickImageButton: { backgroundColor: "#5C39BE", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  previewImage: { width: "100%", height: 150, borderRadius: 8, marginBottom: 10 },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  modalButton: { padding: 12, borderRadius: 8, minWidth: 80, alignItems: "center" },
});
