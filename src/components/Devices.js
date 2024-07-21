import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window'); 

const Devices = () => {
  return (
    <View>
      <Text style={{ fontWeight: 'bold', fontSize: 25, margin: 10, color:'black' }}>Gay Management</Text>
      <Animatable.View animation='lightSpeedIn' style={style.container}>
        <View style={style.topImageContainer}>
          <Animatable.Image source={require('../assets/bannerHome.png')} style={style.topImage}/>
        </View>
      </Animatable.View>
    </View>
  );
};

export default Devices;

const style = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    color:'black',
    width: width, 
  },
  
  topImageContainer: {
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
    width: '95%', 
  },
  topImage:{
    height: 200,
    width: '100%',
  },
});
