import urls from "@/constants/urls";
import requests from "@/utils/requests";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError, AxiosResponse } from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";

export default function Register() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("refresh-token")
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

  function Submit(event: GestureResponderEvent) {
    event.preventDefault();
    setDisabledBtn(true);
    if (password.length < 8) {
      setPasswordError(true);
    }
    if (username.length < 4) {
      setUsernameError(true);
    }

    if (password.length >= 8 && username.length >= 4) {
      requests
        .post(
          urls.account.user.login,
          {
            username: username,
            password: password,
          },
          {
            headers: {
              "Accept-Language": "fa-ir",
            },
            timeout: 2000,
          }
        )
        .then((response: AxiosResponse) => {
          if (response.status === 200 && typeof response.data === "object") {
            // logged in
            console.log(response.data);
            AsyncStorage.setItem("access-token", response.data.access);
            AsyncStorage.setItem(
              "refresh-token",
              response.data.refresh
            ).finally(() => router.replace("/"));
          } else {
            ToastAndroid.show("خطای ناشناخته", ToastAndroid.SHORT);
          }
        })
        .catch((error: AxiosError) => {
          if (error.code === "ERR_CANCELED") {
            return;
          } else if (
            error.response?.status === 401 &&
            typeof error.response.data === "object"
          ) {
            ToastAndroid.show(
              "نام کاربری یا گذرواژه نادرست است",
              ToastAndroid.LONG
            );
          } else {
            ToastAndroid.show("خطای ناشناخته", ToastAndroid.SHORT);
          }
        })
        .finally(() => {
          setDisabledBtn(false);
        });
    }
  }

  return isLoaded ? (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Image
            source={require("@assets/images/login-icon.png")}
            style={styles.cardTitle}
          />
          <Text style={styles.cardTitle} variant="displaySmall">
            ساخت حساب کاربری
          </Text>

          {/* Username input */}
          <TextInput
            mode="outlined"
            style={styles.textInput}
            label="نام کاربری"
            autoFocus={false}
            value={username}
            onChangeText={(text) => setUsername(text)}
            error={usernameError}
          />

          {/* Password input */}
          <TextInput
            mode="outlined"
            style={styles.textInput}
            label="گذرواژه"
            autoFocus={false}
            // If `showPassword=false` => secure else NOT secure
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon="eye"
                onPress={() => setShowPassword((value) => !value)}
              />
            }
            value={password}
            onChangeText={(text) => setPassword(text)}
            error={passwordError}
          />

          {/* Submit btn */}
          <Button
            onPress={Submit}
            mode="contained-tonal"
            style={styles.btn}
            disabled={disabledBtn || username.length < 4 || password.length < 8}
            loading={disabledBtn}
          >
            ساخت حساب کاربری جدید
          </Button>

          <Button style={styles.btn} onPress={(e) => router.back()}>
            ورود به حساب کاربری
          </Button>
        </Card.Content>
      </Card>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: "center",
  },
  cardTitle: {
    alignSelf: "center",
    marginVertical: 5,
  },
  textInput: {
    marginVertical: 5,
  },
  btn: {
    marginTop: 35,
    marginBottom: 15,
    paddingVertical: 5,
    width: "75%",
    alignSelf: "center",
  },
});
