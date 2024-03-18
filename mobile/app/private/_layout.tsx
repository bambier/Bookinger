import { Stack } from "expo-router";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "Home",
};

export default function RootLayout() {
  return (
    <Stack initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" />
    </Stack>
  );
}
