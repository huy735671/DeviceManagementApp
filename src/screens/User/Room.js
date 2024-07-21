import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import Icons from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

const Room = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { room } = route.params;
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const devicesSnapshot = await firestore()
          .collection("DEVICES")
          .where("roomId", "==", room.id)
          .get();

        const devicesData = devicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDevices(devicesData);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();

    // Clean up function for useEffect
    return () => {};
  }, [room]);  // Add room to dependencies array

  const handleDevicePress = (item) => {
    //navigation.navigate("InfoDevices", { device });
    navigation.navigate("InfoDevices", {
      id: item.id,
      icon: item.icon,
      name: item.name,
      status: item.operationalStatus,
      type: item.deviceType,
      assetType: item.assetType,
      brand: item.brand,
      model: item.model,
      supplier: item.supplier,
      price: item.price,
      purchaseDate: item.datetime,
      warrantyPeriod: item.warrantyEndDate,
      operationalStatus: item.operationalStatus,
      deploymentDate: item.deploymentDate,
    });
  };

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

  return (
    <View style={styles.container}>
      
      
      <Text style={styles.title}> {room.name}</Text>

      <Animated.View animation='zoomIn' style={styles.content}>
        {devices.map((device) => (
          <TouchableOpacity
            key={device.id}
            onPress={() => handleDevicePress(device)}
            style={styles.item}
          >
            <Icons name="devices" size={50} color="black" />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontWeight: 'bold', fontSize:18}}>Thiết bị: {device.name}</Text>
              <Text style={{ color: getStatusColor(device.operationalStatus), fontWeight: 'bold', }}>Trạng thái: {device.operationalStatus}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

export default Room;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop:10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
});
