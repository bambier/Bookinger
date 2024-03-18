import IconInput from "@/components/IconInput";
import urls from "@/constants/urls";
import isValidEmail from "@/utils/EmailValidator";
import requests from "@/utils/requests";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError, AxiosResponse } from "axios";
import { router } from "expo-router";
import { useEffect, useReducer, useRef, useState } from "react";
import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";

// Codes

export default function Login() {
  const [state, dispatch] = useReducer(reducer, {
    username: {
      value: "",
      error: false,
    },
    password: {
      value: "",
      error: false,
    },
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(false);
  // FIXME: Fix type cheking with a mysterious way
  // BUG: IDK why does this happens
  // @ts-ignore
  const usernameRef = useRef<TextInput>(null);
  // @ts-ignore
  const passwordRef = useRef<TextInput>(null);
  // @ts-ignore
  const passwordReapeatRef = useRef<TextInput>(null);

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

  function Submit(event: GestureResponderEvent) {
    event.preventDefault();
    setDisabledBtn(true);
    if (state.password.value.length < 8) {
      dispatch({ key: "password", value_key: "error", value: true });
    }
    if (state.username.value.length < 4) {
      dispatch({ key: "username", value_key: "error", value: true });
    }
    if (!isValidEmail(state.email.value)) {
      dispatch({ key: "email", value_key: "error", value: true });
    }

    if (
      state.username.value.length >= 4 &&
      state.password.value.length >= 8 &&
      isValidEmail(state.email.value)
    ) {
      requests
        .post(
          urls.account.user.login,
          {
            username: state.username.value,
            password: state.password.value,
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
            ).finally(() => router.replace("/private/Home"));
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
            ورود
          </Text>

          {/* Username input */}

          <IconInput
            icon="account"
            label="نام کاربری"
            value={state.username.value}
            onChangeText={(text: string) =>
              dispatch({ key: "username", value_key: "value", value: text })
            }
            error={state.username.error}
            innerRef={usernameRef}
            onSubmitEditing={(e: any) => passwordRef.current?.focus()}
            returnKeyType="next"
          />

          {/* Password input */}
          <IconInput
            icon="form-textbox-password"
            label="گذرواژه"
            // If `showPassword=false` => secure else NOT secure
            secureTextEntry={!showPassword}
            value={state.password.value}
            onChangeText={(text: string) =>
              dispatch({ key: "password", value_key: "value", value: text })
            }
            error={state.password.error}
            keyboardType={showPassword ? "visible-password" : "default"}
            innerRef={passwordRef}
            onSubmitEditing={(e: any) => passwordReapeatRef.current?.focus()}
            returnKeyType="next"
            right={
              <TextInput.Icon
                icon="eye"
                onPress={() => setShowPassword((value) => !value)}
              />
            }
          />

          {/* Submit btn */}
          <Button
            onPress={Submit}
            mode="contained-tonal"
            style={styles.btn}
            disabled={
              disabledBtn ||
              state.username.length < 4 ||
              state.password.length < 8
            }
            loading={disabledBtn}
          >
            ورود
          </Button>

          <Button
            style={styles.btn}
            onPress={(e) => router.navigate("/Register")}
          >
            ساخت حساب کاربری
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
  btn: {
    marginTop: 35,
    marginBottom: 15,
    paddingVertical: 5,
    width: "75%",
    alignSelf: "center",
  },
});

// Reducer for state
function reducer(
  state: any,
  action: { key: string; value_key: string; value: string | boolean }
) {
  return {
    ...state,
    [action.key]: {
      ...state[action.key],
      [action.value_key]: action.value,
    },
  };
}
