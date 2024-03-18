import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return isLoaded ? (
    <View>
      <Text>سلام عزیزم عزیم سلام</Text>
      <Button onPress={(e) => AsyncStorage.clear()}>رو من کلیک کن</Button>
    </View>
  ) : null;
}
