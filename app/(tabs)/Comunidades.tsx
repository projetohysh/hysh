import CommunityCard from "@/components/communityCard";
import Header from "@/components/Header";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";



type Community = {
  id: string;
  comunidade_nome: string;
  comunidade_descricao?: string;
  comunidade_foto_url?: string | null;
};

export default function Comunidades() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadUserCommunities() {
    setLoading(true);

    // 1️⃣ pega o usuário logado
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setCommunities([]);
      setLoading(false);
      return;
    }

    // 2️⃣ pega a lista de comunidades do usuário
    const { data: userCommunities, error: commError } = await supabase
      .from("comunidades_usuarios")
      .select("comunidade_id")
      .eq("usuario_id", user.id);

    if (commError) {
      console.log(commError);
      setLoading(false);
      return;
    }

    if (!userCommunities.length) {
      setCommunities([]);
      setLoading(false);
      return;
    }

    const ids = userCommunities.map((c) => c.comunidade_id);

    // 3️⃣ buscar dados das comunidades
 const { data: communitiesData, error } = await supabase
  .from("comunidades")
  .select("comunidade_id, comunidade_nome, comunidade_descricao, comunidade_foto_url")
  .in("comunidade_id", ids);

if (error) {
  console.log(error);
  setLoading(false);
  return;
}

const communitiesDataMapped = communitiesData.map(c => ({
  id: c.comunidade_id,
  comunidade_nome: c.comunidade_nome,
  comunidade_descricao: c.comunidade_descricao,
  comunidade_foto_url: c.comunidade_foto_url,
}));

setCommunities(communitiesDataMapped);
setLoading(false);
  }

  function createCom() {
    alert("Criar comunidade vai ser implementado em breve!");
  }

  useEffect(() => {
    loadUserCommunities();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle="Suas Comunidades" font="Poppins" />

      <ScrollView>
              <ScrollView horizontal>

        {loading ? (
          <ActivityIndicator
            style={{ marginTop: 30 }}
            size="large"
            color="#5C39BE"
          />
        ) : communities.length === 0 ? (
          <View style={{ padding: 20, marginTop: 30 }}>
            <Text style={{ textAlign: "center", fontSize: 18 }}>
              Você ainda não participa de nenhuma comunidade.
            </Text>
          </View>
        ) : (
          communities.map((item) => (

  <CommunityCard

  key={item.id}
    id={item.id}
    name={item.comunidade_nome}
    description={item.comunidade_descricao}
    image={item.comunidade_foto_url}
  />


          ))
        )}
      </ScrollView>

        <Pressable
          onPress={createCom}
          style={{
            backgroundColor: "white",
            margin: 20,
            padding: 20,
            borderRadius: 12,
            alignItems: "center",
            boxShadow: "0px 10px 10px 00px #0000002f",
            height: 80,
            justifyContent: "center",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <IconSymbol name="plus.circle.fill" size={24} color="#5C39BE" />
          <Text
            style={{ color: "#717171", fontSize: 16, fontWeight: "bold" }}
          >
            Criar nova comunidade
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ede5f7",
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
});
