import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const NotificationDetail = ({ route }) => {
    const { notification } = route.params;
    const navigation = useNavigation();
    const [deviceData, setDeviceData] = useState(null);
    const [roomData, setRoomData] = useState(null);
    const [employeeData, setEmployeeData] = useState(null);

    useEffect(() => {
        const fetchDeviceData = async () => {
            try {
                console.log('Fetching device data for deviceId:', notification.deviceId);
                const snapshot = await firestore().collection('DEVICES').where('id', '==', notification.deviceId).get();
                if (snapshot.empty) {
                    console.log('No devices found for deviceId:', notification.deviceId);
                    setDeviceData(null);
                    return;
                }
                const devices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDeviceData(devices.length > 0 ? devices[0] : null);
            } catch (error) {
                console.error("Error fetching devices: ", error);
            }
        };

        const fetchRoomData = async () => {
            try {
                const snapshot = await firestore().collection('ROOMS').where('name', '==', notification.room).get();
                if (snapshot.empty) {
                    console.log('No rooms found for room name:', notification.room);
                    setRoomData(null);
                    return;
                }
                const rooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRoomData(rooms.length > 0 ? rooms[0] : null);
            } catch (error) {
                console.error("Error fetching rooms: ", error);
            }
        };

        const fetchEmployeeData = async () => {
            try {
                const snapshot = await firestore().collection('USERS').where('username', '==', notification.userName).get();
                if (snapshot.empty) {
                    console.log('No employees found for username:', notification.userName);
                    setEmployeeData(null);
                    return;
                }
                const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEmployeeData(employees.length > 0 ? employees[0] : null);
            } catch (error) {
                console.error("Error fetching employees: ", error);
            }
        };

        fetchDeviceData();
        fetchRoomData();
        fetchEmployeeData();
    }, [notification.deviceId, notification.room, notification.userName]);

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
            navigation.navigate('DevicesDetail', { device: deviceData });
        } else {
            Alert.alert("Error", "Device not found.");
        }
    };

    const handleRoomPress = () => {
        if (roomData) {
            navigation.navigate('ListDevices', { roomId: roomData.id });
        } else {
            Alert.alert("Error", "Room not found.");
        }
    };

    const handleUserDetailsPress = () => {
        if (employeeData) {
            navigation.navigate('EmployeeDetail', { employee: employeeData });
        } else {
            Alert.alert("Error", "User not found.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Chi tiết thông báo</Text>
            <View style={styles.card}>
                <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                    <Icon name='trash-outline' style={styles.deleteButtonIcon} />
                </TouchableOpacity>
                <Text style={styles.detail}>
                    <Text style={styles.label}>Thông báo từ: Hệ thống</Text> 
                </Text>
                <Text style={styles.detail}>
                    <Text style={styles.label}>Tên người gửi:</Text> {notification.userName || "Không xác định"}
                </Text>

                <Text style={styles.detail}>
                    <Text style={styles.label}>Email người gửi:</Text> {notification.email || "Không xác định"}
                </Text>

                <TouchableOpacity onPress={handleRoomPress} style={styles.roomTouchable}>
                    <Text style={styles.detail}>
                        <Text style={styles.label}>Phòng:</Text> {notification.room}
                    </Text>
                </TouchableOpacity>
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
                    <Text style={styles.noImage}>Không có hình ảnh</Text>
                )}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={handleDeviceDetailsPress} style={styles.button}>
                        <Text style={styles.buttonText}>Thông tin thiết bị</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleRoomPress} style={styles.button}>
                        <Text style={styles.buttonText}>Phòng ban</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleUserDetailsPress} style={styles.button}>
                        <Text style={styles.buttonText}>Thông tin người gửi</Text>
                    </TouchableOpacity>
                </View>
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
        position: 'relative',
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
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius: 50,
        alignItems: 'center',
        elevation: 2,
    },
    deleteButtonIcon: {
        color: '#fff',
        fontSize: 20,
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
    roomTouchable: {
        // Add any specific styles for the touchable area here if needed
    },
});

export default NotificationDetail;
