import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const InfoDevices = ({ route, navigation }) => {
  const {
    id, icon = "devices", name, status, type, brand,
     supplier, price, purchaseDate, warrantyPeriod, 
    operationalStatus, deploymentDate, image, roomName, 
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>


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
            <View style={styles.detailItem}>
              <Text style={styles.detailTitle}>Giá:</Text>
              <Text style={styles.detailText}>{price}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailItem}>
              <Text style={styles.detailTitle}>Ngày mua:</Text>
              <Text style={styles.detailText}>{purchaseDate?.toDate().toLocaleDateString()}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailItem}>
              <Text style={styles.detailTitle}>Thời hạn bảo hành:</Text>
              <Text style={styles.detailText}>{warrantyPeriod?.toDate().toLocaleDateString()}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailItem}>
              <Text style={styles.detailTitle}>Trạng thái hoạt động:</Text>
              <Text style={styles.detailText}>{operationalStatus}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailItem}>
              <Text style={styles.detailTitle}>Ngày đưa vào sử dụng:</Text>
              <Text style={styles.detailText}>{new Date(deploymentDate).toLocaleDateString()}</Text>
            </View>
          </View>
        </View>
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
    backgroundColor: '#007bff',
    borderRadius:20,
    borderWidth:1, 
  },
  card: {
    borderRadius: 20, 
    borderWidth: 1,
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
    color: '#ffffff',
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
    color: '#ffffff',
  },
  details: {
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius:20, 
 
  },
  detailItem: {
    paddingVertical: 10,
  },
  detailTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color:'black',
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
});

export default InfoDevices;
