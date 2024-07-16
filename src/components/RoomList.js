import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Icons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

const RoomList = () => {
  const navigation = useNavigation();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("ROOMS")
      .onSnapshot((snapshot) => {
        const roomsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Sắp xếp danh sách rooms
        const sortedRooms = roomsData.sort((a, b) => {
          const statusOrder = ["Maintenance", "Broken", "Normal"];
          return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        });
        setRooms(sortedRooms);
      });

    return () => unsubscribe();
  }, []);

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

  const handleRoomPress = (room) => {
    navigation.navigate("Room", { room });
  };

  return (
    <View>
      <Text style={{ fontWeight: "bold", fontSize: 25, margin: 10 }}>
        Room List
      </Text>
      <View style={styles.container}>
        {rooms.map((room) => (
          <TouchableOpacity
            key={room.id}
            style={styles.item}
            onPress={() => handleRoomPress(room)}
          >
            <Icons name="computer" size={50} color="black" />
            <Text style={{ fontWeight: "bold" }}>{room.name}</Text>
            <Text style={{ color: getStatusColor(room.status), fontWeight: 'bold' }}>{room.status}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default RoomList;

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  item: {
    width: width / 2 - 20,
    height: 100,
    margin: 10,
    borderColor: "black",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
