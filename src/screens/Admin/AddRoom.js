import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';

const AddRoom = ({ navigation }) => {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState(null); // Initialize roomId as null
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const roomStatuses = [
    { label: "Hoạt động", value: "Active" },
    { label: "Đóng", value: "Close" },
    { label: "Đang Bảo trì", value: "Maintenance" },
  ];

  useEffect(() => {
    const getNextRoomId = async () => {
      try {
        const roomsSnapshot = await firestore().collection('ROOMS').orderBy('id', 'desc').limit(1).get();
        if (!roomsSnapshot.empty) {
          const lastRoom = roomsSnapshot.docs[0].data();
          setRoomId(lastRoom.id + 1);
        } else {
          setRoomId(1); // Default to 1 if no rooms exist
        }
      } catch (error) {
        console.error("Error getting next room ID: ", error);
        setError("Lỗi khi lấy mã phòng, vui lòng thử lại sau");
      }
    };

    getNextRoomId();
  }, []);

  const handleAddRoom = async () => {
    if (!roomName || !status) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      // Reset error state
      setError("");

      // Add room to Firestore
      await firestore().collection('ROOMS').doc(`${roomId}`).set({
        id: roomId,
        name: roomName,
        status: status,
        icon: "apartment", // Placeholder icon
      });

      // Create notification document
      await firestore().collection('NOTIFICATION_ADMIN').add({
        message: `${roomName} đã được thêm thành công.`,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });

      // Clear input fields after submission
      setRoomId(null); // Will be automatically set on re-render
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

  const renderStatusItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => selectStatus(item.value)}
    >
      <Text style={styles.modalText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Phòng</Text>
      <TextInput
        label="Tên phòng"
        value={roomName}
        onChangeText={(text) => setRoomName(text)}
        style={styles.input}
        mode="outlined"
      />
      <TouchableOpacity onPress={toggleModal} style={styles.input}>
        <TextInput
          label="Trạng thái"
          value={status}
          style={[styles.input, { backgroundColor: "transparent" }]}
          editable={false}
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={roomStatuses}
              renderItem={renderStatusItem}
              keyExtractor={(item) => item.value}
            />
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
    color:"black",
    fontSize: 16,
    textAlign: "center",
  },
});

export default AddRoom;
