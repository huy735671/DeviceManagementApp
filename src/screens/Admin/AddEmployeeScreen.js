import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, TextInput } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import firestore from '@react-native-firebase/firestore';

const AddEmployeeScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('person'); // Default is 'person'
  const [id, setId] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [email, setEmail] = useState('');
  const [numPhone, setNumPhone] = useState('');
  const [role, setRole] = useState('User'); // Default is User
  const [password, setPassword] = useState('');
  const [datetime, setDatetime] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [iconModalVisible, setIconModalVisible] = useState(false);

  const availableIcons = [
    'person', 'person-outline'
    // Add more icons as needed
  ];

  useEffect(() => {
    // Fetch list of rooms from Firestore
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
        // Get the current count of documents in 'EMPLOYEES' collection
        const employeesRef = firestore().collection('EMPLOYEES');
        const snapshot = await employeesRef.get();
        const count = snapshot.size;

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
        });

        // Show success alert and navigate back
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
      <Icon name={item} size={30} color="#000" />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={{ alignItems: "center" }}>
        <Icon name={icon} size={150} color={"#000"} onPress={() => setIconModalVisible(true)} />
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

      {/* Modal select room */}
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

      {/* Modal select icon */}
      <Modal
        visible={iconModalVisible}
        animationType="slide"
        transparent
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Chọn icon</Text>
            <FlatList
              data={availableIcons}
              renderItem={renderIconItem}
              keyExtractor={(item) => item}
              numColumns={3}
              style={{ marginTop: 20 }}
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
    paddingLeft: 10,
  },
  txtAndInput: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  datePickerButton: {
    backgroundColor: "#FFF",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  roleButton: {
    backgroundColor: "#FFF",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    flexDirection: "row",
  },
  roleText: {
    color: "#000",
    fontSize: 18,
  },
  iconStyle: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#1FD2BD',
    borderRadius: 5,
    alignSelf: 'center',
  },
  modalCloseButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  roomItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  roomItemText: {
    fontSize: 18,
    color: '#000',
  },
  iconItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});

export default AddEmployeeScreen;
