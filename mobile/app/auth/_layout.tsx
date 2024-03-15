import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Register" />
      <Stack.Screen name="Login" />
    </Stack>
  );
}
