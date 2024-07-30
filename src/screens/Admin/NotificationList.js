// NotificationsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getNotifications } from '../../services/NotificationService';

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const notificationsData = await getNotifications();
      setNotifications(notificationsData);
    };

    fetchNotifications();
  }, []);

  return (
    <View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>{item.userName}</Text>
            <Text>{item.timestamp?.toDate().toString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default NotificationsList;
