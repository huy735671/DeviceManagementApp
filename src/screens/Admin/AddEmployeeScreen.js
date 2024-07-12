import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, TextInput } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import firestore from '@react-native-firebase/firestore';

const AddEmployeeScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [email, setEmail] = useState('');
  const [numPhone, setNumPhone] = useState('');
  const [role, setRole] = useState('User'); // Mặc định là User
  const [password, setPassword] = useState('');
  const [datetime, setDatetime] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Lấy danh sách các phòng ban từ Firestore
    const fetchRooms = async () => {
      try {
        const roomsCollection = await firestore().collection('ROOMS').get();
        const roomsData = roomsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRooms(roomsData);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleSaveEmployee = async () => {
    if (selectedRoom) {
      try {
        // Lưu nhân viên vào bộ sưu tập 'EMPLOYEES' của phòng ban được chọn
        await firestore()
          .collection('EMPLOYEES')
          .add({
            name,
            id,
            email,
            numPhone,
            role,
            datetime,
            password,
            roomId: selectedRoom.id,
          });

        // Hiển thị thông báo lưu thành công và quay lại màn hình trước đó
        Alert.alert('Thành công', 'Nhân viên đã được lưu thành công!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);

      } catch (error) {
        console.error('Lỗi khi lưu nhân viên:', error);
        Alert.alert('Lỗi', 'Đã xảy ra lỗi khi lưu nhân viên. Vui lòng thử lại sau.');
      }
    } else {
      Alert.alert('Lỗi', 'Vui lòng chọn phòng ban trước khi lưu.');
    }
  };

  const renderRoomItem = ({ item }) => (
    <TouchableOpacity
      style={styles.roomItem}
      onPress={() => {
        setSelectedRoom(item);
        setModalVisible(false); // Đóng modal sau khi chọn phòng ban
      }}
    >
      <Text style={styles.roomItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={{ alignItems: "center" }}>
        <Icon name={"account-circle"} size={150} color={"#000"} />
      </View>
      <View style={{ margin: 20 }}>
        <View style={styles.txtAndInput}>
          <Text style={styles.txt}>Tên nhân viên: </Text>
          <TextInput
            placeholder={"Tên nhân viên"}
            value={name}
            onChangeText={setName}
            style={styles.txtInput}
          />
        </View>
        <View style={styles.txtAndInput}>
          <Text style={styles.txt}>Mã nhân viên: </Text>
          <TextInput
            placeholder={"Mã nhân viên"}
            value={id}
            onChangeText={setId}
            style={styles.txtInput}
          />
        </View>
        <View style={styles.txtAndInput}>
          <Text style={styles.txt}>Phòng ban: </Text>
          <TouchableOpacity
            style={styles.txtInput}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.roomText}>
              {selectedRoom ? selectedRoom.name : 'Chọn phòng ban'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.txtAndInput}>
          <Text style={styles.txt}>Email: </Text>
          <TextInput
            placeholder={"Email"}
            value={email}
            onChangeText={setEmail}
            style={styles.txtInput}
          />
        </View>
        <View style={styles.txtAndInput}>
          <Text style={styles.txt}>Số điện thoại: </Text>
          <TextInput
            placeholder={"Số điện thoại"}
            value={numPhone}
            onChangeText={setNumPhone}
            keyboardType="numeric"
            style={styles.txtInput}
          />
        </View>
        <View style={styles.txtAndInput}>
          <Text style={styles.txt}>Ngày sinh: </Text>
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={styles.datePickerButton}
          >
            <Text style={{ fontSize: 18, color: "#000" }}>
              {datetime.toLocaleDateString()}
            </Text>
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
        <View style={styles.txtAndInput}>
          <Text style={styles.txt}>Vai trò: </Text>
          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => setRole(role === 'User' ? 'Admin' : 'User')}
          >
            <Text style={styles.roleText}>{role}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.txtAndInput}>
          <Text style={styles.txt}>Mật khẩu: </Text>
          <TextInput
            secureTextEntry={!showPass}
            placeholder={"Mật khẩu"}
            value={password}
            onChangeText={setPassword}
            style={styles.txtInput}
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
      <View style={{ alignItems: "center" }}>
        <Button
          style={{ backgroundColor: "#1FD2BD", ...styles.btn }}
          onPress={handleSaveEmployee}
        >
          <Text style={styles.txt}>Lưu thông tin</Text>
        </Button>
      </View>

      {/* Modal chọn phòng ban */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Chọn phòng ban</Text>
            <FlatList
              data={rooms}
              renderItem={renderRoomItem}
              keyExtractor={(item) => item.id}
              style={{ marginTop: 20 }}
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
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: null,
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 40,
    flex: 1,
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  txtAndInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  datePickerButton: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 5,
  },
  iconStyle: {
    position: "absolute",
    right: 15,
    top: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  roomItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  roomItemText: {
    fontSize: 16,
    color: "#000",
  },
  modalCloseButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: "#1FD2BD",
  },
  roleItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  roleItemText: {
    fontSize: 16,
    color: "#000",
  },
});

export default AddEmployeeScreen;
