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
    if (selectedRoom && name && id && deviceType && price && warrantyPeriod && operationalStatus && selectedIcon) {
      const warrantyEndDate = new Date(datetime);
      warrantyEndDate.setMonth(warrantyEndDate.getMonth() + parseInt(warrantyPeriod, 10));

      try {
        const deviceRef = await firestore()
          .collection('DEVICES')
          .add({
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
            deploymentDate,
            icon: selectedIcon,
          });

        const newDevice = {
          id: deviceRef.id,
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
          <Text style={styles.label}>Trạng thái hoạt động:</Text>
          <View style={styles.dropdownContainer}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusOption,
                  operationalStatus === option.value && styles.selectedStatusOption,
                ]}
                onPress={() => setOperationalStatus(option.value)}
              >
                <Text style={[
                  styles.statusOptionText,
                  operationalStatus === option.value && styles.selectedStatusOptionText,
                ]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ngày triển khai:</Text>
          <TouchableOpacity style={styles.datePickerButton} onPress={() => setOpen(true)}>
            <Text style={{ fontSize: 16, color: "#000" }}>{deploymentDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Chọn phòng ban</Text>
              <FlatList
                data={rooms}
                renderItem={renderRoomItem}
                keyExtractor={item => item.id}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={iconModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIconModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Chọn biểu tượng</Text>
              <FlatList
                data={icons}
                renderItem={renderIconItem}
                numColumns={4}
                keyExtractor={(item, index) => index.toString()}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setIconModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Button mode="contained" onPress={handleSaveDevice} style={styles.saveButton}>
          Lưu thiết bị
        </Button>

      </View>

      <DatePicker
        modal
        open={open}
        date={datetime}
        mode="datetime"
        onConfirm={(date) => {
          setDatetime(date);
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
  },
  roomInput: {
    height: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  roomText: {
    fontSize: 16,
    color: '#000',
  },
  datePickerButton: {
    height: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  remainingTime: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
  dropdownContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  statusOption: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedStatusOption: {
    backgroundColor: '#007bff',
  },
  statusOptionText: {
    color: '#000',
  },
  selectedStatusOptionText: {
    color: '#fff',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  modalCloseButton: {
    marginTop: 10,
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#007bff',
  },
  saveButton: {
    marginTop: 20,
  },
  roomItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  roomItemText: {
    fontSize: 16,
  },
  iconItem: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default AddDeviceScreen;
