import urls from "@/constants/urls";
import requests from "@/utils/requests";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError, AxiosResponse } from "axios";
import { router } from "expo-router";
import { useEffect, useReducer, useState } from "react";
import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import { Button, Card, Icon, Text, TextInput } from "react-native-paper";

// Codes

// Reducer for state
function reducer(
  state: any,
  action: { key: string; value_key: string; value: string }
) {
  return {
    ...state,
    [action.key]: {
      ...state[action.key],
      [action.value_key]: action.value,
    },
  };
}

const ICON_SIZE = 23;

// Main Componetnt View
export default function Register() {
  const [state, dispatch] = useReducer(reducer, {
    username: {
      value: "",
      error: false,
    },
    password: {
      value: "",
      error: false,
    },
    password_reapeat: {
      value: "",
    },
    email: {
      value: "",
      error: false,
    },
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  // FIXME: Fix URL and data
  function Submit(event: GestureResponderEvent) {
    event.preventDefault();
    setDisabledBtn(true);
    if (state.password.value.length < 8) {
      dispatch({ key: "password", value_key: "error", value: true });
    }
    if (state.username.value.length < 4) {
      dispatch({ key: "username", value_key: "error", value: true });
    }

    if (state.password.length >= 8 && state.username.length >= 4) {
      requests
        .post(urls.account.user.login, {
          username: state.username,
          password: state.password,
        })
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
          <View style={styles.inputContainer}>
            <Icon source="account" size={ICON_SIZE} />
            <TextInput
              mode="outlined"
              style={styles.textInput}
              label="نام کاربری"
              value={state.username.value}
              onChangeText={(text) =>
                dispatch({ key: "username", value_key: "value", value: text })
              }
              error={state.username.error}
              returnKeyType="next"
            />
          </View>

          {/* Password input */}
          <View style={styles.inputContainer}>
            <Icon source="form-textbox-password" size={ICON_SIZE} />
            <TextInput
              mode="outlined"
              style={styles.textInput}
              label="گذرواژه"
              // If `showPassword=false` => secure else NOT secure
              secureTextEntry={!showPassword}
              value={state.password.value}
              onChangeText={(text) =>
                dispatch({ key: "password", value_key: "value", value: text })
              }
              error={state.password.error}
              keyboardType={showPassword ? "visible-password" : "default"}
              returnKeyType="next"
              right={
                <TextInput.Icon
                  icon="eye"
                  onPress={() => setShowPassword((value) => !value)}
                />
              }
            />
          </View>

          {/* Password repeat input */}
          <View style={styles.inputContainer}>
            <Icon source="repeat" size={ICON_SIZE} />
            <TextInput
              mode="outlined"
              style={styles.textInput}
              label="تکرار گذرواژه"
              // If `showPassword=false` => secure else NOT secure
              secureTextEntry={!showPassword}
              value={state.password_reapeat.value}
              onChangeText={(text) =>
                dispatch({
                  key: "password_reapeat",
                  value_key: "value",
                  value: text,
                })
              }
              error={state.password.value !== state.password_reapeat.value}
              keyboardType={showPassword ? "visible-password" : "default"}
              returnKeyType="next"
              right={
                <TextInput.Icon
                  icon="eye"
                  onPress={() => setShowPassword((value) => !value)}
                />
              }
            />
          </View>

          {/* Email input */}
          <View style={styles.inputContainer}>
            <Icon source="email" size={ICON_SIZE} />
            <TextInput
              mode="outlined"
              style={styles.textInput}
              label="ایمیل"
              value={state.email.value}
              onChangeText={(text) =>
                dispatch({
                  key: "email",
                  value_key: "value",
                  value: text,
                })
              }
              error={state.email.error}
              returnKeyType="yahoo"
            />
          </View>

          {/* Submit btn */}
          <Button
            onPress={Submit}
            mode="contained-tonal"
            style={styles.btn}
            disabled={
              disabledBtn ||
              state.username.value.length < 4 ||
              state.password.value.length < 8 ||
              state.password_reapeat.value !== state.password.value
            }
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    alignSelf: "center",
    marginVertical: 5,
  },
  textInput: {
    marginVertical: 5,
    flex: 1,
    marginLeft: 10,
  },
  btn: {
    marginTop: 35,
    marginBottom: 15,
    paddingVertical: 5,
    width: "75%",
    alignSelf: "center",
  },
});
