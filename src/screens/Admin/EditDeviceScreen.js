import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, TextInput } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import firestore from '@react-native-firebase/firestore';

const EditDeviceScreen = ({ route, navigation }) => {
  const { id } = route.params;
  
  const [name, setName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [deviceType, setDeviceType] = useState('');
  const [datetime, setDatetime] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [warrantyPeriod, setWarrantyPeriod] = useState('');
  const [remainingTime, setRemainingTime] = useState('');
  const [price, setPrice] = useState('');
  const [supplier, setSupplier] = useState('');
  const [brand, setBrand] = useState('');
  const [operationalStatus, setOperationalStatus] = useState('');
  const [deploymentDate, setDeploymentDate] = useState(new Date());
  const [selectedIcon, setSelectedIcon] = useState('');
  const [iconModalVisible, setIconModalVisible] = useState(false);
  const [icons, setIcons] = useState([
    'laptop',
    'phone-android',
    'tv',
    'tablet',
    'keyboard',
    'headset',
    // Add more icons as needed
  ]);

  const statusOptions = [
    { label: 'Hoạt động', value: 'active' },
    { label: 'Không hoạt động', value: 'inactive' },
    { label: 'Bảo trì', value: 'maintenance' },
  ];

  useEffect(() => {
    const fetchRooms = async () => {
      const roomsCollection = await firestore().collection('ROOMS').get();
      setRooms(roomsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const deviceDoc = await firestore().collection('DEVICES').doc(id).get();
        if (deviceDoc.exists) {
          const deviceData = deviceDoc.data();
          setName(deviceData.name);
          setDeviceType(deviceData.deviceType);
          setDatetime(new Date(deviceData.datetime.seconds * 1000));
          setWarrantyPeriod(deviceData.warrantyPeriod.toString());
          setPrice(deviceData.price.toString());
          setSupplier(deviceData.supplier);
          setBrand(deviceData.brand);
          setOperationalStatus(deviceData.operationalStatus);
          setDeploymentDate(new Date(deviceData.deploymentDate.seconds * 1000));
          setSelectedIcon(deviceData.icon);
          // Fetch selected room information
          const roomDoc = await firestore().collection('ROOMS').doc(deviceData.roomId).get();
          if (roomDoc.exists) {
            setSelectedRoom({ id: roomDoc.id, ...roomDoc.data() });
          }
        } else {
          console.error('Thiết bị không tồn tại trong Firestore');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thiết bị:', error);
      }
    };

    fetchDevice();
  }, [id]);

  useEffect(() => {
    if (warrantyPeriod) {
      const currentDate = new Date();
      const warrantyEndDate = new Date(datetime);
      warrantyEndDate.setMonth(warrantyEndDate.getMonth() + parseInt(warrantyPeriod, 10));

      const timeDifference = warrantyEndDate.getTime() - currentDate.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

      if (daysDifference > 0) {
        setRemainingTime(`Còn ${daysDifference} ngày bảo hành`);
      } else {
        setRemainingTime('Hết hạn bảo hành');
      }
    }
  }, [warrantyPeriod, datetime]);

  const handleSaveDevice = async () => {
    if (selectedRoom && name && deviceType && price && warrantyPeriod && operationalStatus) {
      const warrantyEndDate = new Date(datetime);
      warrantyEndDate.setMonth(warrantyEndDate.getMonth() + parseInt(warrantyPeriod, 10));

      try {
        await firestore()
          .collection('DEVICES')
          .doc(id)
          .update({
            name,
            deviceType,
            price: parseInt(price.replace(/\./g, ''), 10),
            datetime,
            warrantyEndDate,
            roomId: selectedRoom.id,
            supplier,
            brand,
            operationalStatus,
            deploymentDate,
            icon: selectedIcon,
          });

        console.log('Thông tin thiết bị đã được cập nhật thành công trong Firestore');
        navigation.goBack(); // or navigate to another screen after update
      } catch (error) {
        console.error('Lỗi khi cập nhật thiết bị:', error);
      }
    } else {
      console.log('Vui lòng điền đầy đủ thông tin');
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
        setSelectedIcon(item);
        setIconModalVisible(false);
      }}
    >
      <Icon name={item} size={30} color="#000" />
    </TouchableOpacity>
  );

  const formatPrice = (price) => {
    let formattedPrice = String(price).replace(/\./g, '');
    formattedPrice = formattedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return formattedPrice;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => setIconModalVisible(true)}>
            {selectedIcon ? (
              <Icon name={selectedIcon} size={100} color={"#000"} />
            ) : (
              <Icon name={"account-circle"} size={100} color={"#000"} />
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
            editable={false} // Disable editing ID for edit screen
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
          <TextInput
            placeholder={'Nhập kiểu thiết bị'}
            value={deviceType}
            onChangeText={setDeviceType}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Giá:</Text>
          <TextInput
            placeholder={"Nhập giá"}
            value={formatPrice(price)}
            onChangeText={(text) => {
              const formattedText = text.replace(/\D/g, '');
              setPrice(formattedText);
            }}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ngày mua:</Text>
          <TouchableOpacity style={styles.datePickerButton} onPress={() => setOpen(true)}>
            <Text style={{ fontSize: 16, color: "#000" }}>{datetime.toLocaleDateString()}</Text>
          </TouchableOpacity>
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
          {remainingTime ? <Text style={styles.remainingTime}>{remainingTime}</Text> : null}
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
          <Text style={styles.label}>Tình trạng hoạt động:</Text>
          <FlatList
            data={statusOptions}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  { backgroundColor: operationalStatus === item.value ? '#4CAF50' : '#DDD' },
                ]}
                onPress={() => setOperationalStatus(item.value)}
              >
                <Text style={styles.statusText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.value}
            horizontal={true}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ngày triển khai:</Text>
          <TouchableOpacity style={styles.datePickerButton} onPress={() => setOpen(true)}>
            <Text style={{ fontSize: 16, color: "#000" }}>{deploymentDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={handleSaveDevice} style={styles.button}>
            Lưu thay đổi
          </Button>
        </View>
      </View>

      {/* Room Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={rooms}
              renderItem={renderRoomItem}
              keyExtractor={(item) => item.id}
              style={styles.roomList}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Icon Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={iconModalVisible}
        onRequestClose={() => {
          setIconModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={icons}
              renderItem={renderIconItem}
              keyExtractor={(item) => item}
              numColumns={3}
              style={styles.iconList}
            />
            <TouchableOpacity
              onPress={() => setIconModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <DatePicker
              date={datetime}
              onDateChange={setDatetime}
              mode="date"
              minimumDate={new Date('2000-01-01')}
              maximumDate={new Date('2100-12-31')}
              locale="vi"
              textColor="#000"
            />
            <TouchableOpacity
              onPress={() => setOpen(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Đóng</Text>
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
    backgroundColor: '#FFF',
    padding: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
  roomInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
  roomText: {
    fontSize: 16,
    color: '#000',
  },
  datePickerButton: {
    height: 40,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remainingTime: {
    fontSize: 14,
    marginTop: 5,
    color: '#FF0000',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    padding: 5,
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
    maxHeight: '80%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#007BFF',
  },
  roomList: {
    width: '100%',
  },
  roomItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  roomItemText: {
    fontSize: 16,
    color: '#000',
  },
  iconList: {
    width: '100%',
    paddingHorizontal: 10,
  },
  iconItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  statusOption: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 16,
    color: '#FFF',
  },
});

export default EditDeviceScreen;
