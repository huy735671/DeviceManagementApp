import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const PendinglistScreen = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const snapshot = await firestore().collection('SIGNUP').get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPendingUsers(users);
      } catch (error) {
        console.error('Error fetching pending users:', error.message);
      }
    };

    fetchPendingUsers();
  }, []);

  const handlePress = (user) => {
    navigation.navigate('PendingDetail', { user });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách chờ</Text>
      
      {pendingUsers.length === 0 ? (
        <View style={styles.noUsersContainer}>
          <Text style={styles.noUsersText}>Chưa có tài khoản nào được đăng ký.</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            data={pendingUsers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
                <View style={styles.userInfo}>
                  <Text style={styles.username}>{item.username}</Text>
                  <Text style={styles.email}>{item.email}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    
  },
  noUsersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    
  },
  noUsersText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    
  },
  item: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderColor:'#ddd',
    borderWidth:1,
  },
  userInfo: {
    flexDirection: 'column',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
});

export default PendinglistScreen;
