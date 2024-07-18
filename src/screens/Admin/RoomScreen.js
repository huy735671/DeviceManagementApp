import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from 'react-native-paper';

const RoomScreen = ({ navigation, route }) => {
  const { roomId, roomName } = route.params;
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('DEVICES')
      .where('roomId', '==', roomId)
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
      status: item.operationalStatus,
      type: item.deviceType,
      assetType: item.assetType,
      brand: item.brand,
      model: item.model,
      supplier: item.supplier,
      price: item.price,
      purchaseDate: item.datetime,
      warrantyPeriod: item.warrantyEndDate,
      operationalStatus: item.operationalStatus,
      deploymentDate: item.deploymentDate,
    });
  };

  const deleteAllDataInCollection = async (collectionName) => {
    try {
      const snapshot = await firestore().collection(collectionName).get();
      const batch = firestore().batch();
  
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
  
      await batch.commit();
      console.log(`Đã xóa toàn bộ dữ liệu trong collection ${collectionName}`);
    } catch (error) {
      console.error(`Lỗi xóa dữ liệu trong collection ${collectionName}:`, error);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await firestore().collection('ROOMS').doc(roomId).delete();
      Alert.alert('Thành công', 'Phòng đã được xóa.');
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi xóa phòng:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xóa phòng.');
    }
  };

  const confirmDeleteRoom = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa phòng này không?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: handleDeleteRoom,
        },
      ],
      { cancelable: false }
    );
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
      {devices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Phòng không có thiết bị.</Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
      <Button
        mode="contained"
        onPress={confirmDeleteRoom}
        style={[styles.deleteButton, devices.length > 0 && styles.disabledButton]}
        labelStyle={styles.deleteButtonText}
        disabled={devices.length > 0}
      >
        Xóa Phòng
      </Button>
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
  deleteButton: {
    marginTop: 20,
    backgroundColor: '#ff5252',
  },
  deleteButtonText: {
    color: '#FFF',
  },
  disabledButton: {
    backgroundColor: '#ffcccc',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
});

export default RoomScreen;
