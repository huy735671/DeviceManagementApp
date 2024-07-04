import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Button } from "react-native-paper";

const AddScreen = ({ navigation }) => {
  return (
    <View
      style={{
        flex: 1,

        backgroundColor: "#FFF",
      }}
    >
      <View style={{ alignItems: "center", padding: 30 }}>
        <Button
          style={{ backgroundColor: "#1FD2BD", ...styles.btn }}
          onPress={() => navigation.navigate("AddEmployee")}
        >
          <Text style={styles.txt}>Thêm nhân viên</Text>
        </Button>
        <Button
          style={{ backgroundColor: "#1FD2BD", ...styles.btn }}
          onPress={() => navigation.navigate("AddDevice")}
        >
          <Text style={styles.txt}>Thêm thiết bị</Text>
        </Button>
      </View>
    </View>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  boder4Info: {
    borderRadius: 30,
    borderWidth: 1,
    marginHorizontal: 10,
    margin: 10,
  },

  txt: {
    color: "#000",
    fontSize: 18,
  },

  btn: {
    borderRadius: 5,
    width: 200,
    marginBottom: 10,
  },

  txtInput: {
    marginBottom: 15,
    backgroundColor: null,
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 40,
    width: "65%",
    borderWidth: 1,
  },
});