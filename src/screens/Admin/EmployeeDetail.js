import React from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Button } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";

const EmployeeDetail = ({ route, navigation }) => {
  const { employee } = route.params;

  if (!employee) {
    Alert.alert('Error', 'Employee data is missing.');
    return null;
  }

  const { id, name, numPhone, roomId, email,  datetime } = employee;

  const handleDelete = async () => {
    try {
      await firestore().collection('USERS').doc(id).delete();
      console.log('Employee has been deleted from Firestore');

      navigation.navigate('AdminTab'); // Navigate back to admin screen after deletion
      Alert.alert('Success', 'Employee deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);
      Alert.alert('Error', 'An error occurred while deleting the employee.');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.borderInfo}>
          <View style={styles.iconContainer}>
            <Icon name="account-circle" size={200} color="#000" />
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}> {name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Employee ID:</Text>
              <Text style={styles.value}> {id}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Phone Number:</Text>
              <Text style={styles.value}> {numPhone}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}> {email}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Room:</Text>
              <Text style={styles.value}>Phòng {roomId}</Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>Date Time:</Text>
              <Text style={styles.value}> {new Date(datetime.toDate()).toLocaleString()}</Text>
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
            Edit
          </Button>
          <Button
            style={{ ...styles.button, backgroundColor: "red" }}
            mode="contained"
            onPress={handleDelete} // Call handleDelete function on press
          >
            Delete
          </Button>
        </View>
      </View>
    </ScrollView>
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
    width:400,
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
