import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
  adaptNavigationTheme,
} from "react-native-paper";

// MD Themes
const mdDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    // background: "#1F222A",
    // @ts-ignore
    statusbar: "#1F222A",
  },
  roundness: 10,
};
const mdLightTheme: MD3Theme = {
  ...MD3LightTheme,
  dark: false,
  colors: {
    ...MD3LightTheme.colors,
    // background: "#F6FAFD",
    // @ts-ignore
    statusbar: "#F6FAFD",
  },
  roundness: 10,
};

// Adaptivation
const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
  materialDark: mdDarkTheme,
  materialLight: mdLightTheme,
});

// indexization
const Theme = {
  light: {
    navigation: LightTheme,
    md: mdLightTheme,
  },
  dark: {
    navigation: DarkTheme,
    md: mdDarkTheme,
  },
};

export default Theme;
