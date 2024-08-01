import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Button } from "react-native-paper";

const AddScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
      <Button
          mode="contained"
          style={styles.btn}
          onPress={() => navigation.navigate("AddRoom")}
        >
          <Text style={styles.btnText}>Thêm phòng ban</Text>
        </Button>
        <Button
          mode="contained"
          style={styles.btn}
          onPress={() => navigation.navigate("AddEmployee")}
        >
          <Text style={styles.btnText}>Thêm nhân viên</Text>
        </Button>
        <Button
          mode="contained"
          style={styles.btn}
          onPress={() => navigation.navigate("AddDevice")}
        >
          <Text style={styles.btnText}>Thêm thiết bị</Text>
        </Button>
      </View>
    </View>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    alignItems: "center",
    padding: 30,
  },
  btn: {
    backgroundColor: "#1FD2BD",
    borderRadius: 25,
    width: 200,
    marginBottom: 20,
    elevation: 3, // Adds shadow on Android
    shadowColor: "#000", // Adds shadow on iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  btnText: {
    color: "#FFF",
    fontSize: 18,
  },
});
