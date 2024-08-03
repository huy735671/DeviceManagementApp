import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const { width } = Dimensions.get('window');

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

const MaintenanceDetail = ({ route }) => {
  const { id } = route.params;
  const [device, setDevice] = useState(null);

  useEffect(() => {
    const fetchDeviceDetails = async () => {
      try {
        const deviceDoc = await firestore().collection('DEVICES').doc(id).get();
        if (deviceDoc.exists) {
          setDevice(deviceDoc.data());
        }
      } catch (error) {
        console.error("Error fetching device details: ", error);
      }
    };

    fetchDeviceDetails();
  }, [id]);

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const data = [
    {
      type: 'image',
      content: device.image,
    },
    {
      type: 'info',
      content: [
        { label: 'Thương hiệu:', value: device.brand },
        { label: 'Loại thiết bị:', value: device.deviceType },
        { label: 'Ngày triển khai:', value: device.deploymentDate.toDate().toLocaleDateString() },
        { label: 'Ngày hết hạn bảo hành:', value: device.warrantyEndDate.toDate().toLocaleDateString() },
        { label: 'Nhà cung cấp:', value: device.supplier },
        { label: 'Tình trạng:', value: translateStatus(device.operationalStatus) },
        { label: 'Room Name:', value: device.roomName },
      ],
    },
  ];

  const renderItem = ({ item }) => {
    if (item.type === 'image') {
      return (
        <View style={styles.imageContainer}>
          {item.content ? (
            <Image source={{ uri: item.content }} style={styles.image} />
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageText}>Không có hình ảnh</Text>
            </View>
          )}
        </View>
      );
    }

    if (item.type === 'info') {
      return (
        <View style={styles.infoContainer}>
          {item.content.map((info, index) => (
            <View key={index} style={styles.infoItem}>
              <Text style={styles.label}>{info.label}:</Text>
              <Text style={styles.text}>{info.value}</Text>
            </View>
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <ScrollView>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.type + index}
        contentContainerStyle={styles.container}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  imageContainer: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5, // Shadow for Android
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  image: {
    width: width - 10, // Adjust based on padding
    height: 200,
    resizeMode: 'cover',
  },
  noImageContainer: {
    width: width - 10, // Adjust based on padding
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  noImageText: {
    fontSize: 18,
    color: '#888',
  },
  infoContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 20,
  },
  infoItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
  },
});

export default MaintenanceDetail;
