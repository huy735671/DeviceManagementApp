import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Dimensions, FlatList, Animated } from "react-native";
import firestore from '@react-native-firebase/firestore';

const { width } = Dimensions.get('window');

const Devices = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

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
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % images.length;
          flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
          return nextIndex;
        });
      }, 5000); // 5000ms = 5 giây

      return () => clearInterval(interval);
    }
  }, [images]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Banner Management</Text>
      {images.length > 0 ? (
        <View style={styles.bannerContainer}>
          <FlatList
            ref={flatListRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.topImage} />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <View style={styles.pagination}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { opacity: currentIndex === index ? 1 : 0.5 },
                ]}
              />
            ))}
          </View>
        </View>
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
  bannerContainer: {
    width: width - 20,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  topImage: {
    height: 200,
    width: width - 20,
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'black',
    marginHorizontal: 5,
  },
  noImageText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Devices;
