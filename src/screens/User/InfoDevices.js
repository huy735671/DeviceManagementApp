import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const InfoDevices = ({ route, navigation }) => {
  const {
    id, icon = "devices", name, status, type, brand,
    supplier, purchaseDate, warrantyPeriod,
    operationalStatus, deploymentDate, image, roomName,
  } = route.params || {};

  
  // Hàm để lấy màu sắc trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "maintenance":
        return "#fff3cd"; // màu đỏ nhạt cho trạng thái maintenance
      case "inactive":
        return "#f8d7da"; // màu vàng nhạt cho trạng thái inactive
      case "active":
        return "#d4edda"; // màu xanh nhạt cho trạng thái active
      default:
        return "#e2e3e5"; // màu xám nhạt cho trạng thái khác
    }
  };

  // Hàm để lấy nhãn trạng thái
  const getStatusLabel = (status) => {
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

  // Hàm để định dạng ngày
  const formatDate = (date) => {
    if (!date) return "Chưa có thông tin";
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const handleReport = () => {
    navigation.navigate('Report', {
      id: id,
      name: name,
      room: roomName,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.header, { backgroundColor: getStatusColor(status) }]}>
          {image ? (
            <Image source={{ uri: image }} style={styles.deviceImage} />
          ) : (
            <Icon name={icon} size={100} color="#000" />
          )}
          <View style={styles.headerText}>
            <Text style={styles.title}>Tên thiết bị:</Text>
            <Text style={styles.text}>{name}</Text>
            <Text style={styles.title}>Trạng thái:</Text>
            <Text style={styles.text}>{getStatusLabel(status)}</Text>
            <Text style={styles.title}>Tên phòng:</Text>
            <Text style={styles.text}>{roomName}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Text style={styles.detailTitle}>Kiểu thiết bị:</Text>
              <Text style={styles.detailText}>{type}</Text>
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
            
            <View style={styles.separator} />
            <View style={styles.detailItem}>
              <Text style={styles.detailTitle}>Ngày mua:</Text>
              <Text style={styles.detailText}>{formatDate(purchaseDate?.toDate())}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailItem}>
              <Text style={styles.detailTitle}>Thời hạn bảo hành:</Text>
              <Text style={styles.detailText}>{formatDate(warrantyPeriod?.toDate())}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailItem}>
              <Text style={styles.detailTitle}>Ngày đưa vào sử dụng:</Text>
              <Text style={styles.detailText}>{formatDate(deploymentDate)}</Text>
            </View>
          </View>
        </View>

        {status === "maintenance" && (
          <View style={styles.statusMessage}>
            <Text style={styles.statusText}>Thiết bị đang bảo trì</Text>
          </View>
        )}

        {status === "inactive" && (
          <View style={styles.statusMessage}>
            <Text style={styles.statusText}>Đang chờ bảo trì</Text>
          </View>
        )}
      </ScrollView>

      {status === "active" && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.btnReport} onPress={handleReport}>
            <Text style={styles.btnText}>Báo cáo thiết bị</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eff5f9",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
    paddingBottom: 70, 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
  },
  card: {
    borderRadius: 20,
    borderColor: "#000",
    marginVertical: 10,
    backgroundColor: "#eff5f9",
    elevation: 5,
  },
  headerText: {
    marginLeft: 10,
    flex: 1,
  },
  deviceImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: 'black',
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
    color: 'black',
  },
  details: {
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 20,
  },
  detailItem: {
    paddingVertical: 10,
  },
  detailTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  detailText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#cccccc',
    marginVertical: 5,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  btnReport: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 50,
  },
  btnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  statusMessage: {
    padding: 10,
    backgroundColor: '#ffdddd',
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    color: '#d9534f',
  },
});

export default InfoDevices;
