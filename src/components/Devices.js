import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions, FlatList } from "react-native";
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window');

const Devices = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    // Hàm lắng nghe thay đổi từ Firestore
    const unsubscribe = firestore()
      .collection('BANNER')
      .onSnapshot((snapshot) => {
        const fetchedImages = snapshot.docs.map(doc => doc.data().url);
        setImages(fetchedImages);
      }, (error) => {
        console.error("Error fetching images: ", error);
      });

    // Dọn dẹp khi component bị hủy
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Chuyển đổi hình ảnh mỗi 5 giây nếu có nhiều hình ảnh
    let interval;
    if (images.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
      }, 5000); // 5000ms = 5 giây
    }
    return () => clearInterval(interval);
  }, [images]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Gay Management</Text>
      {images.length > 0 ? (
        <Image source={{ uri: images[currentIndex] }} style={styles.topImage} />
      ) : (
        <Text style={styles.noImageText}>No images available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'black',
    marginBottom: 10,
  },
  topImage: {
    height: 200,
    width: width - 20, 
    borderRadius: 10,
  },
  noImageText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Devices;
