import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "Home",
};

export default function RootLayout() {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem("refresh-token")
      .then((value) => {
        if (value !== null) {
          router.replace("/private/Home");
        }
      })
      .catch((error) => {
        console.error(error);
        return;
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  return (
    <Stack initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" />
    </Stack>
  );
}
