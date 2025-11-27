import { Stack } from "expo-router";

export default function ComentariosLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "transparentModal",
        animation: "slide_from_bottom",
        headerShown: false,
      }}
    />
  );
}
