import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, ScrollView, TextInput } from "react-native";
import Icons from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

const Room = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { room } = route.params;
  const [devices, setDevices] = useState([]);
  const [allDevices, setAllDevices] = useState([]);
  const [deviceCounts, setDeviceCounts] = useState({ total: 0, active: 0, maintenance: 0, inactive: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

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

      devicesData.sort((a, b) => {
        const statusOrder = { maintenance: 1, inactive: 2, active: 3 };
        return statusOrder[a.operationalStatus] - statusOrder[b.operationalStatus];
      });

      setAllDevices(devicesData);
      filterDevices(devicesData);

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

  useEffect(() => {
    fetchDevices();
  }, [room]);

  const filterDevices = (devicesData) => {
    let filteredDevices = devicesData;

    if (searchQuery.trim() !== "") {
      filteredDevices = filteredDevices.filter(device =>
        device.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filteredDevices = filteredDevices.filter(device => device.operationalStatus === selectedStatus);
    }

    setDevices(filteredDevices);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    filterDevices(allDevices);
  };

  const clearSearch = () => {
    setSearchQuery("");
    filterDevices(allDevices);
  };

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
      roomName: item.roomName,
    });
  };

  const handleStatusPress = (status) => {
    setSelectedStatus(status);
    filterDevices(allDevices);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#d4edda"; // màu xanh nhạt cho trạng thái active
      case "maintenance":
        return "#fff3cd"; // màu vàng nhạt cho trạng thái maintenance
      case "inactive":
        return "#f8d7da"; // màu đỏ nhạt cho trạng thái inactive
      default:
        return "#e2e3e5"; // màu xám nhạt cho trạng thái khác
    }
  };

  const statusLabels = {
    active: "Bình thường",
    maintenance: "Đang Bảo trì",
    inactive: "Hư hỏng",
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>{room.name}</Text>
        <View style={styles.infoContainer}>


        <TouchableOpacity
            style={[styles.infoBox, { backgroundColor: "#e2e3e5" }]}
            onPress={() => handleStatusPress("all")}
          >
            <Text style={styles.infoLabel}>Tổng số thiết bị</Text>
            <Text style={styles.infoValue}>{deviceCounts.total}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.infoBox, { backgroundColor: getStatusColor("active") }]}
            onPress={() => handleStatusPress("active")}
          >
            <Text style={styles.infoLabel}>Bình thường</Text>
            <Text style={styles.infoValue}>{deviceCounts.active}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.infoBox, { backgroundColor: getStatusColor("maintenance") }]}
            onPress={() => handleStatusPress("maintenance")}
          >
            <Text style={styles.infoLabel}>Đang bảo trì</Text>
            <Text style={styles.infoValue}>{deviceCounts.maintenance}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.infoBox, { backgroundColor: getStatusColor("inactive") }]}
            onPress={() => handleStatusPress("inactive")}
          >
            <Text style={styles.infoLabel}>Hư hỏng</Text>
            <Text style={styles.infoValue}>{deviceCounts.inactive}</Text>
          </TouchableOpacity>

          
          
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm thiết bị"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Icons name="close" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <Animated.View animation="zoomIn" style={styles.content}>
          {devices.length === 0 ? (
            <View style={styles.noDevicesContainer}>
              <Text style={styles.noDevicesText}>Không có thiết bị nào trong phòng này.</Text>
            </View>
          ) : (
            devices.map((device) => (
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
            ))
          )}
        </Animated.View>
      </View>
    </ScrollView>
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 2,
  },
  infoBox: {
    width: '48%',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    backgroundColor: '#fff',
  },
  clearButton: {
    marginLeft: 10,
    padding: 10,
  },
  content: {
    flex: 1,
    width: '100%',
    padding: 10,
  },
  noDevicesContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  noDevicesText: {
    fontSize: 18,
    color: '#6c757d',
  },
  item: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  deviceImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  deviceStatus: {
    fontSize: 14,
    color: '#6c757d',
  },
});
