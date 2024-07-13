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
    if (selectedRoom && name && id && deviceType && price && warrantyPeriod && operationalStatus) {
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
                <Text style={styles.statusOptionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ngày đưa vào sử dụng:</Text>
          <TouchableOpacity style={styles.datePickerButton} onPress={() => setOpen(true)}>
            <Text style={{ fontSize: 16, color: "#000" }}>{deploymentDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        <Button
          mode="contained"
          onPress={handleSaveDevice}
          style={[styles.button, { backgroundColor: "#1FD2BD" }]}
        >
          Lưu thiết bị
        </Button>
      </View>

      <DatePicker
        modal
        open={open}
        date={datetime}
        mode={"date"}
        title={"Chọn ngày mua"}
        confirmText={"Xác nhận"}
        cancelText={"Hủy"}
        onConfirm={(date) => {
          setOpen(false);
          setDatetime(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Chọn phòng ban</Text>
          <FlatList
            data={rooms}
            renderItem={renderRoomItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </Modal>

      <Modal
        visible={iconModalVisible}
        animationType="slide"
        onRequestClose={() => setIconModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Chọn biểu tượng</Text>
          <FlatList
            data={icons}
            renderItem={renderIconItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={4}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  content: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#FFF",
    height: 40,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  dropdownContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  statusOption: {
    padding: 10,
    backgroundColor: "#EEE",
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedStatusOption: {
    backgroundColor: "#1FD2BD",
  },
  statusOptionLabel: {
    fontSize: 14,
  },
  button: {
    borderRadius: 5,
    marginBottom: 20,
    width: 120,
    alignSelf: 'center',
  },
  remainingTime: {
    fontSize: 14,
    color: "#FF0000",
    marginTop: 5,
  },
  datePickerButton: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEE",
    borderRadius: 5,
  },
  roomInput: {
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: "#EEE",
    borderRadius: 5,
  },
  roomText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  roomItem: {
    padding: 10,
    backgroundColor: "#EEE",
    borderRadius: 5,
    marginBottom: 10,
  },
  roomItemText: {
    fontSize: 16,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  iconItem: {
    padding: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddDeviceScreen;
