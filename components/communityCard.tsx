import { ImageBackground } from "expo-image";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  id: string;
  name: string;
  description?: string;
  image?: string | null;
};

export default function CommunityCard({ id, name, image }: Props) {
  return (
    <TouchableOpacity style={styles.card}
onPress={() =>
  router.push({
    pathname: "/ComunidadePagina/[communityId]", // também corrigi o caminho (minúsculas!)
    params: { communityId: id }, // ✅ agora sim!
  })
}
    >
      <ImageBackground
        source={{ uri: image || "https://via.placeholder.com/300" }}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 12,
          overflow: "hidden",
          justifyContent: "flex-end",
        }}
      >
        <LinearGradient
          colors={["transparent", "rgba(89, 0, 190, 0.8)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "70%",
            borderRadius: 12,
          }}
        />

        <Text style={styles.title}>{name}</Text>
        

      </ImageBackground>
      
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 20,
    width: 200,
    height: 300,
    borderRadius: 12,
    backgroundColor: "#5C39BE",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
    paddingHorizontal: 6,
  },
  desc: {
    fontSize: 14,
    color: "#f1f1f1",
    paddingHorizontal: 6,
    marginBottom: 10,
  },
});
