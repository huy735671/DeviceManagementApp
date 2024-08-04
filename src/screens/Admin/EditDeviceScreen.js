import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Picker } from '@react-native-picker/picker';

const EditDeviceScreen = ({ route, navigation }) => {
  const { device } = route.params;
  const [deviceInfo, setDeviceInfo] = useState(device);
  const [imageUri, setImageUri] = useState('');
  const [status, setStatus] = useState(device.operationalStatus || 'active');

  useEffect(() => {
    if (device) {
      setDeviceInfo({
        ...device,
        deploymentDate: device.deploymentDate ? device.deploymentDate.toDate().toISOString().split('T')[0] : '',
        datetime: device.datetime ? device.datetime.toDate().toISOString().split('T')[0] : '',
        warrantyEndDate: device.warrantyEndDate ? device.warrantyEndDate.toDate().toISOString().split('T')[0] : '',
      });
      if (device.icon) { 
        fetchImageUri(device.icon);
      } else {
        setImageUri('');
      }
      setStatus(device.operationalStatus || 'active');
    }
  }, [device]);

  const fetchImageUri = async (imagePath) => {
    if (!imagePath) {
      setImageUri(''); // Set to empty if no image path
      return;
    }

    try {
      const imageUrl = await storage().refFromURL(imagePath).getDownloadURL();
      setImageUri(imageUrl);
    } catch (error) {
      console.error("Error fetching image URL: ", error.message);
      Alert.alert("Lỗi", "Không thể tải hình ảnh.");
      setImageUri(''); // Set to empty if there's an error
    }
  };

  const handleChange = (field, value) => {
    setDeviceInfo({ ...deviceInfo, [field]: value });
  };

  const handleSave = async () => {
    try {
      await firestore().collection('DEVICES').doc(deviceInfo.id).update({
        ...deviceInfo,
        deploymentDate: new Date(deviceInfo.deploymentDate),
        datetime: new Date(deviceInfo.datetime),
        warrantyEndDate: new Date(deviceInfo.warrantyEndDate),
        icon: imageUri, 
        operationalStatus: status,
      });
      Alert.alert("Thành công", "Thông tin thiết bị đã được cập nhật.");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating device: ", error.message);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin thiết bị.");
    }
  };

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else {
        const uri = response.assets[0].uri;
        uploadImage(uri);
      }
    });
  };

  const uploadImage = async (uri) => {
    const fileName = uri.substring(uri.lastIndexOf('/') + 1);
    const reference = storage().ref(fileName);

    try {
      await reference.putFile(uri);
      const imageUrl = await reference.getDownloadURL();
      setImageUri(imageUrl);
      setDeviceInfo({ ...deviceInfo, icon: imageUrl }); // Update the deviceInfo with the new image URL
    } catch (error) {
      console.error("Error uploading image: ", error.message);
      Alert.alert("Lỗi", "Không thể tải lên hình ảnh.");
    }
  };

  const statusOptions = [
    { label: 'Bình thường', value: 'active' },
    { label: 'Hư hỏng', value: 'inactive' },
    { label: 'Đang bảo trì', value: 'maintenance' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <TouchableWithoutFeedback onPress={selectImage}>
          <View style={styles.imageContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>Chọn hình ảnh</Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.deviceInfoContainer}>
          <Text style={styles.label}>Tên thiết bị:</Text>
          <TextInput
            style={styles.input}
            value={deviceInfo.name}
            onChangeText={(text) => handleChange('name', text)}
          />

          <Text style={styles.label}>Trạng thái:</Text>
          <Picker
            selectedValue={status}
            style={styles.picker}
            onValueChange={(itemValue) => setStatus(itemValue)}
          >
            {statusOptions.map(option => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>

          <Text style={styles.label}>Loại thiết bị:</Text>
          <TextInput
            style={styles.input}
            value={deviceInfo.deviceType}
            onChangeText={(text) => handleChange('deviceType', text)}
          />

          <Text style={styles.label}>Thương hiệu:</Text>
          <TextInput
            style={styles.input}
            value={deviceInfo.brand}
            onChangeText={(text) => handleChange('brand', text)}
          />

          <Text style={styles.label}>Nhà cung cấp:</Text>
          <TextInput
            style={styles.input}
            value={deviceInfo.supplier}
            onChangeText={(text) => handleChange('supplier', text)}
          />

          <Text style={styles.label}>Ngày triển khai:</Text>
          <TextInput
            style={styles.input}
            value={deviceInfo.deploymentDate}
            onChangeText={(text) => handleChange('deploymentDate', text)}
            placeholder="YYYY-MM-DD"
          />

          <Text style={styles.label}>Ngày mua:</Text>
          <TextInput
            style={styles.input}
            value={deviceInfo.datetime}
            onChangeText={(text) => handleChange('datetime', text)}
            placeholder="YYYY-MM-DD"
          />

          <Text style={styles.label}>Ngày hết hạn bảo hành:</Text>
          <TextInput
            style={styles.input}
            value={deviceInfo.warrantyEndDate}
            onChangeText={(text) => handleChange('warrantyEndDate', text)}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
    height: 200,
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
  },
  deviceInfoContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditDeviceScreen;
