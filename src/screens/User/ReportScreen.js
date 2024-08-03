import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, ScrollView } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import PushNotification from 'react-native-push-notification';
import useNotificationSetup from '../../../sendNotification';
import io from 'socket.io-client';
const socket = io('http://192.168.1.51:3000'); // Thay đổi thành IP của laptop đang chạy

const ReportScreen = ({ route, navigation }) => {
  const { id = null, name = "", room = "" } = route.params || {};
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const CHANNEL_ID = '4';

  const createNotificationUser = async (deviceName, room) => {
    try {
      await firestore().collection("NOTIFICATION_USER").add({
        userName: auth().currentUser ? auth().currentUser.displayName : "Khách",
        image: imageUri,
        roomName: room,
        deviceName: deviceName,
        description: description,
        reportMessage: `Báo cáo về thiết bị ${deviceName} trong phòng ${room} đã được gửi thành công.`,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
      console.log('Notification for user created successfully');
    } catch (error) {
      console.error("Error creating notification for user: ", error);
    }
  };

  const createNotificationAdmin = async (deviceName, room) => {
    try {
      await firestore().collection("NOTIFICATION_ADMIN").add({
      
        deviceId: id,
        deviceName: deviceName,
        image: imageUri,
        userName: auth().currentUser ? auth().currentUser.displayName : "Khách",
        //adminName: "Admin",
        reportMessage: `Có một báo cáo mới về thiết bị ${deviceName} trong phòng ${room}.`,
        timestamp: firestore.FieldValue.serverTimestamp(),
        description: description,
        room: room,
        color: "#FF5733"  // Example color code (orange)
      });
      console.log('Notification for admin created successfully');
    } catch (error) {
      console.error("Error creating notification for admin: ", error);
    }
  };

  useNotificationSetup();

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập mô tả vấn đề.");
      return;
    }

    if (!id) {
      Alert.alert("Lỗi", "Không có thông tin thiết bị để gửi báo cáo.");
      return;
    }

    const user = auth().currentUser;
    const userEmail = user ? user.email : "Chưa đăng nhập";

    try {
      await firestore().collection("REPORTS").add({
        id: id,
        deviceId: id,
        deviceName: name,
        description: description,
        image: imageUri,
        reporterName: user ? user.displayName : "Khách",
        reporterEmail: userEmail,
        room: room,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });

      // Gửi thông báo qua socket
      const message = `Báo cáo về thiết bị ${name} trong phòng ${room} từ ${user ? user.displayName : "Khách"}`;
      socket.emit('sendNotification', message);

      // Tạo thông báo trong cả hai collection
      await createNotificationUser(name, room);
      await createNotificationAdmin(name, room);

      Alert.alert("Thành công", "Báo cáo đã được gửi thành công.");
      navigation.goBack();
    } catch (error) {
      console.error("Lỗi khi gửi báo cáo:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi gửi báo cáo.");
    }
  };

  const handleImagePick = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleCaptureImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchCamera(options, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Thiết bị này có vấn đề?</Text>
        <Text style={styles.description}>
          Vui lòng cung cấp mô tả chi tiết về vấn đề của thiết bị. Chúng tôi sẽ xử lý báo cáo của bạn sớm nhất có thể.
        </Text>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholderContainer}>
              <Text style={styles.imagePlaceholder}>Chưa có hình ảnh</Text>
            </View>
          )}
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.btnImage} onPress={handleCaptureImage}>
            <Text style={styles.btnText}>Chụp hình</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnImage} onPress={handleImagePick}>
            <Text style={styles.btnText}>Chọn từ album</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={10}
          placeholder="Nhập mô tả vấn đề..."
          value={description}
          onChangeText={setDescription}
        />
        <View style={styles.reportContainer}>
          <View style={styles.reportInfo}>
            <Text style={styles.deviceName}>Thiết bị: {name}</Text>
            <Text style={styles.roomName}>Phòng ban: {room || "Unknown"}</Text>
          </View>
          <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit}>
            <Text style={styles.btnSubmitText}>Gửi báo cáo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 10,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    height: 250,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePreview: {
    width: 400,
    height: 250,
    resizeMode: "cover",
    borderRadius: 10,
  },
  imagePlaceholderContainer: {
    width: 400,
    height: 250,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  imagePlaceholder: {
    fontSize: 16,
    color: "#999",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  btnImage: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  reportContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  roomName: {
    fontSize: 16,
  },
  btnSubmit: {
    backgroundColor: "#28A745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSubmitText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default ReportScreen
