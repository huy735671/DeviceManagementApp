import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Icons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { useMyContextController } from "../context"; // Adjust path as necessary

const RoomList = () => {
  const navigation = useNavigation();
  const [rooms, setRooms] = useState([]);

  // Access userLogin from context
  const [controller] = useMyContextController();
  const userLogin = controller.userLogin;

  useEffect(() => {
    console.log("User Login:", userLogin); // Debugging line

    if (!userLogin || !userLogin.roomId) return; // Exit if userLogin or roomId is not set

    const unsubscribe = firestore()
      .collection("ROOMS")
      .onSnapshot(async (roomsSnapshot) => {
        try {
          const roomsData = roomsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("Fetched Rooms Data:", roomsData);

          // Fetch device counts for each room
          const roomsWithDeviceCounts = await Promise.all(
            roomsData.map(async (room) => {
              const devicesSnapshot = await firestore()
                .collection("DEVICES")
                .where("roomId", "==", room.id)
                .get();

              const deviceCount = devicesSnapshot.size;
              console.log(`Room ${room.id} has ${deviceCount} devices`);
              return {
                ...room,
                deviceCount,
              };
            })
          );

          console.log("Rooms with Device Counts:", roomsWithDeviceCounts);

          // Sort rooms by status with priority
          const sortedRooms = roomsWithDeviceCounts.sort((a, b) => {
            const statusOrder = ["maintenance", "inactive", "active"];
            return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
          });

          console.log("Sorted Rooms:", sortedRooms);

          // Filter rooms to show only the one that matches the user's roomId
          const filteredRooms = sortedRooms.filter(
            (room) => room.id === userLogin.roomId
          );

          console.log("Filtered Rooms:", filteredRooms);

          setRooms(filteredRooms);
        } catch (error) {
          console.error("Error fetching rooms and device counts:", error);
        }
      });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [userLogin]);

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
            <Text style={{ fontWeight: "bold" }}>
              Số thiết bị: {room.deviceCount}
            </Text>
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
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
