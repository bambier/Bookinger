import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Card, Text, TextInput } from "react-native-paper";

export default function Login() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("access-token")
      .then((value) => {
        if (value !== null) {
          router.replace("/");
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
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Image
            source={require("@assets/images/login-icon.png")}
            style={styles.cardTitle}
          />
          <Text style={styles.cardTitle} variant="displaySmall">
            ورود
          </Text>
          <TextInput
            mode="outlined"
            style={styles.textInput}
            label="نام کاربری"
            autoFocus={false}
          />
          <TextInput
            mode="outlined"
            style={styles.textInput}
            label="گذرواژه"
            autoFocus={false}
          />
        </Card.Content>
      </Card>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 25,
  },
  cardTitle: {
    alignSelf: "center",
    marginVertical: 5,
  },
  textInput: {
    marginVertical: 5,
  },
});
