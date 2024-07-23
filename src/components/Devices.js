// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import * as Animatable from 'react-native-animatable';

// const { width } = Dimensions.get('window'); 

// const Devices = () => {
//   const [currentImage, setCurrentImage] = useState(require('../assets/bannerHome.png'));
//   const images = [
//     require('../assets/bannerHome.png'),
//     require('../assets/banner2.jpg'),
//     require('../assets/banner3.jpg'),
//   ];

//   useEffect(() => {
//     let currentIndex = 0;
//     const intervalId = setInterval(() => {
//       currentIndex = (currentIndex + 1) % images.length;
//       setCurrentImage(images[currentIndex]);
//     }, 3000);

//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <View>
//       <Text style={{ fontWeight: 'bold', fontSize: 25, margin: 10, color:'black' }}>Gay Management</Text>
//       <Animatable.View animation='lightSpeedIn' style={style.container}>
//         <View style={style.topImageContainer}>
//           <Animatable.Image source={currentImage} style={style.topImage}/>
//         </View>
//       </Animatable.View>
//     </View>
//   );
// };

// export default Devices;

// const style = StyleSheet.create({
//   container: {
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     color:'black',
//     width: width, 
//   },
  
//   topImageContainer: {
//     marginHorizontal: 10,
//     marginTop: 10,
//     borderRadius: 10,
//     overflow: 'hidden',
//     width: '95%', 
//   },
//   topImage:{
//     height: 200,
//     width: '100%',
//   },
// });
import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions,Button } from "react-native";
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from "@react-navigation/native";
const { width } = Dimensions.get('window'); 

const Devices = () => {
  const [currentImage, setCurrentImage] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchImage = async () => {
      const imageDoc = await firestore().collection('BANNER').doc('currentImage').get();
      if (imageDoc.exists) {
        setCurrentImage(imageDoc.data().url);
      }
    };
    
    fetchImage();
  }, []);
  // const goToBannerScreen = () => {
  //   navigation.navigate('Banner');
  // };
  return (
    <View>
      <Text style={{ fontWeight: 'bold', fontSize: 25, margin: 10, color:'black' }}>Gay Management</Text>
      {currentImage && <Image source={{ uri: currentImage }} style={style.topImage} />}
      {/* <Button title="Edit Banner" onPress={goToBannerScreen} /> */}
    </View>
  );
};

export default Devices;

const style = StyleSheet.create({
  topImage: {
    height: 200,
    width: '100%',
    borderRadius: 10,
  },
});
