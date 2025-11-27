import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ComentariosModal() {
  const { postId } = useLocalSearchParams();
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [loading, setLoading] = useState(true);

  async function carregarComentarios() {
    setLoading(true);
    const { data, error } = await supabase
      .from("comentarios")
      .select(`
        comentario_id,
        comentario_conteudo,
        comentario_criado_em,
        usuarios:usuario_id (usuario_nome, usuario_foto_url)
      `)
      .eq("postagem_id", postId)
      .order("comentario_id", { ascending: true });

    if (!error) setComentarios(data);
    setLoading(false);
  }

  async function enviarComentario() {
    if (!novoComentario.trim()) return;

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    await supabase.from("comentarios").insert({
      comentario_conteudo: novoComentario,
      postagem_id: Number(postId),
      usuario_id: user.id,
    });

    setNovoComentario("");
    carregarComentarios();
  }

  useEffect(() => {
    carregarComentarios();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Comentários</Text>

      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={comentarios}
          keyExtractor={(item) => item.comentario_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.commentBox}>
              <Text style={styles.user}>{item.usuarios?.usuario_nome}</Text>
              <Text>{item.comentario_conteudo}</Text>
            </View>
          )}
        />
      )}

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Escreva um comentário..."
          value={novoComentario}
          onChangeText={setNovoComentario}
        />
        <Pressable style={styles.button} onPress={enviarComentario}>
            <Text style={{color: "white", alignSelf: "center"}}>Enviar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  commentBox: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  user: { fontWeight: "bold", marginBottom: 4 },
  inputArea: { flexDirection: "row", gap: 10, marginTop: 20, alignSelf: "flex-end" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  button:{
    backgroundColor:"#5C39BE",
    borderRadius: 16,
    width: "20%",
    justifyContent: "center"
}
});
