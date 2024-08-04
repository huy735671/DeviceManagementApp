import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';

const PendingDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = route.params;

  const [selectedRoom, setSelectedRoom] = useState('');
  const [role, setRole] = useState('user');
  const [rooms, setRooms] = useState([]);
  const [showRooms, setShowRooms] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const snapshot = await firestore().collection('ROOMS').get();
        const roomsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRooms(roomsData);
      } catch (error) {
        console.error('Error fetching rooms:', error.message);
      }
    };

    fetchRooms();
  }, []);

  const registerUserInAuth = async (email, password) => {
    try {
      const userRecord = await auth().fetchSignInMethodsForEmail(email);
      if (userRecord.length > 0) {
        return null; // Email already in use
      }
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error creating user in Authentication:', error.message);
      throw new Error('Error creating user in Authentication');
    }
  };

  const saveUserToFirestore = async (user) => {
    try {
      const userData = {
        avatarUrl: user.avatarUrl || '',
        datetime: user.datetime || new Date(),
        email: user.email || '',
        icon: user.icon || 'person',
        id: user.id || '',
        numPhone: user.numPhone || '',
        role: role || 'user',
        roomId: selectedRoom || null,
        username: user.username || '',
      };
      await firestore().collection('USERS').doc(user.email).set(userData);
    } catch (error) {
      console.error('Error saving user data to Firestore:', error.message);
      throw new Error('Error saving user data to Firestore');
    }
  };

  const handleApprove = async () => {
    if (!user.password) {
      Alert.alert('Thiếu mật khẩu', 'Vui lòng cung cấp mật khẩu trước khi chấp nhận.');
      return;
    }

    try {
      console.log('Attempting to register user in Firebase Auth');
      const authUser = await registerUserInAuth(user.email, user.password);

      if (!authUser) {
        Alert.alert('Lỗi', 'Email đã được sử dụng bởi tài khoản khác.');
        return;
      }

      console.log('User registered in Firebase Auth, now saving to Firestore');
      await saveUserToFirestore({
        ...user,
        role,
        roomId: selectedRoom,
      });

      console.log('User saved to Firestore, now deleting from SIGNUP');
      await firestore().collection('SIGNUP').doc(user.email).delete();
      console.log('User deleted from SIGNUP collection successfully');
      Alert.alert('Chấp nhận thành công', 'Tài khoản đã được chấp nhận và xóa khỏi danh sách chờ.');
      navigation.goBack();
    } catch (error) {
      console.error('Error handling approval:', error.message);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi chấp nhận tài khoản.');
    }
  };

  const handleReject = async () => {
    try {
      console.log('Deleting user from SIGNUP collection:', user.email);
      await firestore().collection('SIGNUP').doc(user.email).delete();
      console.log('User deleted from SIGNUP collection successfully');
      Alert.alert('Xóa thành công', 'Tài khoản đã bị xóa khỏi danh sách chờ.');
      navigation.goBack();
    } catch (error) {
      console.error('Error rejecting user:', error.message);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa tài khoản.');
    }
  };

  const handleRoomSelect = (id) => {
    setSelectedRoom(id);
    setShowRooms(false);
  };

  const handleRoleChange = () => {
    setRole(prevRole => (prevRole === 'admin' ? 'user' : 'admin'));
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Tên người dùng: {user.username}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Email: {user.email}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Chọn phòng:</Text>
          <TouchableOpacity onPress={() => setShowRooms(!showRooms)} style={styles.dropdown}>
            <Text style={styles.dropdownText}>
              {selectedRoom ? rooms.find(room => room.id === selectedRoom)?.name : 'Chọn phòng'}
            </Text>
          </TouchableOpacity>
          {showRooms && (
            <FlatList
              data={rooms}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleRoomSelect(item.id)}
                >
                  <Text style={styles.itemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              style={styles.list}
            />
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Chọn vai trò:</Text>
          <TouchableOpacity onPress={handleRoleChange} style={styles.dropdown}>
            <Text style={styles.dropdownText}>
              {role === 'admin' ? 'Admin' : 'User'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleReject} style={styles.button}>
            <Text style={styles.buttonText}>Xóa</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleApprove} style={styles.button}>
            <Text style={styles.buttonText}>Chấp nhận</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  infoBox: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    fontSize: 16,
    color: 'black',
  },
  dropdown: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownText: {
    color: 'black',
    fontSize: 16,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
    color: 'black',
  },
  list: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#1fde99',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PendingDetailsScreen;
