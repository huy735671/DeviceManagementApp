import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, FlatList, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, TextInput } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const EmployeeDetailScreen = ({ route, navigation }) => {
  const { employee } = route.params; // Get employee data from route params
  const [username, setUsername] = useState(employee.username);
  const [icon, setIcon] = useState(employee.icon);
  const [id, setId] = useState(employee.id);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [email, setEmail] = useState(employee.email);
  const [numPhone, setNumPhone] = useState(employee.numPhone);
  const [role, setRole] = useState(employee.role);
  const [datetime, setDatetime] = useState(employee.datetime.toDate());
  const [open, setOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [iconModalVisible, setIconModalVisible] = useState(false);
  const [employeeImage, setEmployeeImage] = useState(employee.avatarUrl);
  const [employeeType, setEmployeeType] = useState(null);

  const availableIcons = ['person', 'person-outline'];

  useEffect(() => {
    // Fetch list of rooms from Firestore
    const fetchRooms = async () => {
      try {
        const roomsCollection = await firestore().collection('ROOMS').get();
        const roomsData = roomsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRooms(roomsData);

        // Set the selected room based on employee's roomId
        const room = roomsData.find(r => r.id === employee.roomId);
        setSelectedRoom(room);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, [employee.roomId]);

  const handleSaveEmployee = async () => {
    try {
      await firestore().collection('USERS').doc(email).update({
        icon,
        username,
        id,
        email,
        numPhone,
        role, // Đảm bảo giá trị role được cập nhật đúng
        datetime,
        avatarUrl: employeeImage,
      });
  
      Alert.alert('Thành công', 'Thông tin nhân viên đã được cập nhật!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin nhân viên:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật thông tin nhân viên. Vui lòng thử lại sau.');
    }
  };
  

  const pickEmployeeImage = () => {
    const options = { mediaType: 'photo', quality: 1 };

    const selectImage = () => {
      launchImageLibrary(options, (response) => {
        if (!response.didCancel && !response.errorCode) {
          const uri = response.assets[0].uri;
          setEmployeeImage(uri);
        }
      });
    };

    const takePhoto = () => {
      launchCamera(options, (response) => {
        if (!response.didCancel && !response.errorCode) {
          const uri = response.assets[0].uri;
          setEmployeeImage(uri);
        }
      });
    };

    Alert.alert(
      'Chọn hình ảnh',
      'Chọn tùy chọn',
      [
        { text: 'Chụp ảnh', onPress: takePhoto },
        { text: 'Chọn từ thư viện', onPress: selectImage },
        { text: 'Hủy', style: 'cancel' },
      ],
      { cancelable: true }
    );
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
        <TouchableOpacity onPress={pickEmployeeImage}>
          <View style={styles.avatarWrapper}>
            {employeeImage ? (
              <Image source={{ uri: employeeImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.iconWrapper}>
                <Icon name={icon} size={100} color="#000" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tên nhân viên:</Text>
          <TextInput
            placeholder={"Tên nhân viên"}
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mã nhân viên:</Text>
          <TextInput
            placeholder={"Mã nhân viên"}
            value={id}
            onChangeText={setId}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phòng ban:</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.roomText}>
              {selectedRoom ? selectedRoom.name : 'Chọn phòng ban'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            placeholder={"Email"}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Số điện thoại:</Text>
          <TextInput
            placeholder={"Số điện thoại"}
            value={numPhone}
            onChangeText={setNumPhone}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ngày sinh:</Text>
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={styles.datePickerButton}
          >
            <Text style={styles.dateText}>
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
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Vai trò:</Text>
          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => setRole(role === 'user' ? 'admin' : 'user')}
          >
            <Text style={styles.roleText}>{role}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mật khẩu:</Text>
          <TextInput
            secureTextEntry={!showPass}
            placeholder={"Mật khẩu"}
            value={employee.password}
            onChangeText={() => {}}
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
        <Button
          style={styles.saveButton}
          onPress={handleSaveEmployee}
        >
          <Text style={styles.saveButtonText}>Lưu thông tin</Text>
        </Button>
      </View>

      {/* Modal for selecting room */}
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
      <Modal
        visible={iconModalVisible}
        animationType="slide"
        transparent
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Chọn biểu tượng</Text>
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
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 5,
    borderWidth:1,
    backgroundColor:'#ffffff',
    borderRadius:8,
    borderColor: '#ddd',
    paddingVertical:5,
    
  },
  avatarWrapper: {
    width: 350,
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  iconWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  datePickerButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
  },
  roleButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  roleText: {
    fontSize: 16,
  },
  iconStyle: {
    position: 'absolute',
    right: 12,
    top: 50,
  },
  buttonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  flatList: {
    width: '100%',
  },
  roomItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  roomItemText: {
    fontSize: 16,
  },
  iconItem: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
  },
  modalCloseButton: {
    marginTop: 12,
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  roomText: {
    fontSize: 16,
    color: '#333',
  },
});

export default EmployeeDetailScreen;
