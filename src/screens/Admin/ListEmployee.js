import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ListEmployeeScreen = ({ route }) => {
  const { roomId, roomName } = route.params;
  const navigation = useNavigation();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesCollection = await firestore()
          .collection('EMPLOYEES')
          .where('roomId', '==', roomId)
          .get();
        const employeesData = employeesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, [roomId]);

  const handlePress = (employeeId) => {
    navigation.navigate('EmployeeDetail', { employeeId });
  };

  const renderEmployeeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handlePress(item.id)}
    >
      <View style={styles.itemContent}>
        <Icon name="person" size={30} color="#007bff" style={styles.icon} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách nhân viên - {roomName}</Text>
      {employees.length > 0 ? (
        <FlatList
          data={employees}
          renderItem={renderEmployeeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.emptyText}>Phòng hiện không có nhân viên.</Text>
      )}
     
    </View>
  );
};

export default ListEmployeeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});
