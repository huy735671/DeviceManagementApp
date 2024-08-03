import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const NotificationDetail = ({ route }) => {
    const { notification } = route.params;
    const navigation = useNavigation();
    const [deviceData, setDeviceData] = useState(null);

    useEffect(() => {
        const fetchDeviceData = async () => {
            try {
                const snapshot = await firestore().collection('DEVICES').get();
                const devices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDeviceData(devices);
            } catch (error) {
                console.error("Error fetching devices: ", error);
            }
        };

        fetchDeviceData();
    }, []);

    const handleDelete = async () => {
        try {
            await firestore().collection('NOTIFICATION_ADMIN').doc(notification.key).delete();
            Alert.alert("Notification", "Notification deleted successfully.");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to delete notification.");
            console.error("Error deleting notification: ", error);
        }
    };

    const handleDeviceDetailsPress = () => {
        if (deviceData) {
            navigation.navigate('DeviceDetails', { devices: deviceData });
        } else {
            Alert.alert("Error", "No device data available.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Notification Details</Text>
            <View style={styles.card}>
                <Text style={styles.detail}>
                    <Text style={styles.label}>Thông báo từ:</Text> {notification.userName}
                </Text>
                <Text style={styles.detail}>
                    <Text style={styles.label}>Tên người gửi:</Text> {notification.userName}
                </Text>
                <Text style={styles.detail}>
                    <Text style={styles.label}>Phòng:</Text> {notification.room}
                </Text>
                <Text style={styles.detail}>
                    <Text style={styles.label}>Thông báo:</Text> {notification.reportMessage}
                </Text>
                <Text style={styles.detail}>
                    <Text style={styles.label}>Chi tiết lỗi:</Text> {notification.description}
                </Text>
                <Text style={styles.detail}>
                    <Text style={styles.label}>Tên thiết bị:</Text> {notification.deviceName}
                </Text>
                <Text style={styles.detail}>
                    <Text style={styles.label}>Thời gian:</Text> {new Date(notification.timestamp.toDate()).toLocaleString()}
                </Text>
                {notification.image ? (
                    <Image
                        source={{ uri: notification.image }}
                        style={styles.image}
                    />
                ) : (
                    <Text style={styles.noImage}>No image available</Text>
                )}
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                    onPress={handleDeviceDetailsPress} 
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Thông tin thiết bị</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('UserDetail', { userId: notification.userId })} 
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Phòng ban</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('UserDetail', { userId: notification.userId })} 
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Thông tin người gửi</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                    <Icon name='trash-outline' style={styles.deleteButtonIcon} />
                    <Text style={styles.deleteButtonText}>Xóa</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#00796b',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 20,
    },
    detail: {
        fontSize: 16,
        marginBottom: 10,
        color: '#004d40',
    },
    label: {
        fontWeight: 'bold',
        color: '#00796b',
    },
    buttonsContainer: {
        marginTop: 20,
    },
    button: {
        backgroundColor: '#00796b',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff4d4d',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 2,
    },
    deleteButtonIcon: {
        color: '#fff',
        fontSize: 20,
        marginRight: 10,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10,
        borderRadius: 10,
    },
    noImage: {
        fontSize: 16,
        color: '#004d40',
        textAlign: 'center',
    },
});

export default NotificationDetail;
