import { StyleSheet, View } from "react-native";
import { Icon, TextInput } from "react-native-paper";

const ICON_SIZE = 23;

export default function IconInput(props: any) {
  return (
    <View style={styles.inputContainer}>
      {props.icon ? <Icon source={props.icon} size={ICON_SIZE} /> : null}
      <TextInput
        ref={props.innerRef}
        mode="outlined"
        style={styles.textInput}
        {...props}
      />
    </View>
  );
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
