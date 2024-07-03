import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icons from "react-native-vector-icons/MaterialIcons";
const Devices = () => {
  return (
    <View>
      <Text style={{fontWeight:'bold', fontSize:20}}>Devices List</Text>
      <View style={style.container}>
        <View style={style.devices}>
            <View style={style.icon}>
                  <Icons name="computer" size={30} color="black" />
                  </View>
        
          <Text> Computer</Text>
        </View>

        <View style={style.devices}>
            <View style={style.icon}><Icons name="phone" size={30} color="black" /></View>
          
          <Text> Phone</Text>
        </View>
        <View style={style.devices}>
            <View style={style.icon}><Icons name="tv" size={30} color="black" /></View>
          
          <Text> Screen</Text>
        </View>
        <View style={style.devices}>
            <View style={style.icon}><Icons name="camera" size={30} color="black" /></View>
          
          <Text> Camera</Text>
        </View>
        
      </View>
    </View>
  );
};

export default Devices;

const style = StyleSheet.create({
  container: {
    paddingTop:20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  devices: {

    alignItems: "center",
    marginHorizontal: 2,
   
  },
  icon:{
    width: 70,
    height: 70,
    alignItems: "center",
    marginHorizontal: 10,
    borderWidth:1,
    borderBlockColor: "black",
    borderRadius:50,
    justifyContent: "center",
    // alignItems: "center",
  },
});