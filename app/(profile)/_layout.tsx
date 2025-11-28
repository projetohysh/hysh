import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EditarPerfil" />
            <Stack.Screen name="[userId]" />

    </Stack>
  );
}
