import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

const deleteNotification = async (id) => {
  try {
    await firestore().collection('NOTIFICATION_ADMIN').doc(id).delete();
    console.log('Notification deleted successfully');
  } catch (error) {
    console.error("Error deleting notification: ", error);
    throw error; // Re-throw to handle in the component
  }
};

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const querySnapshot = await firestore()
        .collection('NOTIFICATION_ADMIN')
        .orderBy('timestamp', 'desc')
        .get();

      const notificationsList = [];
      for (const documentSnapshot of querySnapshot.docs) {
        const notificationData = documentSnapshot.data();
        const userDoc = await firestore().collection('USERS').doc(notificationData.userId).get();
        const reportDoc = await firestore().collection('REPORTS').doc(notificationData.reportId).get();

        notificationsList.push({
          ...notificationData,
          key: documentSnapshot.id,
          userName: userDoc.exists ? userDoc.data().name : 'HỆ THỐNG',
          reportDetails: reportDoc.exists ? reportDoc.data().details : 'No details available',
        });
      }
      setNotifications(notificationsList);
    } catch (error) {
      console.error("Error loading notifications: ", error);
      Alert.alert("Error", "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this notification?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await deleteNotification(id);
              setNotifications(notifications.filter(notification => notification.key !== id));
            } catch (error) {
              Alert.alert("Error", "Failed to delete notification.");
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationName}>{item.userName}</Text>
        <Text style={styles.notificationTimestamp}>
          {new Date(item.timestamp.toDate()).toLocaleString()}
        </Text>
      </View>
      {item.reportMessage ? (
        <Text style={styles.notificationMessage}>{item.reportMessage}</Text>
      ) : (
        <Text style={styles.notificationMessage}>{item.message}</Text>
      )}
      {item.reportDetails && (
        <Text style={styles.reportDetails}>{item.reportDetails}</Text>
      )}
      <TouchableOpacity onPress={() => handleDelete(item.key)} style={styles.deleteButton}>
        <Icon name='trash-outline' style={styles.deleteButtonText} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#007bff" />}
      {notifications.length === 0 ? (
        <Text style={styles.noNotifications}>No notifications available</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item.key}
        />
      )}
      <Button
        title="Load Notifications"
        onPress={loadNotifications}
        color="#007bff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  notificationItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  notificationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#888',
  },
  reportDetails: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  deleteButton: {
    position: 'absolute',
    right: 15,
    bottom: 10,
    backgroundColor: '#ff4d4d',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  noNotifications: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Notification;
