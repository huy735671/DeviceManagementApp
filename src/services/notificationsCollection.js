// NotificationService.js
import firestore from '@react-native-firebase/firestore';
import notifee, { AndroidImportance } from '@notifee/react-native';

const notificationsCollection = firestore().collection('notifications');

export async function displayNotification(remoteMessage, userType) {
    await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android: {
            channelId: 'default',
            smallIcon: 'ic_launcher', // tên của icon bạn đã thêm vào dự án
        },
    });

    // Lưu trữ thông báo vào Firestore
    await notificationsCollection.add({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        type: userType, // "admin" hoặc "user"
        timestamp: firestore.FieldValue.serverTimestamp(),
    });
}

export function getNotifications(userType) {
    return notificationsCollection.where('type', '==', userType).orderBy('timestamp', 'desc').get();
}
