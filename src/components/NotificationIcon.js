import React from 'react';
import { Ionicons } from 'react-native-vector-icons/MaterialIcons';

const NotificationIcon = ({ color, size, hasUnreadNotifications }) => {
    return (
        <Ionicons 
            name={hasUnreadNotifications ? "notifications" : "notifications-outline"} 
            color={color} 
            size={size} 
        />
    );
};

export default NotificationIcon;
