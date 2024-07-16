import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Button } from "react-native-paper";

const EmployeeDetail = ({ route }) => {
  const { name, employeeId, department, phoneNumber } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.borderInfo}>
        <View style={styles.iconContainer}>
          <Icon name="account-circle" size={200} color="#000" />
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Họ và tên:</Text>
            <Text style={styles.value}>{name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Mã nhân viên:</Text>
            <Text style={styles.value}>{employeeId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phòng ban:</Text>
            <Text style={styles.value}>{department}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Số điện thoại:</Text>
            <Text style={styles.value}>{phoneNumber}</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={{ ...styles.button, backgroundColor: "#1FD2BD" }}
          mode="contained"
          onPress={() => {
            // Handle edit button press
          }}
        >
          Chỉnh sửa
        </Button>
        <Button
          style={{ ...styles.button, backgroundColor: "red" }}
          mode="contained"
          onPress={() => {
            // Handle delete button press
          }}
        >
          Xóa
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  borderInfo: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
    padding: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 18,
    color: "#000",
  },
  value: {
    flex: 2,
    fontSize: 18,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    borderRadius: 5,
    width: "45%",
  },
});

export default EmployeeDetail;
