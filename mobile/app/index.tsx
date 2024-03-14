import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function index() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("access-token")
      .then((value) => {
        if (value === null) {
          router.replace("Login");
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
      <Button>رو من کلیک کن</Button>
    </View>
  ) : null;
}
