// RemoteNotification.js

import React, { useEffect } from 'react';
import io from 'socket.io-client';
import PushNotification from 'react-native-push-notification';

const socket = io('http://192.168.1.11:3000');

const RemoteNotification = () => {
    useEffect(() => {
        socket.on('receiveNotification', (message) => {
            PushNotification.localNotification({
                channelId: '4',
                title: "Thông báo mới",
                message: message,
                importance: 4,
                vibrate: 300,
            });
        });

        return () => {
            socket.off('receiveNotification');
        };
    }, []);

    return null;
};

export default RemoteNotification;
