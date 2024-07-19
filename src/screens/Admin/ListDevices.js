import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';

const ListDevices = ({ navigation }) => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('DEVICES')
      .onSnapshot(snapshot => {
        const devicesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDevices(devicesData);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDevicePress = (item) => {
    navigation.navigate('DevicesDetail', { deviceId: item.id });
  };

  const renderDeviceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleDevicePress(item)}
    >
      <Icon name={item.icon} size={40} color={"#000"} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemType}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh Sách Thiết Bị</Text>
      <FlatList
        data={devices}
        renderItem={renderDeviceItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  itemTextContainer: {
    marginLeft: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemType: {
    fontSize: 14,
    color: '#777',
  },
});

export default ListDevices;
