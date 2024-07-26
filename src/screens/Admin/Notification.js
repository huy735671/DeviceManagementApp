import React, { useCallback } from 'react';
import { View, Text, Button, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import notifee from '@notifee/react-native';

const Notification = () => {
  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'This app needs access to show notifications',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the notifications');
      } else {
        console.log('Notification permission denied');
      }
    }
  };

  const onDisplayNotification = useCallback(async () => {
    try {
      // Request notification permission on Android
      await requestPermission();

      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

      // Display a notification
      await notifee.displayNotification({
        title: 'Notification Title',
        body: 'Main body content of the notification',
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
      });
      console.log('Notification displayed');
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text>Notification</Text>
      <Button title="Display Notification" onPress={onDisplayNotification} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Notification;
