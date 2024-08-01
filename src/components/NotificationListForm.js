import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const NotificationListForm = () => {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // Xử lý logic khi người dùng submit notification
    const newNotification = {
      id: notifications.length + 1, // Đặt ID duy nhất (thường sử dụng timestamp hoặc UUID)
      title: title,
      message: message,
    };
    setNotifications([...notifications, newNotification]);
    // Reset form sau khi submit
    setTitle('');
    setMessage('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter notification title"
        />
        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={message}
          onChangeText={setMessage}
          multiline
          placeholder="Enter notification message"
        />
        <Button title="Send Notification" onPress={handleSubmit} />
      </View>
      <FlatList
        style={styles.notificationList}
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  notificationList: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default NotificationListForm;
