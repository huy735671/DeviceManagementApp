import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, TextInput } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';

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
  const [deviceImage, setDeviceImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { label: 'Hoạt động', value: 'active' },
    { label: 'Không hoạt động', value: 'inactive' },
    { label: 'Đang Bảo trì', value: 'maintenance' },
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
    if (!selectedRoom || !name || !id || !deviceType || !price || !warrantyPeriod || !operationalStatus) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);

    if (name === "specificDeviceName") {
      setId("1231234123");
    }

    const warrantyEndDate = new Date(datetime);
    warrantyEndDate.setMonth(warrantyEndDate.getMonth() + parseInt(warrantyPeriod, 10));

    try {
      await firestore()
        .collection('DEVICES')
        .doc(id)
        .set({
          name,
          id,
          deviceType,
          price: parseInt(price.replace(/\./g, ''), 10),
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

      const newDevice = {
        id,
        name,
        image: deviceImage,
        status: operationalStatus,
        type: deviceType,
        assetType: 'Device',
        brand,
        model: '',
        supplier,
        price: parseInt(price.replace(/\./g, ''), 10),
        purchaseDate: datetime.toLocaleDateString(),
        warrantyPeriod,
        operationalStatus,
        deploymentDate: deploymentDate.toLocaleDateString(),
      };

      console.log('Thiết bị đã được lưu vào Firestore với phòng ban:', selectedRoom.name);
      navigation.navigate('AdminTab', newDevice);
    } catch (error) {
      console.error('Lỗi khi lưu thiết bị:', error);
      Alert.alert('Lỗi', 'Lỗi khi lưu thiết bị');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
    };

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

  const formatPrice = (price) => {
    let formattedPrice = String(price).replace(/\./g, '');
    formattedPrice = formattedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return formattedPrice;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={pickImage}>
            {deviceImage ? (
              <Image source={{ uri: deviceImage }} style={styles.deviceImage} />
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
          <FlatList
            data={statusOptions}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.statusOption}
                onPress={() => setOperationalStatus(item.value)}
              >
                <Text style={[styles.statusOptionText, operationalStatus === item.value && styles.selectedStatusOptionText]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.value}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ngày triển khai:</Text>
          <TouchableOpacity style={styles.datePickerButton} onPress={() => setOpen(true)}>
            <Text style={{ fontSize: 16, color: "#000" }}>{deploymentDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        <Button mode="contained" onPress={handleSaveDevice} loading={loading} disabled={loading}>
          Lưu thiết bị
        </Button>
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Chọn phòng ban</Text>
          <FlatList
            data={rooms}
            renderItem={renderRoomItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.modalContent}
          />
          <Button mode="contained" onPress={() => setModalVisible(false)}>
            Đóng
          </Button>
        </View>
      </Modal>

      <DatePicker
        modal
        open={open}
        date={datetime}
        mode="date"
        onConfirm={(date) => {
          setOpen(false);
          setDatetime(date);
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
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  deviceImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 8,
    borderRadius: 8,
  },
  roomInput: {
    backgroundColor: "#f1f1f1",
    padding: 8,
    borderRadius: 8,
  },
  roomText: {
    fontSize: 16,
    color: "#000",
  },
  datePickerButton: {
    backgroundColor: "#f1f1f1",
    padding: 8,
    borderRadius: 8,
  },
  remainingTime: {
    marginTop: 8,
    fontSize: 14,
    color: "red",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalContent: {
    flexGrow: 1,
  },
  roomItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  roomItemText: {
    fontSize: 16,
    color: "#000",
  },
  statusOption: {
    padding: 8,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    marginRight: 8,
  },
  statusOptionText: {
    fontSize: 14,
    color: "#000",
  },
  selectedStatusOptionText: {
    fontWeight: "bold",
    color: "#007BFF",
  },
});

export default AddDeviceScreen;
