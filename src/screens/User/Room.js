import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from "react-native";
import Icons from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

const Room = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { room } = route.params;
  const [devices, setDevices] = useState([]);
  const [deviceCounts, setDeviceCounts] = useState({ total: 0, active: 0, maintenance: 0, inactive: 0 });

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

        // Sắp xếp theo trạng thái: Bảo trì -> Hư hỏng -> Bình thường
        devicesData.sort((a, b) => {
          const statusOrder = { maintenance: 1, inactive: 2, active: 3 };
          return statusOrder[a.operationalStatus] - statusOrder[b.operationalStatus];
        });

        setDevices(devicesData);

        const counts = devicesData.reduce(
          (acc, device) => {
            acc.total += 1;
            if (device.operationalStatus === "active") acc.active += 1;
            if (device.operationalStatus === "maintenance") acc.maintenance += 1;
            if (device.operationalStatus === "inactive") acc.inactive += 1;
            return acc;
          },
          { total: 0, active: 0, maintenance: 0, inactive: 0 }
        );

        setDeviceCounts(counts);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices(); 

    // Fetch devices every 10 seconds
    const intervalId = setInterval(fetchDevices, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [room]);

  const handleDevicePress = (item) => {
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
      image: item.image, 
      roomName: room.name,
    });
  };
  

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#d4edda"; // màu xanh nhạt cho trạng thái active
      case "maintenance":
        return "#f8d7da"; // màu đỏ nhạt cho trạng thái maintenance
      case "inactive":
        return "#fff3cd"; // màu vàng nhạt cho trạng thái inactive
      default:
        return "#e2e3e5"; // màu xám nhạt cho trạng thái khác
    }
  };

  const statusLabels = {
    active: "Bình thường",
    maintenance: "Bảo trì",
    inactive: "Hư hỏng",
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{room.name}</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Tổng số thiết bị:</Text>
          <Text style={styles.infoValue}>{deviceCounts.total}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Bình thường:</Text>
          <Text style={styles.infoValue}>{deviceCounts.active}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Bảo trì:</Text>
          <Text style={styles.infoValue}>{deviceCounts.maintenance}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Hư hỏng:</Text>
          <Text style={styles.infoValue}>{deviceCounts.inactive}</Text>
        </View>
      </View>
      <Animated.View animation="zoomIn" style={styles.content}>
        {devices.map((device) => (
          <TouchableOpacity
            key={device.id}
            onPress={() => handleDevicePress(device)}
            style={[styles.item, { backgroundColor: getStatusColor(device.operationalStatus) }]}
          >
            {device.image ? (
              <Image source={{ uri: device.image }} style={styles.deviceImage} />
            ) : (
              <Icons name="devices" size={50} color="black" />
            )}
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>Thiết bị: {device.name}</Text>
              <Text style={styles.deviceStatus}>Trạng thái: {statusLabels[device.operationalStatus]}</Text>
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
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#343a40",
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoBox: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  infoLabel: {
    fontSize: 14,
    color: "#6c757d",
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#343a40",
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 5,
    borderRightWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRadius: 30,
    borderColor: '#a9a9a9',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  deviceImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  deviceInfo: {
    marginLeft: 10,
  },
  deviceName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#343a40',
  },
  deviceStatus: {
    color: 'black',
    fontWeight: 'bold',
  },
});
