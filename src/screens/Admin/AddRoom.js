import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';

const AddRoom = ({ navigation }) => {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState(null); // Initialize roomId as null
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const roomStatuses = [
    { label: "Bình thường", value: "Normal" },
    { label: "Hỏng", value: "Broken" },
    { label: "Bảo trì", value: "Maintenance" },
  ];

  const handleAddRoom = async () => {
    if (!roomId || !roomName || !status) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      // Reset error state
      setError("");

      // Convert roomId to number
      const roomIdNumber = parseInt(roomId, 10);

      // Add room to Firestore
      await firestore().collection('ROOMS').doc(`${roomIdNumber}`).set({
        id: roomIdNumber,
        name: roomName,
        status: status,
        icon: "laptop-outline", // Placeholder icon
      });

      // Clear input fields after submission
      setRoomId(null);
      setRoomName("");
      setStatus("");

      // Navigate back to main screen (Assuming "AdminTab" is your main screen)
      navigation.navigate("AdminTab");
    } catch (error) {
      console.error("Error adding room: ", error);
      setError("Lỗi khi thêm phòng, vui lòng thử lại sau");
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const selectStatus = (selectedStatus) => {
    setStatus(selectedStatus);
    toggleModal();
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Mã phòng"
        value={roomId ? roomId.toString() : ""}
        onChangeText={(numColumns) => setRoomId(numColumns)}
        style={styles.input}
        keyboardType="numeric" // Ensure numeric keyboard for input
      />
      <TextInput
        label="Tên phòng"
        value={roomName}
        onChangeText={(text) => setRoomName(text)}
        style={styles.input}
      />
      <TouchableOpacity onPress={toggleModal} style={styles.input}>
        <View pointerEvents="none">
          <TextInput
            label="Trạng thái"
            value={status}
            style={{ backgroundColor: "transparent" }}
          />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {roomStatuses.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalItem}
                onPress={() => selectStatus(item.value)}
              >
                <Text style={styles.modalText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>
      <Button mode="contained" onPress={handleAddRoom} style={styles.button}>
        Thêm phòng
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: "#FFF",
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: "#1FD2BD",
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
    borderRadius: 10,
    padding: 20,
    maxHeight: 300,
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default AddRoom;
