import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RoomScreen = ({ navigation, route }) => {
  const { roomId, roomName } = route.params;
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('DEVICES')
      .where('roomId', '==', roomId) // Filter devices by roomId
      .onSnapshot(querySnapshot => {
        const devicesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDevices(devicesData);
      });

    return () => unsubscribe();
  }, [roomId]);

  const handleDetailPress = (item) => {
    navigation.navigate('DevicesDetail', {
      id: item.id,
      icon: item.icon,
      name: item.name,
      status: item.operationalStatus, // Sử dụng đúng tên trường
      type: item.deviceType,
      assetType: item.assetType,
      brand: item.brand,
      model: item.model,
      supplier: item.supplier,
      price: item.price,
      purchaseDate: item.datetime, // Sử dụng đúng tên trường
      warrantyPeriod: item.warrantyEndDate, // Sử dụng đúng tên trường
      operationalStatus: item.operationalStatus,
      deploymentDate: item.deploymentDate,
    });
  };
  
  

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleDetailPress(item)}>
      <Icon name={item.icon} size={60} color="#000" />
      <View style={{ marginLeft: 20 }}>
        <Text style={styles.txtFeature}>Tên thiết bị: {item.name}</Text>
        <Text style={styles.txtFeature}>Trạng thái: {item.operationalStatus}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách thiết bị trong phòng {roomName}</Text>
      <FlatList
        data={devices}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  txtFeature: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default RoomScreen;
