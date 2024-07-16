import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import firestore from "@react-native-firebase/firestore";

const DeviceDetail = ({ route, navigation }) => {
  const {
    id, icon = "devices", name, status, type, assetType, brand,
    model, supplier, price, purchaseDate, warrantyPeriod, 
    operationalStatus, deploymentDate
  } = route.params;

  const handleDeleteDevice = async () => {
    try {
      await firestore().collection('DEVICES').doc(id).delete();
      console.log('Thiết bị đã được xóa khỏi Firestore');

      navigation.navigate('AdminTab');
      Alert.alert('Xóa thành công', 'Thiết bị đã được xóa khỏi hệ thống.');
    } catch (error) {
      console.error('Lỗi khi xóa thiết bị:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xóa thiết bị.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Icon name={icon} size={100} color="#000" />
          <View style={styles.headerText}>
            <Text style={styles.title}>Tên thiết bị:</Text>
            <Text style={styles.text}>{name}</Text>
            <Text style={styles.title}>Trạng thái:</Text>
            <Text style={styles.text}>{status}</Text>
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
        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: "orange" }]}
          onPress={() => navigation.navigate('ReportDevice', { id })}
        >
          Báo cáo
        </Button>
        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: "#1FD2BD" }]}
          onPress={() => navigation.navigate('EditDevice', { id })} 
        >
          Chỉnh sửa 
        </Button>
        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: "red" }]}
          onPress={handleDeleteDevice}
        >
          Xóa
        </Button>
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
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    borderRadius: 5,
    width: 120,
    marginBottom: 10,
  },
});

export default DeviceDetail;
