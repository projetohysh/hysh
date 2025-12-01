import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Chat() {
const { chatId } = useLocalSearchParams();
const comunidadeNum = chatId ? parseInt(chatId as string, 10) : null;
  const { user } = useAuth();

  const [mensagens, setMensagens] = useState<any[]>([]);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
const router = useRouter();

  useEffect(() => {
    if (!comunidadeNum) return;
    carregarMensagens();
  }, [comunidadeNum]);

  useEffect(() => {
    if (!comunidadeNum) return;

    const channel = supabase
      .channel("mensagens-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mensagens",
          filter: `comunidade_id=eq.${comunidadeNum}`
        },
(payload) => {
  const newMsg = payload.new;

  if (usuariosMap[newMsg.usuario_id]) {
    const enrichedMsg = {
      ...newMsg,
      usuarios: {
        usuario_nome: usuariosMap[newMsg.usuario_id].nome,
        usuario_foto_url: usuariosMap[newMsg.usuario_id].foto_url,
      },
    };
    setMensagens((prev) => [...prev, enrichedMsg]);
  } else {
    // Buscar o usuário individualmente
    supabase
      .from('usuarios')
      .select('usuario_nome, usuario_foto_url')
      .eq('id', newMsg.usuario_id)
      .maybeSingle()
      .then(({ data }) => {
        const enrichedMsg = {
          ...newMsg,
          usuarios: data
            ? { usuario_nome: data.usuario_nome, usuario_foto_url: data.usuario_foto_url }
            : null,
        };
        setMensagens((prev) => [...prev, enrichedMsg]);
      });
  }
}
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [comunidadeNum]);
type Community = {
  comunidade_nome: string;
  comunidade_foto_url?: string | null;
};
const [usuariosMap, setUsuariosMap] = useState<Record<number, { nome: string; foto_url?: string }>>({});

useEffect(() => {
  async function carregarUsuarios() {
    if (!comunidadeNum) return;

    // Busca todos os usuários da comunidade
    const { data, error } = await supabase
      .from("usuarios_comunidades") // tabela que liga usuários à comunidade
      .select("usuario_id")
      .eq("comunidade_id", comunidadeNum);

    if (error || !data) return;

    const ids = data.map((u) => u.usuario_id);

    // Agora busca os perfis desses usuários
    const { data: perfis } = await supabase
      .from("usuarios")
      .select("id, usuario_nome, usuario_foto_url")
      .in("id", ids);

    if (perfis) {
      const map: Record<number, any> = {};
      perfis.forEach(u => map[u.id] = { nome: u.usuario_nome, foto_url: u.usuario_foto_url });
      setUsuariosMap(map);
    }
  }

  carregarUsuarios();
}, [comunidadeNum]);


const [community, setCommunity] = useState<Community | null>(null);
useEffect(() => {
  if (!comunidadeNum) return;

  async function carregarCommunity() {
    const { data, error } = await supabase
      .from("comunidades")
      .select("comunidade_nome, comunidade_foto_url")
      .eq("comunidade_id", comunidadeNum)
      .single();

    if (error) {
      console.log("Erro ao carregar comunidade:", error);
    } else {
      setCommunity(data);
    }
  }

  carregarCommunity();
}, [comunidadeNum]);

async function carregarMensagens() {
  if (!comunidadeNum) return;

  setLoading(true);
  try {
    const { data, error } = await supabase
      .from("mensagens")
      .select(`
        *,
        usuarios!mensagens_usuario_id_fkey (
          usuario_nome,
          usuario_foto_url
        )
      `)
      .eq("comunidade_id", comunidadeNum)
      .order("created_at", { ascending: true });

    if (error) {
      console.log("Erro ao carregar mensagens:", error);
    } else {
      setMensagens(data);
    }
  } catch (err) {
    console.log("Erro inesperado ao carregar mensagens:", err);
  } finally {
    setLoading(false);
  }
}


async function enviarMensagem() {
  if (!texto.trim() || !user || !comunidadeNum) return;

  try {
    const { error } = await supabase
      .from("mensagens")
      .insert({
        comunidade_id: comunidadeNum,
        usuario_id: user.id,
        conteudo: texto.trim(),
      });

    if (error) {
      console.log("Erro ao enviar mensagem:", error);
      Alert.alert("Erro ao enviar mensagem", error.message);
      return;
    }

    // NÃO FAZER setMensagens aqui. A subscription vai atualizar a lista automaticamente.
    setTexto("");
  } catch (err) {
    console.log("Erro inesperado:", err);
    Alert.alert("Erro inesperado", "Não foi possível enviar a mensagem");
  }
}



  return (
    <SafeAreaView style={styles.container}>
      {community && (
  <View style={styles.header}>
    {community.comunidade_foto_url && (
      <Image
        source={{ uri: community.comunidade_foto_url }}
        style={styles.communityImage}
      />
    )}
    <Text style={styles.communityName}>{community.comunidade_nome}</Text>
  </View>
)}

<FlatList
  data={mensagens}
  keyExtractor={(item) => (item.id ?? item.mensagem_id).toString()}
  renderItem={({ item }) => {
    const fotoDoUsuario = item.usuarios?.usuario_foto_url ?? usuariosMap[item.usuario_id]?.foto_url ?? "https://ui-avatars.com/api/?name=Usuário";

    return (
      <View style={[styles.msgContainer, item.usuario_id === user?.id ? styles.mineContainer : styles.theirsContainer]}>
        <Pressable onPress={() => router.push(`/(profile)/${item.usuario_id}`)}>
          <Image source={{ uri: fotoDoUsuario }} style={styles.userAvatar} />
        </Pressable>
        <View style={[styles.msg, item.usuario_id === user?.id ? styles.mine : styles.theirs]}>
          <Text style={[styles.text, item.usuario_id === user?.id && { color: "white" }]}>{item.conteudo}</Text>
          <Text style={styles.time}>{new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
        </View>
      </View>
    );
  }}
/>
  <KeyboardAvoidingView
    style={styles.keyboardAvoidingContainer}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    keyboardVerticalOffset={90} // ajuste fino: header + status bar (~50 + ~40)
  >
      <View style={styles.inputArea}>
        <TextInput
          value={texto}
          onChangeText={setTexto}
          style={styles.input}
          placeholder="Digite uma mensagem..."
        />
        <Pressable onPress={enviarMensagem} style={styles.button}>
          <Text style={{ color: "white" }}>Enviar</Text>
        </Pressable>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "white" },
  msg: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  mine: {
    alignSelf: "flex-end",
    backgroundColor: "#5C39BE",
  },
  theirs: {
    alignSelf: "flex-start",
    backgroundColor: "#E4E4E4",
  },
  text: { color: "black" },
  time: { fontSize: 10, opacity: 0.6, marginTop: 4 },
  inputArea: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    padding: 10,
  },
  button: {
    backgroundColor: "#5C39BE",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  header: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 10,
},
communityImage: {
  width: 40,
  height: 40,
  borderRadius: 20,
  marginRight: 10,
},
communityName: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#5C39BE",
},
msgContainer: {
  flexDirection: "row",
  alignItems: "flex-end",
  marginBottom: 10,
  maxWidth: "80%",
},

mineContainer: {
  alignSelf: "flex-end",
  flexDirection: "row-reverse",
},

theirsContainer: {
  alignSelf: "flex-start",
  flexDirection: "row",
},

userAvatar: {
  width: 35,
  height: 35,
  borderRadius: 17.5,
  marginHorizontal: 5,
  bottom:20
},
  keyboardAvoidingContainer: {
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white", // ← evitar fundo preto
  },
});
