import React, { useState, useEffect } from "react";
import { View, Button, Image, StyleSheet, Platform, FlatList, TouchableOpacity, Text } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Đảm bảo cài đặt react-native-vector-icons

const BannerScreen = ({route}) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const snapshot = await firestore().collection('BANNER').get();
        const fetchedImages = snapshot.docs.map(doc => doc.data().url);
        setImages(fetchedImages);
      } catch (error) {
        console.error("Error fetching images: ", error);
      }
    };

    fetchImages();
  }, []);

  const pickImage = () => {
    launchImageLibrary({}, response => {
      if (response.assets) {
        const uri = response.assets[0].uri;
        saveImage(uri); // Lưu ảnh ngay khi chọn
      }
    });
  };
  const deleteImage = async (url) => {
    try {
      // Trích xuất đúng phần reference từ URL
      const startIdx = url.indexOf('BannerImage%2F') + 'BannerImage%2F'.length;
      const endIdx = url.indexOf('?');
      const encodedFilename = url.substring(startIdx, endIdx);
      const filename = decodeURIComponent(encodedFilename);
      const referencePath = `BannerImage/${filename}`;

      // Xóa ảnh khỏi Firebase Storage
      const reference = storage().ref(referencePath);
      await reference.delete();

      // Xóa URL ảnh khỏi Firestore
      const snapshot = await firestore().collection('BANNER').where('url', '==', url).get();
      snapshot.forEach(async (doc) => {
        await doc.ref.delete();
      });

      // Cập nhật trạng thái ảnh
      setImages(prevImages => prevImages.filter(image => image !== url));
      console.log('Image deleted successfully');
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        console.log('No object exists at the desired reference');
      } else {
        console.error('Error deleting image:', error);
      }
    }
  };


  const saveImage = async (uri) => {
    if (uri) {
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

      try {
        const reference = storage().ref(`BannerImage/${filename}`);
        await reference.putFile(uploadUri);

        const downloadUrl = await reference.getDownloadURL();
        console.log('File available at:', downloadUrl);

        await firestore().collection('BANNER').add({
          url: downloadUrl
        });

        // Cập nhật trạng thái ảnh
        setImages(prevImages => [downloadUrl, ...prevImages]);
      } catch (error) {
        console.error("Error saving image: ", error);
      }
    }
  };

  const renderImageItem = ({ item }) => (
    <View style={styles.imgContainer}>
      <Image source={{ uri: item }} style={styles.image} />
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImage(item)}>
        <Icon name="delete" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderImageItem}
        keyExtractor={(item) => item}
        ListEmptyComponent={<Text style={styles.noImagesText}>No images available</Text>}
      />
      <View style={styles.buttonContainer}>
        <Button title="Thêm ảnh" onPress={pickImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5, // Thêm padding cho container chính
    backgroundColor: '#fff',
    
  },
  image: {
    height: 200, // Giảm chiều cao của ảnh để phù hợp với danh sách
    width: '100%',
    borderRadius: 10,
  },
  imgContainer: {
    borderWidth: 2,
    borderColor: 'black',
    marginBottom: 5, // Thêm margin dưới mỗi ảnh
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Để vị trí của nút xóa
    overflow: 'hidden', // Đảm bảo rằng nút xóa không bị vượt ra ngoài ảnh
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ để nổi bật nút
    borderRadius: 20,
    padding: 10,
  },
  buttonContainer: {
    marginTop: 20, // Thêm khoảng cách trên giữa danh sách ảnh và nút thêm ảnh
    alignItems: 'center',
  },
  noImagesText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginVertical: 20, // Thêm khoảng cách dọc cho văn bản khi không có ảnh
  },
});

export default BannerScreen;
