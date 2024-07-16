import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Animatable from 'react-native-animatable';
import firestore from '@react-native-firebase/firestore';

const DashboardScreen = ({ navigation }) => {
  const [numColumns, setNumColumns] = useState(2);
  const [selectedFeatureId, setSelectedFeatureId] = useState("1");
  const [devices, setDevices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [maintenance, setMaintenance] = useState([]);

  useEffect(() => {
    const unsubscribeDevices = firestore()
      .collection('DEVICES')
      .onSnapshot(snapshot => {
        const devicesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          featureId: "1", // Example: Assign featureId based on document type
          icon: doc.data().icon, // Assume icon field exists in your Firestore document
        }));
        setDevices(devicesData);
      });

    const unsubscribeEmployees = firestore()
      .collection('EMPLOYEES')
      .onSnapshot(snapshot => {
        const employeesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          featureId: "2", // Example: Assign featureId based on document type
          icon: doc.data().icon, // Assume icon field exists in your Firestore document
        }));
        setEmployees(employeesData);
      });

    const unsubscribeRooms = firestore()
      .collection('ROOMS')
      .onSnapshot(snapshot => {
        const roomsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          featureId: "3", // Example: Assign featureId based on document type
          icon: doc.data().icon, // Assume icon field exists in your Firestore document
        }));
        setRooms(roomsData);
      });

    // Add similar listeners for maintenance data if needed

    return () => {
      unsubscribeDevices();
      unsubscribeEmployees();
      unsubscribeRooms();
      // Clean up maintenance listeners if added
    };
  }, []);

  const featuresData = [
    { id: "1", title: "Tất cả", icon: "menu" },
    { id: "2", title: "Nhân viên", icon: "group" },
    { id: "3", title: "Phòng ban", icon: "groups" },
    { id: "4", title: "Bảo trì", icon: "settings" },
    { id: "5", title: "Thống kê", icon: "insert-chart-outlined" },
    // Add more items as needed
  ];

  const handleFeaturePress = (featureId) => {
    setSelectedFeatureId(featureId);
  };

  const handleDetailPress = (item) => {
    if (item.featureId === "1") {
      navigation.navigate("DevicesDetail", {
        icon: item.icon,
        name: item.name,
        status: item.status,
      });
    }
    if (item.featureId === "2") {
      navigation.navigate('EmployeeDetail', {
        name: item.name,
        employeeId: item.id,
        department: item.roomId, // Assuming roomId is used as department
        phoneNumber: item.numPhone,
      });
    };
    if (item.featureId === "3") {
      navigation.navigate("RoomScreen", { roomId: item.id, roomName: item.name });
    }
    if (item.featureId === "4") {
      navigation.navigate("MaintenanceDetail", {
        icon: item.icon,
        name: item.name,
      });
    }
  };

  const renderDetailItem = ({ item }) => {
    return (
      <Animatable.View animation='zoomIn' style={styles.items}>
        <TouchableOpacity
          style={styles.btn4FlstUnder}
          onPress={() => handleDetailPress(item)}
        >
          <Icon name={item.icon} size={40} color={"#000"} />
          <Text style={styles.txtFearture}>{item.name}</Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  const deleteDeviceFromState = (deviceId) => {
    setDevices(prevDevices => prevDevices.filter(device => device.id !== deviceId));
  };

  const filteredData = [
    ...devices.filter(item => item.featureId === selectedFeatureId),
    ...employees.filter(item => item.featureId === selectedFeatureId),
    ...rooms.filter(item => item.featureId === selectedFeatureId),
    ...maintenance.filter(item => item.featureId === selectedFeatureId),
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.txt}>Các chức năng quản lý</Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollViewContent}
        showsHorizontalScrollIndicator={false}
      >
        {featuresData.map((item) => (
          <Animatable.View
            key={item.id}
            animation='zoomIn'
            style={styles.itemContainer}
          >
            <TouchableOpacity
              style={styles.btnFearture}
              onPress={() => handleFeaturePress(item.id)}
            >
              <Icon name={item.icon} size={40} color={"#000"} />
            </TouchableOpacity>
            <Text style={styles.txtFearture}>{item.title}</Text>
          </Animatable.View>
        ))}
      </ScrollView>

      <FlatList
        data={filteredData}
        renderItem={renderDetailItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
    backgroundColor: "#FFF",
    paddingHorizontal: 10,
  },
  txt: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  scrollViewContent: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  itemContainer: {
    alignItems: "center",
    marginRight: 20,
  },
  btnFearture: {
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  txtFearture: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  items: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
  },
  btn4FlstUnder: {
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default DashboardScreen;
