import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Animatable from 'react-native-animatable';
import firestore from '@react-native-firebase/firestore';
import Modal from 'react-native-modal';

const { width } = Dimensions.get('window'); // Get screen width for responsive layout

const DashboardScreen = ({ navigation }) => {
  const [numColumns, setNumColumns] = useState(2);
  const [selectedFeatureId, setSelectedFeatureId] = useState("1");
  const [devices, setDevices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [totalRooms, setTotalRooms] = useState(0);
  const [totalDevices, setTotalDevices] = useState(0);

  useEffect(() => {
    const unsubscribeRooms = firestore()
      .collection('ROOMS')
      .onSnapshot(snapshot => {
        const roomsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          featureId: "1",
          icon: doc.data().icon,
        }));
        setRooms(roomsData);
        setTotalRooms(snapshot.size);
      });

    const unsubscribeMaintenance = firestore()
      .collection('DEVICES')
      .where('operationalStatus', '==', 'maintenance')
      .onSnapshot(snapshot => {
        const maintenanceData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          featureId: "2",
          icon: doc.data().icon,
        }));
        setMaintenance(maintenanceData);
      });

    const unsubscribeDevices = firestore()
      .collection('DEVICES')
      .onSnapshot(snapshot => {
        setTotalDevices(snapshot.size);
      });

    return () => {
      unsubscribeRooms();
      unsubscribeMaintenance();
      unsubscribeDevices();
    };
  }, []);

  const featuresData = [
    { id: "1", title: "Tất cả", icon: "menu" },
    { id: "2", title: "Bảo trì", icon: "settings" },
    { id: "3", title: "Thống kê", icon: "insert-chart-outlined" },
    { id: "4", title: "Banner", icon: "insert-chart-outlined" }, // Mục Banner
  ];

  const handleFeaturePress = (featureId) => {
    if (featureId === "4") {
      navigation.navigate("Banner");
    } else {
      setSelectedFeatureId(featureId);
    }
  };

  const handleDetailPress = async (item) => {
    if (item.featureId === "1") {
      setSelectedRoom(item);
      setModalVisible(true);

      // Fetch employees and devices counts for the selected room
      const employeeSnapshot = await firestore()
        .collection('EMPLOYEES')
        .where('roomId', '==', item.id)
        .get();
      const deviceSnapshot = await firestore()
        .collection('DEVICES')
        .where('roomId', '==', item.id)
        .get();

      setEmployees(employeeSnapshot.size);
      setDevices(deviceSnapshot.size);
      
    } else if (item.featureId === "2") {
      try {
        const deviceSnapshot = await firestore()
          .collection('DEVICES')
          .doc(item.id)
          .get();

        if (deviceSnapshot.exists) {
          const deviceData = deviceSnapshot.data();
          navigation.navigate("MaintenanceDetail", {
            id: deviceData.id || '',
            icon: deviceData.icon || '',
            name: deviceData.name || '',
            deviceType: deviceData.deviceType || '',
            brand: deviceData.brand || '',
            supplier: deviceData.supplier || '',
            deploymentDate: deviceData.deploymentDate || new Date(),
            warrantyEndDate: deviceData.warrantyEndDate || new Date(),
            operationalStatus: deviceData.operationalStatus || '',
            image: deviceData.image || '',
            roomId: deviceData.roomId || 0,
            roomName: deviceData.roomName || '',
          });
        } else {
          console.log('Device document does not exist');
        }
      } catch (error) {
        console.error('Error fetching device data:', error);
      }
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

  const renderStatistics = () => {
    return (
      <View style={styles.statisticsContainer}>
        <View style={styles.statisticsItem}>
          <Icon name="room" size={40} color={"#000"} />
          <Text style={styles.statisticsText}>Tổng số phòng: {totalRooms}</Text>
        </View>
        <View style={styles.statisticsItem}>
          <Icon name="devices" size={40} color={"#000"} />
          <Text style={styles.statisticsText}>Tổng số thiết bị: {totalDevices}</Text>
        </View>
      </View>
    );
  };

  const filteredData = selectedFeatureId === "1" ? rooms : maintenance;

  return (
    <View style={styles.container}>
      <Text style={styles.txt}>Các chức năng quản lý</Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.horizontalScrollView}
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

      {selectedFeatureId === "3" ? (
        renderStatistics()
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderDetailItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
        />
      )}

      <Modal 
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedRoom?.name}</Text>
          <Text style={styles.modalText}>Số nhân viên: {employees}</Text>
          <Text style={styles.modalText}>Số thiết bị: {devices}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("ListEmployee", {
                   roomId: selectedRoom?.id
                });
              }}
            >
              <Text style={styles.modalButtonText}>Nhân viên</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("ListDevices", { roomId: selectedRoom?.id });
              }}
            >
              <Text style={styles.modalButtonText}>Thiết bị</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 10,
  },
  txt: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  horizontalScrollView: {
    flexDirection: "row",
    paddingVertical: 10,
    marginBottom: 10,
  },
  itemContainer: {
    alignItems: "center",
    marginRight: 20,
  },
  btnFearture: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  txtFearture: {
    fontSize: 12,
    textAlign: "center",
  },
  items: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    margin: 5,
    borderRadius: 10,
    backgroundColor: "#f1f1f1",
  },
  btn4FlstUnder: {
    alignItems: "center",
    justifyContent: "center",
  },
  statisticsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  statisticsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statisticsText: {
    fontSize: 16,
    marginLeft: 10,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#dc3545',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
  },
});

export default DashboardScreen;
