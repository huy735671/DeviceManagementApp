import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Header } from "react-native-elements";
import { useNavigation, useRoute } from "@react-navigation/native";

const Room = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { room, roomData } = route.params;

  return (
    <View style={styles.container}>
      <Header
        leftComponent={{
          icon: "arrow-back",
          color: "#fff",
          onPress: () => navigation.goBack(),
        }}
        centerComponent={   <Text style={styles.title}>{room.name}</Text>}
      />
      <View style={styles.content}>
     
        {/* <Text>Status: {room.status}</Text>
        <Text>Devices:</Text> */}
        {roomData.list.map((device, index) => (
          <View key={index}  style={styles.items}>
            <Text style={{fontSize:16,fontWeight:'bold'}}>Device: {device.devices}</Text>
            <Text style={{fontSize:16,fontWeight:'bold'}}>Status: {device.status}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

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


export default Room;