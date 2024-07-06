import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Icons from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Header } from "react-native-elements";

const Room = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { roomData } = route.params;

  const handleDevicePress = (device) => {
    navigation.navigate("InfoDevices", { device });
  };

  return (
    <View style={styles.container}>
       <Header
        leftComponent={{
          icon: "arrow-back",
          color: "#fff",
          onPress: () => navigation.goBack(),
        }}
        centerComponent={   <Text style={styles.title}>Devices in {roomData.room}</Text>}
      />

      <View style={styles.container}>
        {roomData.list.map((device, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleDevicePress(device)}
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <View style={styles.items}>
              <View style={{paddingRight:20}}>
              <Icons name="devices" size={50} color="black"/>
              </View>
            <View>
            <Text style={{ fontWeight:'bold'}}>Device: {device.devices}</Text>
            <Text style={{ color: device.color, fontWeight:'bold' }}>Status: {device.status}</Text>
            </View>
             
            </View>
          </TouchableOpacity>
        ))}
        
      </View>
      
    </View>
  );
};

export default Room;

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
   container: {
    flex: 1,
  },
  content: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  items:{
    flexDirection: "row",
    width:400,
    height:100,
    borderWidth:1,
    marginVertical:10,
    marginLeft:10,
    marginRight:10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius:10,
    
  },
});