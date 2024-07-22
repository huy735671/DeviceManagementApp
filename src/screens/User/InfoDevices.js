import React from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const InfoDevices = ({ route, navigation }) => {
  const {
    id, icon = "devices", name, status, type, assetType, brand,
    model, supplier, price, purchaseDate, warrantyPeriod, 
    operationalStatus, deploymentDate, image, roomName, department
  } = route.params || {};

  const getStatusLabel = (status) => {
    switch (status) {
      case "maintenance":
        return "Bảo trì";
      case "inactive":
        return "Hư hỏng";
      case "active":
        return "Bình thường";
      default:
        return "Không xác định";
    }
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
      <View style={styles.card}>
        <View style={styles.header}>
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
        <View style={styles.details}>
          <Text style={styles.detailText}>Kiểu thiết bị: {type}</Text>
          <Text style={styles.detailText}>Thương hiệu: {brand}</Text>
          <Text style={styles.detailText}>Nhà cung cấp: {supplier}</Text>
          <Text style={styles.detailText}>Giá: {price}</Text>
          <Text style={styles.detailText}>Ngày mua: {purchaseDate?.toDate().toLocaleDateString()}</Text>
          <Text style={styles.detailText}>Thời hạn bảo hành: {warrantyPeriod?.toDate().toLocaleDateString()}</Text>
          <Text style={styles.detailText}>Trạng thái hoạt động: {operationalStatus}</Text>
          <Text style={styles.detailText}>Ngày đưa vào sử dụng: {new Date(deploymentDate).toLocaleDateString()}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        {status === "active" && (
          <TouchableOpacity style={styles.btnReport} onPress={handleReport}>
            <Text style={styles.btnText}>Báo cáo thiết bị</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  headerText: {
    marginLeft: 10,
  },
  deviceImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  details: {
    padding: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
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
});

export default InfoDevices;
