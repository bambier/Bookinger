import Theme from "@/constants/Theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useColorScheme } from "@hooks/useColorScheme";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { I18nManager } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

I18nManager.forceRTL(true);

// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",

  auth: {
    initialRouteName: "Login",
  },
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  const colorScheme = useColorScheme();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || !colorScheme) {
    return null;
  }

  return (
    <ThemeProvider value={Theme[colorScheme].navigation}>
      <PaperProvider theme={Theme[colorScheme].md}>
        <SafeAreaView style={{ flex: 1, margin: 0, padding: 0 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="auth" />
          </Stack>
        </SafeAreaView>
        <StatusBar
          backgroundColor={colorScheme === "dark" ? "#1F222A" : "#F6FAFD"}
          style="auto"
          networkActivityIndicatorVisible={true}
        />
      </PaperProvider>
    </ThemeProvider>
  );
}
