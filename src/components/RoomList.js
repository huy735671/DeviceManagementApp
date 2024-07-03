import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Icons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const RoomList = () => {
  const navigation = useNavigation();

  const data = [
    { id: 1, name: "Room 1", status: "Normal" },
    { id: 2, name: "Room 2", status: "Broken" },
    { id: 3, name: "Room 3", status: "Normal" },
    { id: 4, name: "Room 4", status: "Maintenance" },
    { id: 5, name: "Room 5", status: "Normal" },
    { id: 6, name: "Room 6", status: "Normal" },
  ];

  const dataRoomList = [
    {
      room: "Room 1", list: [
        { devices: "phone", status: "Normal" },
        { devices: "laptop", status: "Normal" },
      ]
    },
    {
      room: "Room 2", list: [
        { devices: "tablet", status: "Normal" },
        { devices: "laptop", status: "Normal" },
      ]
    },
    {
      room: "Room 3", list: [
        { devices: "phone", status: "Normal" },
        { devices: "tablet", status: "Normal" },
      ]
    },
    {
      room: "Room 4", list: [
        { devices: "phone", status: "Normal" },
        { devices: "laptop", status: "Normal" },
      ]
    },
    {
      room: "Room 5", list: [
        { devices: "tablet", status: "Normal" },
        { devices: "laptop", status: "Normal" },
      ]
    },
  
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Normal":
        return "blue";
      case "Broken":
        return "red";
      case "Maintenance":
        return "orange";
      default:
        return "gray";
    }
  };

  const handlerRoom = (room) => {
    const roomData = dataRoomList.find((item) => item.room === room.name);
    navigation.navigate("Room", { room, roomData });
  };

  return (
    <View>
      <Text style={{ fontWeight: "bold", fontSize: 20 }}>Room List</Text>
      <View style={style.container}>
        {data.map((item, index) => (
          <View key={index} style={style.items}>
            <TouchableOpacity
              onPress={() => handlerRoom(item)}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <Icons name="computer" size={30} color="black" />
              <Text>{item.name}</Text>
              <Text style={{ color: getStatusColor(item.status) }}>
                {item.status}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

export default RoomList;

const { width } = Dimensions.get("window");
const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  items: {
    width: width / 2 - 20,
    height: 100,
    margin: 10,
    borderColor: "black",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});