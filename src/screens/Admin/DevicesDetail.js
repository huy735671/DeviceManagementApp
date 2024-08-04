import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import firestore from '@react-native-firebase/firestore';

const DeviceDetail = ({ route, navigation }) => {
  const deviceId = route.params?.device?.id;

  const [modalVisible, setModalVisible] = useState(false);
  const [reportStatus, setReportStatus] = useState('Normal');
  const [device, setDevice] = useState(null);

  useEffect(() => {
    if (!deviceId) {
      console.error("No deviceId to listen to");
      return; 
    }

    const unsubscribe = firestore()
      .collection('DEVICES')
      .doc(deviceId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          console.log("Device data has changed:", data);
          setDevice(data);
          setReportStatus(data.operationalStatus || 'Normal'); // Load trạng thái hiện tại
        } else {
          console.log("Device does not exist");
        }
      }, (error) => {
        console.error("Error listening to document: ", error);
      });

    return () => unsubscribe();
  }, [deviceId]);

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>No device data available.</Text>
      </View>
    );
  }

  const {
    image, icon = 'devices', name, operationalStatus, deviceType, brand,
    supplier,  deploymentDate, warrantyEndDate,datetime,
    
  } = device;


  const formatDate = (date) => {
    if (!date) return "Chưa có thông tin";
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('vi-VN');
  };

  const translateStatus = (status) => {
    switch (status) {
      case "maintenance":
        return "Đang bảo trì";
      case "inactive":
        return "Hư hỏng";
      case "active":
        return "Bình thường";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "maintenance":
        return "#fff3cd"; // màu vàng nhạt cho trạng thái maintenance
      case "inactive":
        return "#f8d7da"; // màu đỏ nhạt cho trạng thái inactive
      case "active":
        return "#d4edda"; // màu xanh nhạt cho trạng thái active
      default:
        return "#e2e3e5"; // màu xám nhạt cho trạng thái khác
    }
  };

  const handleReport = () => {
    setModalVisible(true);
  };

  const handleEdit = () => {
    navigation.navigate('EditDevice', { device });
  };

  const handleDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa thiết bị này không?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await firestore().collection('DEVICES').doc(deviceId).delete();
              console.log("Device deleted successfully");
              navigation.goBack(); // Quay lại màn hình trước đó sau khi xóa
            } catch (error) {
              console.error("Error deleting device: ", error);
            }
          }
        }
      ]
    );
  };

  const submitReport = async () => {
    try {
      await firestore().collection('DEVICES').doc(deviceId).update({
        operationalStatus: reportStatus,
      });
      setModalVisible(false);
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  const statusOptions = [
    { label: 'Bình thường', value: 'active' },
    { label: 'Hư hỏng', value: 'inactive' },
    { label: 'Đang bảo trì', value: 'maintenance' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.header, { backgroundColor: getStatusColor(operationalStatus) }]}>
          {image ? (
            <Image source={{ uri: image }} style={styles.deviceImage} />
          ) : (
            <Icon name={icon} size={100} color="#000" />
          )}
          <View style={styles.headerText}>
            <Text style={styles.title}>Tên thiết bị:</Text>
            <Text style={styles.text}>{name}</Text>
            <Text style={styles.title}>Trạng thái:</Text>
            <Text style={[
              styles.text,
              { backgroundColor: getStatusColor(operationalStatus), padding: 5, borderRadius: 5 }
            ]}>
              {translateStatus(operationalStatus)}
            </Text>
            <Text style={styles.title}>Tên phòng:</Text>
            <Text style={styles.text}>{device.roomName}</Text>
          </View>
          <TouchableOpacity style={styles.deleteIcon} onPress={handleDelete}>
            <Icon name="delete" size={24} color="#dc3545" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Text style={styles.detailTitle}>Loại thiết bị:</Text>
              <Text style={styles.detailText}>{deviceType}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailItem}>
              <Text style={styles.detailTitle}>Thương hiệu:</Text>
              <Text style={styles.detailText}>{brand}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailItem}>
              <Text style={styles.detailTitle}>Nhà cung cấp:</Text>
              <Text style={styles.detailText}>{supplier}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailItem}>
              <Text style={styles.detailTitle}>Ngày mua:</Text>
              <Text style={styles.detailText}>{formatDate(datetime?.toDate())}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailItem}>
              <Text style={styles.detailTitle}>Ngày hết hạn bảo hành:</Text>
              <Text style={styles.detailText}>{formatDate(warrantyEndDate)}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailItem}>
              <Text style={styles.detailTitle}>Ngày triển khai:</Text>
              <Text style={styles.detailText}>{formatDate(deploymentDate)}</Text>
            </View>
            
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.btnReport} onPress={handleReport}>
            <Text style={styles.btnText}>Báo cáo thiết bị</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnEdit} onPress={handleEdit}>
            <Text style={styles.btnText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn trạng thái mới</Text>
            <ScrollView style={styles.statusList}>
              {statusOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.statusOption,
                    reportStatus === option.value && styles.selectedStatus,
                  ]}
                  onPress={() => setReportStatus(option.value)}
                >
                  <Text
                    style={[
                      styles.statusText,
                      reportStatus === option.value && styles.selectedStatusText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.submitButton} onPress={submitReport}>
              <Text style={styles.submitButtonText}>Cập nhật</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    
  },
  deviceImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#eaeaea',
  },
  headerText: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#343a40',
  },
  text: {
    fontSize: 16,
    color: '#495057',
  },
  deleteIcon: {
    padding: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',

  },
  details: {
    flex: 1,
    
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#343a40',
  },
  detailText: {
    fontSize: 14,
    color: '#495057',
  },
  separator: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 5,
  },
  buttonContainer: {
    padding: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnReport: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  btnEdit: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  btnText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statusList: {
    width: '100%',
  },
  statusOption: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: '#e9ecef',
  },
  selectedStatus: {
    backgroundColor: '#007bff',
  },
  statusText: {
    fontSize: 16,
    color: '#495057',
  },
  selectedStatusText: {
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default DeviceDetail;
