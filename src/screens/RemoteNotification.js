import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

const checkApplicationPermission = async () => {
    if (Platform.OS === 'android') {
        try {
            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            );
        } catch (error) {
            console.error(error);
        }
    }
};

const RemoteNotification = () => {
    useEffect(() => {
        checkApplicationPermission();
        
        PushNotification.getChannels(function (channel_ids) {
            channel_ids.forEach((id) => {
                PushNotification.deleteChannel(id);
            });
        });

        PushNotification.configure({
            onRegister: function (token) {
                console.log('TOKEN:', token);
            },
            onNotification: function (notification) {
                const { message, title, id } = notification;
                let strTitle = JSON.stringify(title).split('"').join('');
                let strBody = JSON.stringify(message).split('"').join('');
                const key = JSON.stringify(id).split('"').join('');
                
                PushNotification.createChannel(
                    {
                        channelId: key,
                        channelName: "remote message",
                        channelDescription: "Notification for remote message",
                        importance: 4,
                        vibrate: true,
                    },
                    (created) => console.log(`createChannel returned '${created}'`)
                );

                PushNotification.localNotification({
                    channelId: key,
                    title: 'Thông báo lỗi',
                     message: `Thiết bị ${deviceName} ở phòng ${room} bị lỗi.`,
                });

                console.log('REMOTE NOTIFICATION ==>', title, message, id, notification);
            },
            senderID: '325436514861',
            popInitialNotification: true,
            requestPermissions: true,
        });
    }, []);

    return null;
};

export default RemoteNotification;
