import PushNotification from 'react-native-push-notification';

const LocalNotification = (deviceType, roomName) => {
    const key = Date.now().toString();
    PushNotification.createChannel(
        {
            channelId: key,
            channelName: "Local message",
            channelDescription: "Notification for Local message",
            importance: 4,
            vibrate: true,
        },
        (created) => console.log(`createChannel returned '${created}'`)
    );

    PushNotification.localNotification({
        channelId: key,
        title: 'Thông báo lỗi',
        message: `Thiết bị ${deviceType} ở phòng ${roomName} bị lỗi.`,
    });
};

export default LocalNotification;
