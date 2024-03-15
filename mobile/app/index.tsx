import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function index() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("refresh-token")
      .then((value) => {
        if (value === null) {
          router.replace("/auth/Login");
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  return isLoaded ? (
    <View>
      <Text>سلام عزیزم عزیم سلام</Text>
      <Button onPress={(e) => AsyncStorage.clear()}>رو من کلیک کن</Button>
    </View>
  ) : null;
}
