import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Button, TextInput } from "react-native-paper";
import DatePicker from "react-native-date-picker";
import firestore from "@react-native-firebase/firestore";
import { Auth } from "../../services";

const AddEmployeeScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("person"); // Default is 'person'
  const [id, setId] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [email, setEmail] = useState("");
  const [numPhone, setNumPhone] = useState("");
  const [role, setRole] = useState("User"); // Default is User
  const [password, setPassword] = useState("");
  const [datetime, setDatetime] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [iconModalVisible, setIconModalVisible] = useState(false);
  const [active, setActive] = useState(true);

  const availableIcons = [
    "person",
    "person-outline",
    // Add more icons as needed
  ];

  useEffect(() => {
    // Fetch list of rooms from Firestore
    const fetchRooms = async () => {
      try {
        const roomsCollection = await firestore().collection("ROOMS").get();
        const roomsData = roomsCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  const handleSaveEmployee = async () => {
    if (selectedRoom) {
      try {
        await Auth.signUp(
          name,
          numPhone,
          email,
          password,
          "User",
          selectedRoom.id
        );
        // Get the current count of documents in 'EMPLOYEES' collection
        const employeesRef = firestore().collection("EMPLOYEES");
        const snapshot = await employeesRef.get();
        const count = snapshot.size;
        const newDocId = String(count + 1);

        // Add the employee with a numeric ID
        await employeesRef.doc(String(count + 1)).set({
          icon,
          name,
          id,
          email,
          numPhone,
          role,
          datetime,
          password,
          roomId: selectedRoom.id,
          active,
          docId: newDocId,
        });

        // Add a notification for the admin
        await firestore()
          .collection("NOTIFICATION_ADMIN")
          .add({
            title: "New Employee Added",
            message: `Nhân viên ${name} đã được thêm vào phòng ban ${selectedRoom.name}`,
            timestamp: firestore.FieldValue.serverTimestamp(),
          });
        // await firestore().collection("USERS").doc(userId).set({
        //   username: name,
        //   phone: numPhone,
        //   email,
        //   password,
        //   role,
        // });

        // Show success alert and navigate back
        Alert.alert("Thành công", "Nhân viên đã được lưu thành công!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } catch (error) {
        console.error("Lỗi khi lưu nhân viên:", error);
        Alert.alert(
          "Lỗi",
          "Đã xảy ra lỗi khi lưu nhân viên. Vui lòng thử lại sau."
        );
      }
    } else {
      Alert.alert("Lỗi", "Vui lòng chọn phòng ban trước khi lưu.");
    }
  };

  const renderRoomItem = ({ item }) => (
    <TouchableOpacity
      style={styles.roomItem}
      onPress={() => {
        setSelectedRoom(item);
        setModalVisible(false);
      }}
    >
      <Text style={styles.roomItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderIconItem = ({ item }) => (
    <TouchableOpacity
      style={styles.iconItem}
      onPress={() => {
        setIcon(item);
        setIconModalVisible(false);
      }}
    >
      <Icon name={item} size={40} color="#000" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon
          name={icon}
          size={150}
          color={"#000"}
          onPress={() => setIconModalVisible(true)}
        />
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tên nhân viên: </Text>
          <TextInput
            placeholder={"Tên nhân viên"}
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mã nhân viên: </Text>
          <TextInput
            placeholder={"Mã nhân viên"}
            value={id}
            onChangeText={setId}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phòng ban: </Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.roomText}>
              {selectedRoom ? selectedRoom.name : "Chọn phòng ban"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email: </Text>
          <TextInput
            placeholder={"Email"}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Số điện thoại: </Text>
          <TextInput
            placeholder={"Số điện thoại"}
            value={numPhone}
            onChangeText={setNumPhone}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ngày sinh: </Text>
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={styles.datePickerButton}
          >
            <Text style={styles.dateText}>{datetime.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <DatePicker
            modal
            mode="date"
            open={open}
            date={datetime}
            onConfirm={(date) => {
              setOpen(false);
              setDatetime(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Vai trò: </Text>
          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => setRole(role === "User" ? "Admin" : "User")}
          >
            <Text style={styles.roleText}>{role}</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.inputContainer}>
          <Text style={styles.label}>Hoạt động: </Text>
          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => setActive(true)}
          >
            <Text style={styles.roleText}>{active}</Text>
          </TouchableOpacity>
        </View> */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mật khẩu: </Text>
          <TextInput
            secureTextEntry={!showPass}
            placeholder={"Mật khẩu"}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => setShowPass(!showPass)}
            style={styles.iconStyle}
          >
            <Icon
              name={showPass ? "visibility" : "visibility-off"}
              size={24}
              color={"#000"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button style={styles.saveButton} onPress={handleSaveEmployee}>
          <Text style={styles.saveButtonText}>Lưu thông tin</Text>
        </Button>
      </View>

      {/* Modal select room */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Chọn phòng ban</Text>
            <FlatList
              data={rooms}
              renderItem={renderRoomItem}
              keyExtractor={(item) => item.id}
              style={styles.flatList}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal select icon */}
      <Modal visible={iconModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Chọn icon</Text>
            <FlatList
              data={availableIcons}
              renderItem={renderIconItem}
              keyExtractor={(item) => item}
              numColumns={3}
              style={styles.flatList}
            />
            <TouchableOpacity
              onPress={() => setIconModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
    padding: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  formContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    color: "#333",
    fontSize: 16,
    flex: 1,
  },
  input: {
    flex: 2,
    backgroundColor: "#FAFAFA",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  datePickerButton: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  roleButton: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  roleText: {
    fontSize: 16,
    color: "#333",
  },
  iconStyle: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  saveButton: {
    backgroundColor: "#1FD2BD",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 3,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    width: "80%",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#1FD2BD",
    borderRadius: 5,
    alignSelf: "center",
  },
  modalCloseButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  flatList: {
    marginTop: 10,
  },
  roomItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  roomItemText: {
    fontSize: 16,
    color: "#000",
  },
  iconItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
});

export default AddEmployeeScreen;
