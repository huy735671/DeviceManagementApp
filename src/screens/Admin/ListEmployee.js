import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ListEmployeeScreen = ({ route }) => {
  const { roomId } = route.params || {};
  const navigation = useNavigation();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!roomId) {
        Alert.alert('Error', 'Room ID is missing.');
        return;
      }

      try {
        console.log('Fetching employees for room ID:', roomId);
        const usersCollection = await firestore()
          .collection('USERS')
          .where('roomId', '==', roomId)
          .get();

        if (usersCollection.empty) {
          Alert.alert('No Data', 'No employees found for this room.');
          return;
        }

        const usersData = usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched employees:', usersData);
        setEmployees(usersData);
      } catch (error) {
        console.error('Error fetching users:', error.message); // Detailed error message
        Alert.alert('Error', 'An error occurred while fetching employees.');
      }
    };

    fetchEmployees();
  }, [roomId]);

  const handlePress = (employee) => {
    console.log('Navigating to EmployeeDetail with:', employee);
    navigation.navigate('EmployeeDetail', { employee });
  };

  const renderEmployeeItem = ({ item }) => {
    const username = item.username || 'No Name'; // Ensure 'username' field exists in USERS

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => handlePress(item)}
      >
        <View style={styles.itemContent}>
          <Icon name="person" size={30} color="#007bff" style={styles.icon} />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{username}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhân viên phòng {roomId || 'N/A'}</Text>
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
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ListEmployeeScreen;
