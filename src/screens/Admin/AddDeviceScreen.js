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

  useEffect(() => {
    // Lấy danh sách các phòng ban từ Firestore
    const fetchRooms = async () => {
      const roomsCollection = await firestore().collection('ROOMS').get();
      setRooms(roomsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchRooms();
  }, []);

  // Tính toán thời gian còn lại của bảo hành
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
    if (selectedRoom && name && id && deviceType && price && warrantyPeriod) {
      // Tính toán thời gian kết thúc bảo hành
      const warrantyEndDate = new Date(datetime);
      warrantyEndDate.setMonth(warrantyEndDate.getMonth() + parseInt(warrantyPeriod, 10));

      try {
        // Lưu thiết bị vào collection 'DEVICES'
        await firestore()
          .collection('DEVICES')
          .add({
            name,
            id,
            deviceType,
            price: parseInt(price.replace(/\./g, ''), 10), // Lưu giá theo đúng định dạng
            datetime,
            warrantyEndDate,
            roomId: selectedRoom.id, // ID của phòng ban
          });

        console.log('Thiết bị đã được lưu vào Firestore với phòng ban:', selectedRoom.name);
        navigation.goBack(); // Điều hướng quay lại màn hình trước đó
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

  const formatPrice = (price) => {
    // Chuyển giá thành chuỗi và xóa các dấu "."
    let formattedPrice = String(price).replace(/\./g, '');

    // Thêm dấu "." mỗi ba chữ số từ cuối lên đầu
    formattedPrice = formattedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return formattedPrice;
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View
        style={{
          alignItems: "flex-start",
          flexDirection: "row",
          marginTop: 10,
        }}
      >
        <Icon name={"account-circle"} size={100} color={"#000"} />
        <View style={{ flexDirection: "column" }}>
          <View
            style={{
              ...styles.txtAndInput,
              flexDirection: "row",
              marginTop: 10,
            }}
          >
            <Text style={styles.txt}>Tên thiết bị: </Text>
            <TextInput
              placeholder={"Tên thiết bị"}
              value={name}
              onChangeText={setName}
              style={{
                backgroundColor: null,
                borderRadius: 10,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                height: 40,
                width: "55%",
                borderWidth: 1,
                marginBottom: 10,
              }}
              underlineColor="white"
              textColor="#000"
              placeholderTextColor={"#000"}
            />
          </View>
          <View style={styles.txtAndInput}>
            <Text style={styles.txt}>Số series: </Text>
            <TextInput
              placeholder={"Số series"}
              value={id}
              onChangeText={setId}
              style={{
                backgroundColor: null,
                borderRadius: 10,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                height: 40,
                width: "60%",
                borderWidth: 1,
                marginBottom: 10,
              }}
              underlineColor="white"
              textColor="#000"
              placeholderTextColor={"#000"}
            />
          </View>
        </View>
      </View>
      <View style={{ margin: 20 }}>
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
          <Text style={styles.txt}>Kiểu thiết bị: </Text>
          <TextInput
            placeholder={'Kiểu thiết bị'}
            value={deviceType}
            onChangeText={setDeviceType}
            style={styles.txtInput}
            underlineColor="white"
            textColor="#000"
            placeholderTextColor={'#000'}
          />
        </View>
        <View style={styles.txtAndInput}>
          <Text style={styles.txt}>Giá: </Text>
          <TextInput
            placeholder={"Giá"}
            value={formatPrice(price)}
            onChangeText={(text) => {
              // Loại bỏ các ký tự không phải số
              const formattedText = text.replace(/\D/g, '');
              setPrice(formattedText);
            }}
            keyboardType="numeric"
            style={styles.txtInput}
            underlineColor="white"
            textColor="#000"
            placeholderTextColor={"#000"}
          />
        </View>
        <View style={styles.txtAndInput}>
          <Text style={styles.txt}>Ngày mua: </Text>
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
          <Text style={styles.txt}>Thời gian bảo hành (tháng): </Text>
          <TextInput
            placeholder={"Thời gian bảo hành"}
            value={warrantyPeriod}
            onChangeText={setWarrantyPeriod}
            keyboardType="numeric"
            style={styles.txtInput}
            underlineColor="white"
            textColor="#000"
            placeholderTextColor={"#000"}
          />
        </View>
        {remainingTime !== '' && (
          <Text style={{ fontSize: 18, color: '#FF0000', marginVertical: 10 }}>
            {remainingTime}
          </Text>
        )}
        <View style={styles.txtAndInput}>
          <Text style={styles.txt}>Ngày đưa vào sử dụng: </Text>
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
      </View>
      <View style={{ alignItems: "center" }}>
        <Button
          style={{ backgroundColor: "#1FD2BD", ...styles.btn }}
          onPress={handleSaveDevice}
        >
          <Text style={styles.txt}>Lưu thông tin</Text>
        </Button>
      </View>
      
      {/* Modal chọn phòng ban */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn phòng ban</Text>
            <FlatList
              data={rooms}
              renderItem={renderRoomItem}
              keyExtractor={(item) => item.id}
            />
            <Button onPress={() => setModalVisible(false)}>Đóng</Button>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
};

export default AddDeviceScreen;

const styles = StyleSheet.create({
  txt: {
    color: '#000',
    fontSize: 18,
  },
  btn: {
    borderRadius: 5,
    width: 200,
    marginBottom: 10,
  },
  txtInput: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 40,
    flex: 1,
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  roomText: {
    color: '#000',
    fontSize: 16,
  },
  txtAndInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  datePickerButton: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 5,
  },
  iconStyle: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  roomItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  roomItemText: {
    fontSize: 18,
  },
});
