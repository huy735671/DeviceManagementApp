// LocalNotification.js

import PushNotification from 'react-native-push-notification';

const LocalNotification = (title, message) => {
    PushNotification.localNotification({
        channelId: '4', // Sử dụng ID kênh thông báo
        title: title,
        message: message,
        importance: 4,
        vibrate: 300,
    });
};

export default LocalNotification;
