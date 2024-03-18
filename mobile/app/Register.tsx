import IconInput from "@/components/IconInput";
import urls from "@/constants/urls";
import isValidEmail from "@/utils/EmailValidator";
import requests from "@/utils/requests";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError, AxiosResponse } from "axios";
import * as Network from "expo-network";
import { router } from "expo-router";
import { useEffect, useReducer, useRef, useState } from "react";
import {
  Alert,
  GestureResponderEvent,
  Image,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";

// Codes

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
  // FIXME: Fix type cheking with a mysterious way
  // BUG: IDK why does this happens
  // @ts-ignore
  const usernameRef = useRef<TextInput>(null);
  // @ts-ignore
  const passwordRef = useRef<TextInput>(null);
  // @ts-ignore
  const passwordReapeatRef = useRef<TextInput>(null);
  // @ts-ignore
  const emailRef = useRef<TextInput>(null);

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
      Network.getNetworkStateAsync().then((result) => {
        if (result.isConnected && result.isInternetReachable) {
          requests
            .post(urls.account.user.root, {
              username: state.username.value,
              password: state.password.value,
              email: state.email.value,
            })
            .then((response: AxiosResponse) => {
              if (
                response.status === 201 &&
                typeof response.data === "object"
              ) {
                // logged in
                Alert.alert("ساخت حساب کاربری", response.data["message"], [
                  {
                    text: "تایید",
                    onPress: (e) => router.back(),
                  },
                ]);
              } else {
                ToastAndroid.show("عدم اتصال به اینترنت", ToastAndroid.SHORT);
              }
            })
            .catch((error: AxiosError) => {
              if (error.code === "ERR_CANCELED") {
                return;
              } else if (
                error.response?.status === 400 &&
                typeof error.response.data === "object"
              ) {
                ToastAndroid.show(
                  JSON.stringify(error.response.data),
                  ToastAndroid.LONG
                );
              } else if (error.code === "ERR_NETWORK") {
                ToastAndroid.show("عدم اتصال به اینترنت", ToastAndroid.SHORT);
              } else {
                ToastAndroid.show("خطای ناشناخته", ToastAndroid.SHORT);
              }
            })
            .finally(() => {
              setDisabledBtn(false);
            });
        } else {
          ToastAndroid.show("عدم اتصال به اینترنت", ToastAndroid.LONG);
        }
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

          {/* Password repeat input */}
          <IconInput
            icon="repeat"
            label="تکرار گذرواژه"
            // If `showPassword=false` => secure else NOT secure
            secureTextEntry={!showPassword}
            value={state.password_reapeat.value}
            onChangeText={(text: string) =>
              dispatch({
                key: "password_reapeat",
                value_key: "value",
                value: text,
              })
            }
            error={state.password.value !== state.password_reapeat.value}
            keyboardType={showPassword ? "visible-password" : "default"}
            innerRef={passwordReapeatRef}
            onSubmitEditing={(e: any) => emailRef.current?.focus()}
            returnKeyType="next"
            right={
              <TextInput.Icon
                icon="eye"
                onPress={() => setShowPassword((value) => !value)}
              />
            }
          />

          {/* Email input */}
          <IconInput
            icon="email"
            label="ایمیل"
            value={state.email.value}
            onChangeText={(text: any) =>
              dispatch({
                key: "email",
                value_key: "value",
                value: text,
              })
            }
            error={state.email.error}
            returnKeyType="done"
            keyboardType="email-address"
            inputMode="email"
            innerRef={emailRef}
          />

          {/* Submit btn */}
          <Button
            onPress={Submit}
            mode="contained-tonal"
            style={styles.btn}
            disabled={
              disabledBtn ||
              state.username.value.length < 4 ||
              state.password.value.length < 8 ||
              state.password_reapeat.value !== state.password.value ||
              !isValidEmail(state.email.value)
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
