import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, TextInput } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import firestore from '@react-native-firebase/firestore';

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
    if (
      selectedRoom &&
      name &&
      id &&
      deviceType &&
      price &&
      warrantyPeriod &&
      operationalStatus &&
      selectedIcon
    ) {
      const warrantyEndDate = new Date(datetime);
      warrantyEndDate.setMonth(warrantyEndDate.getMonth() + parseInt(warrantyPeriod, 10));

      try {
        // Fetch the count of existing documents to determine the new ID
        const devicesRef = await firestore().collection('DEVICES').get();
        const newId = devicesRef.size + 1; // Calculate the new ID

        // Add the device with the custom ID
        const deviceRef = await firestore()
          .collection('DEVICES')
          .doc(newId.toString()) // Convert the ID to string before setting as document ID
          .set({
            name,
            id,
            deviceType,
            price: parseInt(price.replace(/\./g, ''), 10),
            datetime,
            warrantyEndDate,
            roomId: selectedRoom.id,
            supplier,
            brand,
            operationalStatus,
            deploymentDate: deploymentDate.toISOString(), // Save deploymentDate as ISO string
            icon: selectedIcon,
          });

        const newDevice = {
          id: newId.toString(), // Convert ID back to string for consistency
          name,
          icon: selectedIcon,
          status: operationalStatus,
          type: deviceType,
          assetType: 'Device', // Add assetType if necessary
          brand,
          model: '', // Add model if necessary
          supplier,
          price: parseInt(price.replace(/\./g, ''), 10),
          purchaseDate: datetime.toLocaleDateString(),
          warrantyPeriod,
          operationalStatus,
          deploymentDate: deploymentDate.toLocaleDateString(),
        };

        console.log('Thiết bị đã được lưu vào Firestore với phòng ban:', selectedRoom.name);
        navigation.navigate('AdminTab', newDevice); // Điều hướng tới màn hình chi tiết thiết bị
      } catch (error) {
        console.error('Lỗi khi lưu thiết bị:', error);
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
                  operationalStatus === item.value && styles.selectedStatus,
                ]}
                onPress={() => setOperationalStatus(item.value)}
              >
                <Text style={styles.statusOptionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.value}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ngày triển khai:</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setOpen(true)}
          >
            <Text style={{ fontSize: 16, color: "#000" }}>
              {deploymentDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>

        <Button mode="contained" onPress={handleSaveDevice} style={styles.saveButton}>
          Lưu thiết bị
        </Button>

        {/* Modal for selecting room */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Chọn phòng ban</Text>
              <FlatList
                data={rooms}
                renderItem={renderRoomItem}
                keyExtractor={(item) => item.id}
                style={styles.roomList}
              />
              <Button onPress={() => setModalVisible(false)}>Đóng</Button>
            </View>
          </View>
        </Modal>

        {/* Modal for selecting icon */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={iconModalVisible}
          onRequestClose={() => setIconModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Chọn biểu tượng</Text>
              <FlatList
                data={icons}
                renderItem={renderIconItem}
                keyExtractor={(item) => item}
                numColumns={4}
                style={styles.iconList}
              />
              <Button onPress={() => setIconModalVisible(false)}>Đóng</Button>
            </View>
          </View>
        </Modal>

        {/* Date picker */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={open}
          onRequestClose={() => setOpen(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.datePickerModal}>
              <DatePicker
                date={datetime}
                onDateChange={setDatetime}
                mode="date"
                textColor="#000"
              />
              <Button onPress={() => setOpen(false)}>Đóng</Button>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10,
  },
  roomInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  roomText: {
    fontSize: 16,
    color: '#000',
  },
  roomItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  roomItemText: {
    fontSize: 16,
    color: '#000',
  },
  datePickerButton: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roomList: {
    maxHeight: 300,
    marginBottom: 10,
  },
  datePickerModal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  statusOption: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
  },
  selectedStatus: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  statusOptionText: {
    fontSize: 16,
    color: '#000',
  },
  remainingTime: {
    marginTop: 5,
    fontSize: 12,
    color: 'green',
  },
  iconList: {
    marginTop: 10,
    marginBottom: 10,
  },
  iconItem: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default AddDeviceScreen;
