import React, { useState, useEffect } from "react";
import { View, Button, Image, StyleSheet, Platform,Text } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {Header} from 'react-native-elements';
const BannerScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        // Lấy URL của ảnh từ Firestore
        const doc = await firestore().collection('BANNER').doc('currentImage').get();
        if (doc.exists) {
          const { url } = doc.data();
          setImageUri(url);
        }
      } catch (error) {
        console.error("Error fetching image URL: ", error);
      }
    };

    fetchImageUrl();
  }, []);

  const pickImage = () => {
    launchImageLibrary({}, response => {
      if (response.assets) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const deleteImage = () => {
    setImageUri(null);
  };

  const saveImage = async () => {
    if (imageUri) {
      const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
      const uploadUri = Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;

      try {
        // Tạo tham chiếu đến thư mục 'banners' trong Firebase Storage
        const reference = storage().ref(`BannerImage/${filename}`);

        await reference.putFile(uploadUri);

        const downloadUrl = await reference.getDownloadURL();
        console.log('File available at:', downloadUrl);

        // Lưu URL vào Firestore
        await firestore().collection('BANNER').doc('currentImage').set({
          url: downloadUrl
        });

        // Cập nhật URL ảnh hiện tại
        setImageUri(downloadUrl);
      } catch (error) {
        console.error("Error saving image: ", error);
      }
    }
  };

  return (
    <View style={styles.container}>
        <Header
        leftComponent={{
          icon: 'arrow-back',
          color: '#1c1c1c',
          onPress: () => navigation.goBack(),
        }}
        centerComponent={<Text style={styles.headerTitle}>Edit Banner</Text>}
        containerStyle={styles.header}
      />
      <View style={styles.imgcontainer}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      </View>
    
      <View style={styles.buttonContainer}>
        <Button title="Đổi ảnh" onPress={pickImage} style={styles.btn} />
        <Button title="Xóa ảnh" onPress={deleteImage} />
       
      </View>
      <Button title="Lưu ảnh" onPress={saveImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  header: {
    backgroundColor: '#1cd2bd',
    borderBottomWidth: 0,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1c1c1c',
  },
  image: {
    height: 300,
    width: '100%',
  },
  imgcontainer: {
    borderWidth: 2,
    borderColor: 'black',
    height: 300,
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100',
    paddingHorizontal: 10,
  },
  
});

export default BannerScreen;
