import { supabase } from "@/lib/supabase";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type NewPostProps = {
  comunidadeId: number; // ID da comunidade em que o post será criado
  onPostCreated: () => void; // callback para atualizar o feed
};

export default function NewPost({ comunidadeId, onPostCreated }: NewPostProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreatePost() {
    if (!content.trim()) return;

    setLoading(true);

    // pegar usuário logado
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log("Erro ao pegar usuário:", userError);
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("postagens").insert([
      {
        usuario_id: user.id,
        comunidade_id: comunidadeId,
        postagem_conteudo: content,
      },
    ]);

    if (error) {
      console.log("Erro ao criar post:", error);
    } else {
      setContent(""); // limpa o input
      onPostCreated(); // atualiza o feed
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Escreva algo..."
        value={content}
        onChangeText={setContent}
        style={styles.input}
        multiline
      />
      <Pressable
        onPress={handleCreatePost}
        style={[styles.button, loading && { opacity: 0.6 }]}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Postando..." : "Postar"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#5C39BE",
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
