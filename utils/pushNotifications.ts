import { supabase } from "@/lib/supabase";
import * as Notifications from "expo-notifications";

export async function savePushToken() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return;

    const token = (await Notifications.getExpoPushTokenAsync()).data;

    await supabase
      .from("usuarios")
      .update({ expo_push_token: token })
      .eq("id", user.id);

  } catch (e) {
    console.log("Erro ao salvar push token:", e);
  }
}
