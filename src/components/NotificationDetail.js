import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons from Expo icons library

const NotificationDetail = ({ route }) => {
  // Assume route.params.notification contains the notification object
  const { notification } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="notifications" size={28} color="#555" />
        <Text style={styles.title}>Notification Detail</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.message}>{notification.message}</Text>
        <Text style={styles.timestamp}>{new Date(notification.timestamp).toLocaleString()}</Text>
        {/* Add more details if needed */}
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  content: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  message: {
    fontSize: 16,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
});

export default NotificationDetail;
