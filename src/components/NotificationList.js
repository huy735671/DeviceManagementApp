import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons from react-native-vector-icons
import { useNavigation } from '@react-navigation/native';

const NotificationList = () => {
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New message received', timestamp: '2024-07-18T10:30:00Z' },
    { id: 2, message: 'Reminder: Meeting at 2 PM', timestamp: '2024-07-17T14:00:00Z' },
    // Add more notifications as needed
  ]);

  const handleNotificationPress = (notification) => {
    navigation.navigate('NotificationDetail', { notification });
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity style={styles.notificationItem} onPress={() => handleNotificationPress(item)}>
      <Ionicons name="notifications" size={24} color="#555" style={styles.icon} />
      <View style={styles.messageContainer}>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotificationItem}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#fff',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  icon: {
    marginRight: 12,
  },
  messageContainer: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
});

export default NotificationList;
