import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Các tùy chọn trạng thái với nhãn và giá trị tương ứng
const statusOptions = [
  { label: 'Bình thường', value: 'active' },
  { label: 'Hư hỏng', value: 'inactive' },
  { label: 'Đang bảo trì', value: 'maintenance' },
];

// Hàm lấy màu sắc dựa trên trạng thái
const getStatusColor = (status) => {
  switch (status) {
    case 'maintenance':
      return "#fff3cd"; // Màu vàng nhạt cho trạng thái maintenance
    case 'inactive':
      return "#f8d7da"; // Màu đỏ nhạt cho trạng thái inactive
    case 'active':
      return "#d4edda"; // Màu xanh nhạt cho trạng thái active
    default:
      return "#e2e3e5"; // Màu xám nhạt cho trạng thái khác
  }
};

// Hàm ánh xạ giá trị trạng thái thành nhãn
const getStatusLabel = (status) => {
  const statusOption = statusOptions.find(option => option.value === status);
  return statusOption ? statusOption.label : 'Không xác định'; // Nếu không tìm thấy, trả về 'Không xác định'
};

// Hàm để xác định độ ưu tiên của trạng thái
const getStatusPriority = (status) => {
  switch (status) {
    case 'maintenance':
      return 1;
    case 'inactive':
      return 2;
    case 'active':
      return 3;
    default:
      return 4; // Mặc định cho các trạng thái không xác định
  }
};

const ListDevicesScreen = ({ route }) => {
  const { roomId, roomName } = route.params;
  const navigation = useNavigation();
  const [devices, setDevices] = useState([]);

  // Lấy danh sách thiết bị từ Firestore
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('DEVICES')
      .where('roomId', '==', roomId)
      .onSnapshot(snapshot => {
        const devicesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sắp xếp thiết bị theo độ ưu tiên của trạng thái
        const sortedDevices = devicesData.sort((a, b) => getStatusPriority(a.operationalStatus) - getStatusPriority(b.operationalStatus));
        setDevices(sortedDevices);
      }, error => {
        console.error('Error fetching devices:', error);
      });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [roomId]);

  // Xử lý khi nhấn vào thiết bị
  const handlePress = (device) => {
    navigation.navigate('DevicesDetail', { device });
  };

  // Xử lý xóa thiết bị
  const handleDelete = (id) => {
    Alert.alert(
      'Xóa thiết bị',
      'Bạn có chắc chắn muốn xóa thiết bị này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive', 
          onPress: () => {
            firestore().collection('DEVICES').doc(id).delete()
              .then(() => {
                console.log('Device successfully deleted!');
              })
              .catch(error => {
                console.error('Error removing device: ', error);
              });
          } 
        }
      ]
    );
  };

  // Render một thiết bị
  const renderDeviceItem = ({ item }) => (
    <View style={[styles.item, { backgroundColor: getStatusColor(item.operationalStatus) }]}>
      <TouchableOpacity style={styles.itemContent} onPress={() => handlePress(item)}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.deviceImage} />
        ) : (
          <Icon name="devices" size={40} color="#007bff" style={styles.icon} />
        )}
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDetail}>Type: {item.deviceType}</Text>
          <Text style={styles.itemDetail}>Trạng thái: {getStatusLabel(item.operationalStatus)}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
        <Icon name="delete" size={28} color="#ff0000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách thiết bị phòng {roomName}</Text>
      {devices.length > 0 ? (
        <FlatList
          data={devices}
          renderItem={renderDeviceItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.emptyText}>Phòng hiện không có thiết bị.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#ddd', // Đường viền xám nhạt
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 20,
  },
  deviceImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  itemDetail: {
    fontSize: 16,
    color: '#666',
  },
  deleteButton: {
    padding: 15,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ListDevicesScreen;
