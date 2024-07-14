import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon from react-native-vector-icons
import { getFirestore } from '@react-native-firebase/firestore';
const DevicesDetail = ({ route }) => {
  const {  name, icon, operationalStatus, deviceType, brand, supplier, price, deploymentDate, warrantyEndDate, roomId } = route.params;

  return (
    <View style={styles.container}>
     
      <Text style={styles.label}>Tên thiết bị:</Text>
      <Text style={styles.text}>{name}</Text>

      <Text style={styles.label}>Biểu tượng:</Text>
      <Icon name={icon} size={30} color="#000" />

      <Text style={styles.label}>Tình trạng hoạt động:</Text>
      <Text style={styles.text}>{operationalStatus}</Text>

      <Text style={styles.label}>Loại thiết bị:</Text>
      <Text style={styles.text}>{deviceType}</Text>

      <Text style={styles.label}>Thương hiệu:</Text>
      <Text style={styles.text}>{brand}</Text>

      <Text style={styles.label}>Nhà cung cấp:</Text>
      <Text style={styles.text}>{supplier}</Text>

      <Text style={styles.label}>Giá:</Text>
      <Text style={styles.text}>{price}</Text>

      <Text style={styles.label}>Ngày triển khai:</Text>
      <Text style={styles.text}>{deploymentDate}</Text>

      <Text style={styles.label}>Ngày hết hạn bảo hành:</Text>
      <Text style={styles.text}>{warrantyEndDate}</Text>

      <Text style={styles.label}>ID phòng:</Text>
      <Text style={styles.text}>{roomId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default DevicesDetail;
