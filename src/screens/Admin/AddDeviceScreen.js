import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, TextInput } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import firestore from '@react-native-firebase/firestore';
//import { launchImageLibrary } from 'react-native-image-picker';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const AddDeviceScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [deviceType, setDeviceType] = useState('');
  const [datetime, setDatetime] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [warrantyPeriod, setWarrantyPeriod] = useState('');
  const [remainingTime, setRemainingTime] = useState('');
  const [supplier, setSupplier] = useState('');
  const [brand, setBrand] = useState('');
  const [operationalStatus, setOperationalStatus] = useState('');
  const [deploymentDate, setDeploymentDate] = useState(new Date());
  const [deviceImage, setDeviceImage] = useState(null);
  const [loading, setLoading] = useState(false);


  const statusOptions = [
    { label: 'Hoạt động', value: 'active' },
    { label: 'Không hoạt động', value: 'inactive' },
    { label: 'Đang Bảo trì', value: 'maintenance' },
  ];

  const deviceTypes = [
    'Laptop', 'Máy chiếu', 'Máy tính bàn', 'Điện thoại', 'Camera', 'Bàn phím', 'Máy in', 'Wifi'
  ];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsCollection = await firestore().collection('ROOMS').get();
        setRooms(roomsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Lỗi khi tải phòng ban:', error);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    if (warrantyPeriod && datetime) {
      const warrantyEndDate = new Date(datetime);
      warrantyEndDate.setMonth(warrantyEndDate.getMonth() + parseInt(warrantyPeriod, 10));

      const currentDate = new Date();
      const timeDifference = warrantyEndDate.getTime() - currentDate.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

      setRemainingTime(daysDifference > 0 ? `Còn ${daysDifference} ngày bảo hành` : 'Hết hạn bảo hành');
    }
  }, [warrantyPeriod, datetime]);

  const handleSaveDevice = async () => {
    if (!selectedRoom || !name || !id || !deviceType || !warrantyPeriod || !operationalStatus) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);

    try {
      const warrantyEndDate = new Date(datetime);
      warrantyEndDate.setMonth(warrantyEndDate.getMonth() + parseInt(warrantyPeriod, 10));

      await firestore()
        .collection('DEVICES')
        .doc(id)
        .set({
          name,
          id,
          deviceType,
          datetime,
          warrantyEndDate,
          roomId: selectedRoom.id,
          roomName: selectedRoom.name,
          supplier,
          brand,
          operationalStatus,
          deploymentDate,
          image: deviceImage,
        });

      console.log('Thiết bị đã được lưu vào Firestore với phòng ban:', selectedRoom.name);

      // Add notification for admin
      await firestore().collection('NOTIFICATION_ADMIN').add({
        title: 'Thiết bị mới được thêm',
        message: `Thiết bị ${name} đã được thêm vào phòng ban ${selectedRoom.name}.`,
        timestamp: new Date(),
        adminNotification: true, // You can use this field to differentiate notifications for admins
      });

      navigation.navigate('AdminTab', { id, name, image: deviceImage, type: deviceType });
    } catch (error) {
      console.error('Lỗi khi lưu thiết bị:', error);
      Alert.alert('Lỗi', 'Lỗi khi lưu thiết bị');
    } finally {
      setLoading(false);
    }
  };

  // const pickImage = () => {
  //   const options = {
  //     mediaType: 'photo',
  //     quality: 1,
  //   };

  //   launchImageLibrary(options, (response) => {
  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.errorCode) {
  //       console.log('ImagePicker Error: ', response.errorMessage);
  //     } else {
  //       const uri = response.assets[0].uri;
  //       setDeviceImage(uri);
  //     }
  //   });

  // };


  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    const selectImage = () => {
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          const uri = response.assets[0].uri;
          setDeviceImage(uri);
        }
      });
    };

    const takePhoto = () => {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.errorCode) {
          console.log('Camera Error: ', response.errorMessage);
        } else {
          const uri = response.assets[0].uri;
          setDeviceImage(uri);
        }
      });
    };

    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Library',
          onPress: selectImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
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

  const getDefaultIcon = (type) => {
    switch (type) {
      case 'Laptop':
        return 'laptop';
      case 'Máy chiếu':
        return 'projector';
      case 'Máy tính bàn':
        return 'desktop-windows';
      case 'Điện thoại':
        return 'phone-android';
      case 'Camera':
        return 'camera';
      case 'Bàn phím':
        return 'keyboard';
      case 'Máy in':
        return 'print';
      case 'Wifi':
        return 'wifi';
      default:
        return 'device-hub';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* <View style={styles.iconContainer}>
          <TouchableOpacity onPress={pickImage}>
            {deviceImage ? (
              <Image source={{ uri: deviceImage }} style={styles.deviceImage} />
            ) : (
              <View style={styles.iconWrapper}>
                {!deviceType ? (
                  <Text style={styles.chooseImageText}>Chọn hình ảnh</Text>
                ) : (
                  <Icon name={getDefaultIcon(deviceType)} size={100} color="#000" />
                )}
              </View>
            )}
          </TouchableOpacity>
        </View> */}

        
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={pickImage}>
            {deviceImage ? (
              <Image source={{ uri: deviceImage }} style={styles.deviceImage} />
            ) : (
              <View style={styles.iconWrapper}>
                {!deviceType ? (
                  <Text style={styles.chooseImageText}>Chọn hình ảnh</Text>
                ) : (
                  <Icon name={getDefaultIcon(deviceType)} size={100} color="#000" />
                )}
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tên thiết bị:</Text>
          <TextInput
            placeholder={"Nhập tên thiết bị"}
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Số series:</Text>
          <TextInput
            placeholder={"Nhập số series"}
            value={id}
            onChangeText={setId}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phòng ban:</Text>
          <TouchableOpacity style={styles.roomInput} onPress={() => setModalVisible(true)}>
            <Text style={styles.roomText}>{selectedRoom ? selectedRoom.name : 'Chọn phòng ban'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Kiểu thiết bị:</Text>
          <FlatList
            data={deviceTypes}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.deviceTypeOption,
                  deviceType === item && styles.selectedDeviceType,
                ]}
                onPress={() => setDeviceType(item)}
              >
                <Text style={styles.deviceTypeText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Thời gian bảo hành (tháng):</Text>
          <TextInput
            placeholder={"Nhập thời gian bảo hành"}
            value={warrantyPeriod}
            onChangeText={setWarrantyPeriod}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tình trạng:</Text>
          <FlatList
            data={statusOptions}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.deviceTypeOption,
                  operationalStatus === item.value && styles.selectedDeviceType,
                ]}
                onPress={() => setOperationalStatus(item.value)}
              >
                <Text style={styles.deviceTypeText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.value}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nhà cung cấp:</Text>
          <TextInput
            placeholder={"Nhập nhà cung cấp"}
            value={supplier}
            onChangeText={setSupplier}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Thương hiệu:</Text>
          <TextInput
            placeholder={"Nhập thương hiệu"}
            value={brand}
            onChangeText={setBrand}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ngày triển khai:</Text>
          <TouchableOpacity style={styles.datePickerButton} onPress={() => setOpen(true)}>
            <Text style={{ fontSize: 16, color: "#000" }}>{deploymentDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        <Button
          mode="contained"
          style={styles.saveButton}
          onPress={handleSaveDevice}
          loading={loading}
        >
          Lưu
        </Button>
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={rooms}
              renderItem={renderRoomItem}
              keyExtractor={(item) => item.id}
            />
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModalText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <DatePicker
        modal
        open={open}
        date={deploymentDate}
        onConfirm={(date) => {
          setOpen(false);
          setDeploymentDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrapper: {
    alignItems: 'center',
  },
  deviceImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  chooseImageText: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  datePickerButton: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  saveButton: {
    marginTop: 20,
  },
  roomItem: {
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  roomItemText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  closeModalButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  closeModalText: {
    fontSize: 16,
    color: 'blue',
  },
  roomInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  roomText: {
    fontSize: 16,
  },
  deviceTypeOption: {
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedDeviceType: {
    backgroundColor: '#ddd',
  },
  deviceTypeText: {
    fontSize: 16,
  },
});

export default AddDeviceScreen;
