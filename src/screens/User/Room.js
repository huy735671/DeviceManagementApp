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

      setAllDevices(devicesData); // Lưu danh sách thiết bị gốc
      // Nếu ô tìm kiếm trống thì hiển thị tất cả thiết bị, nếu không thì hiển thị kết quả tìm kiếm
      if (searchQuery.trim() === "") {
        setDevices(devicesData);
      } else {
        const filteredDevices = devicesData.filter(device =>
          device.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setDevices(filteredDevices);
      }

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

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setDevices(allDevices); // Khi ô tìm kiếm trống, hiển thị tất cả thiết bị
    } else {
      const filteredDevices = allDevices.filter(device =>
        device.name.toLowerCase().includes(text.toLowerCase())
      );
      setDevices(filteredDevices);
    }
  };

  const clearSearch = () => {
    setSearchQuery(""); // Xóa văn bản tìm kiếm
    setDevices(allDevices); // Khi xóa tìm kiếm, hiển thị tất cả thiết bị
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
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Tổng số thiết bị</Text>
            <Text style={styles.infoValue}>{deviceCounts.total}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Bình thường</Text>
            <Text style={styles.infoValue}>{deviceCounts.active}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Đang bảo trì</Text>
            <Text style={styles.infoValue}>{deviceCounts.maintenance}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Hư hỏng</Text>
            <Text style={styles.infoValue}>{deviceCounts.inactive}</Text>
          </View>
        </View>

        {/* Thêm ô tìm kiếm */}
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
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    width: "95%",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderTopWidth: 5,
    borderRightWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRadius: 10,
    borderColor: '#a9a9a9',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    height: 'auto',
    elevation: 6,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: "100%",
  },
  deviceImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deviceStatus: {
    fontSize: 14,
    color: "#666",
  },
  noDevicesContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
  },
  noDevicesText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
});
