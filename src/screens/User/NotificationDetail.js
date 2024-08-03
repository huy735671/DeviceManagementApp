import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const NotificationDetails = ({ route, navigation }) => {
  const { notificationId } = route.params; // Get the notification ID from route params
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotificationDetails = async () => {
      try {
        // Fetch notification document from Firestore
        const notificationDoc = await firestore().collection('NOTIFICATION_USER').doc(notificationId).get();
        if (notificationDoc.exists) {
          const notificationData = notificationDoc.data();

          // Fetch associated report document from Firestore
          const reportDoc = await firestore().collection('REPORTS').doc(notificationData.reportId).get();
          
          // Set the notification state with fetched data
          setNotification({
            ...notificationData,
            reportDetails: reportDoc.exists ? reportDoc.data().details : 'No details available',
          });
        } else {
          console.log('No such notification!');
        }
      } catch (error) {
        console.error("Error fetching notification details: ", error);
      }
      setLoading(false);
    };

    fetchNotificationDetails();
  }, [notificationId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }

  if (!notification) {
    return (
      <View style={styles.container}>
        <Text style={styles.noNotification}>No notification details available</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.label}>Tên người gửi:</Text>
      <Text style={styles.value}>{notification.userName}</Text>
      <Text style={styles.label}>Tên thiết bị:</Text>
      <Text style={styles.value}>{notification.deviceName}</Text>
      <Text style={styles.label}>Đến:</Text>
      <Text style={styles.value}>Hệ thống</Text>
      <Text style={styles.value}>{notification.reportMessage}</Text>
      <Text style={styles.label}>Phòng:</Text>
      <Text style={styles.value}>{notification.roomName}</Text>
      <Text style={styles.label}>Chi tiết lỗi:</Text>
      <Text style={styles.value}>{notification.description}</Text>
      {/* Display the image if the URL is available */}
      <Text style={styles.label}>Hình ảnh:</Text>
      {notification.image ? (
        <Image
          source={{ uri: notification.image }} // Use uri instead of image
          style={styles.image}
        />
      ) : (
        <Text style={styles.noImage}>No image available</Text>
      )}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 10,
      backgroundColor: '#ffffff',
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginTop: 15,
      color: '#555',
    },
    value: {
      fontSize: 14,
      marginVertical: 5,
      color: '#333',
    },
    image: {
      marginTop: 20,
      width: '100%',
      height: 200,
      resizeMode: 'cover',
      alignSelf: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    backButton: {
      marginTop: 30,
      paddingVertical: 12,
      paddingHorizontal: 20,
      backgroundColor: '#007bff',
      borderRadius: 8,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    backButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    noNotification: {
      fontSize: 16,
      color: '#555',
      textAlign: 'center',
      marginTop: 40,
    },
    noImage: {
      fontSize: 16,
      color: '#555',
      textAlign: 'center',
      marginTop: 20,
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
    },
  });
  

export default NotificationDetails;
