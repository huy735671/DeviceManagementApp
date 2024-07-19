import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';

const ListEmployees = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('EMPLOYEES')
      .onSnapshot(snapshot => {
        const employeesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployees(employeesData);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleEmployeePress = (item) => {
    navigation.navigate('EmployeeDetail', { employeeId: item.id });
  };

  const renderEmployeeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleEmployeePress(item)}
    >
      <Icon name={item.icon} size={40} color={"#000"} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemRole}>{item.role}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh Sách Nhân Viên</Text>
      <FlatList
        data={employees}
        renderItem={renderEmployeeItem}
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
  itemRole: {
    fontSize: 14,
    color: '#777',
  },
});

export default ListEmployees;
