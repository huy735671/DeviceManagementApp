import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icons from "react-native-vector-icons/MaterialIcons";
import * as Animatable from 'react-native-animatable';

const Devices = () => {
  return (
    <View>
      <Text style={{ fontWeight: 'bold', fontSize: 25, margin: 10, }}>Devices List</Text>
      <Animatable.View animation='lightSpeedIn' style={style.container}>
        <View style={style.devices}>
          <View style={style.icon}>
            <Icons name="computer" size={25} color="black" />
          </View>
          <Text > Computer</Text>
        </View>

        <View style={style.devices}>
          <View style={style.icon}><Icons name="phone" size={25} color="black" /></View>
          <Text > Phone</Text>
        </View>
        <View style={style.devices}>
          <View style={style.icon}><Icons name="tv" size={25} color="black" /></View>

          <Text> Screen</Text>
        </View>
        <View style={style.devices}>
          <View style={style.icon}><Icons name="camera" size={25} color="black" /></View>

          <Text > Camera</Text>
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
  },
  devices: {
    margin: 10,
    alignItems: "center",
    marginHorizontal: 5,

  },
  icon: {
    width: 70,
    height: 70,
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 1,
    borderBlockColor: "black",
    borderRadius: 50,
    justifyContent: "center",
    // alignItems: "center",
  },
});