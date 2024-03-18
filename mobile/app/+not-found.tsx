import { Link, Stack, useNavigation, usePathname } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function NotFoundScreen() {
  const path = usePathname();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}> | {path} | </Text>
        <Text style={styles.title}>این صفحه یافت نشد.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>بر گردیم به صفحه اصلی!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
