import React, { useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Button } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";

const EmployeeDetail = ({ route, navigation }) => {
  const {
    name,
    employeeId,
    department,
    phoneNumber,
    employeesPassword,
    employeesEmail,
    employeesRole,
    employeesDatetime,
    docId,
  } = route.params;

  const [employee, setEmployee] = React.useState(null);
  console.log({ employeeId });

  // delete employee button handler
  const handleDelete = () => {
    Alert.alert("Xóa nhân viên", "Bạn có chắc chắn muốn xóa nhân viên này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await firestore()
              .collection("EMPLOYEES")
              .doc(docId) // Sử dụng employeeId từ props hoặc state
              .update({ active: false });
            console.log("Employee has been deleted from Firestore");

            navigation.navigate("AdminTab");
            Alert.alert("Success", "Employee updated successfully");
          } catch (error) {
            console.error("Error updating employee:", error);
            Alert.alert(
              "Error",
              "An error occurred while updating the employee."
            );
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.borderInfo}>
        <View style={styles.iconContainer}>
          <Icon name="account-circle" size={200} color="#000" />
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Tên nhân viên:</Text>
            <Text style={styles.value}> {name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Mã nhân viên:</Text>
            <Text style={styles.value}> {employeeId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Số điện thoại:</Text>
            <Text style={styles.value}> {phoneNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phòng ban:</Text>
            <Text style={styles.value}> Phòng {department}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{employeesEmail}</Text>
          </View>
          {/* Add other fields as needed */}
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
          Edit
        </Button>
        <Button
          style={{ ...styles.button, backgroundColor: "red" }}
          mode="contained"
          onPress={() => handleDelete()}
        >
          Delete
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
    width: 400,
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
