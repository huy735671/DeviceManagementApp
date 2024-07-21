import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Icons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

const RoomList = () => {
  const navigation = useNavigation();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Fetch all rooms
        const roomsSnapshot = await firestore().collection("ROOMS").get();
        const roomsData = roomsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Rooms Data:", roomsData);

        // Fetch device counts for each room
        const roomsWithDeviceCounts = await Promise.all(roomsData.map(async (room) => {
          const devicesSnapshot = await firestore()
            .collection("DEVICES")
            .where("roomId", "==", room.id)
            .get();
          
          const deviceCount = devicesSnapshot.size;
          return {
            ...room,
            deviceCount,
          };
        }));

        // Sort rooms by status with priority
        const sortedRooms = roomsWithDeviceCounts.sort((a, b) => {
          console.log(`Sorting: ${a.name} (${a.status}) vs ${b.name} (${b.status})`);
          const statusOrder = ["maintenance", "inactive", "active"];
          return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        });

        console.log("Sorted Rooms:", sortedRooms);
        setRooms(sortedRooms);
      } catch (error) {
        console.error("Error fetching rooms and device counts:", error);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomPress = (room) => {
    navigation.navigate("Room", { room });
  };

  return (
    <View>
      <Text style={{ fontWeight: "bold", fontSize: 25, margin: 10 }}>
        Danh sách phòng ban
      </Text>
      <View style={styles.container}>
        {rooms.map((room) => (
          <TouchableOpacity
            key={room.id}
            style={styles.item}
            onPress={() => handleRoomPress(room)}
          >
            <Icons name="list-alt" size={50} color="black" />
            <Text style={{ fontWeight: "bold" }}>{room.name}</Text>
            <Text style={{ fontWeight: 'bold' }}>Số thiết bị: {room.deviceCount}</Text>
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
