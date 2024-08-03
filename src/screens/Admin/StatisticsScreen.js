import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated, ScrollView } from "react-native";
import firestore from '@react-native-firebase/firestore';

const StatisticsScreen = () => {
  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [deviceCount, setDeviceCount] = useState(0);
  const [maintenanceCount, setMaintenanceCount] = useState(0);
  const [brokenCount, setBrokenCount] = useState(0);
  const [adminList, setAdminList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [brokenList, setBrokenList] = useState([]);
  const [expanded, setExpanded] = useState(null); // State to handle expanded items

  const [expandAnim] = useState(new Animated.Value(0)); // For animation


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch admin list and count
        const adminSnapshot = await firestore().collection('USERS').where('role', '==', 'admin').get();
        const adminData = adminSnapshot.docs.map(doc => doc.data());
        setAdminList(adminData);
        setAdminCount(adminData.length);

        // Fetch user list and count
        const userSnapshot = await firestore().collection('USERS').where('role', '==', 'user').get();
        const userData = userSnapshot.docs.map(doc => doc.data());
        setUserList(userData);
        setUserCount(userData.length);

        // Fetch device list and count
        const deviceSnapshot = await firestore().collection('DEVICES').get();
        const deviceData = deviceSnapshot.docs.map(doc => doc.data());
        setDeviceList(deviceData);
        setDeviceCount(deviceData.length);

        // Fetch maintenance list and count
        const maintenanceSnapshot = await firestore().collection('DEVICES').where('operationalStatus', '==', 'maintenance').get();
        const maintenanceData = maintenanceSnapshot.docs.map(doc => doc.data());
        setMaintenanceList(maintenanceData);
        setMaintenanceCount(maintenanceData.length);

        // Fetch broken list and count
        const brokenSnapshot = await firestore().collection('DEVICES').where('operationalStatus', '==', 'broken').get();
        const brokenData = brokenSnapshot.docs.map(doc => doc.data());
        setBrokenList(brokenData);
        setBrokenCount(brokenData.length);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const handlePress = (type) => {
    setExpanded(expanded === type ? null : type); // Toggle expansion

    // Animate the expansion
    Animated.timing(expandAnim, {
      toValue: expanded === type ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const renderList = (list) => (
    <FlatList
      data={list}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>{item.name || item.username || item.email}</Text>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Thống kê</Text>

        <TouchableOpacity style={styles.button} onPress={() => handlePress("admin")}>
          <Text style={styles.buttonText}>Danh sách Admin ({adminCount})</Text>
        </TouchableOpacity>
        {expanded === "admin" && (
          <Animated.View style={[styles.expandedList, {
            height: expandAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200], // Adjust height as needed
            })
          }]}>
            {renderList(adminList)}
          </Animated.View>
        )}

        <TouchableOpacity style={styles.button} onPress={() => handlePress("user")}>
          <Text style={styles.buttonText}>Danh sách User ({userCount})</Text>
        </TouchableOpacity>
        {expanded === "user" && (
          <Animated.View style={[styles.expandedList, {
            height: expandAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200], // Adjust height as needed
            })
          }]}>
            {renderList(userList)}
          </Animated.View>
        )}

        <TouchableOpacity style={styles.button} onPress={() => handlePress("device")}>
          <Text style={styles.buttonText}>Danh sách Thiết bị ({deviceCount})</Text>
        </TouchableOpacity>
        {expanded === "device" && (
          <Animated.View style={[styles.expandedList, {
            height: expandAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200], // Adjust height as needed
            })
          }]}>
            {renderList(deviceList)}
          </Animated.View>
        )}

        <TouchableOpacity style={styles.button} onPress={() => handlePress("maintenance")}>
          <Text style={styles.buttonText}>Danh sách Thiết bị Bảo trì ({maintenanceCount})</Text>
        </TouchableOpacity>
        {expanded === "maintenance" && (
          <Animated.View style={[styles.expandedList, {
            height: expandAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200], // Adjust height as needed
            })
          }]}>
            {renderList(maintenanceList)}
          </Animated.View>
        )}

        <TouchableOpacity style={styles.button} onPress={() => handlePress("broken")}>
          <Text style={styles.buttonText}>Danh sách Thiết bị Hư hỏng ({brokenCount})</Text>
        </TouchableOpacity>
        {expanded === "broken" && (
          <Animated.View style={[styles.expandedList, {
            height: expandAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200], // Adjust height as needed
            })
          }]}>
            {renderList(brokenList)}
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  expandedList: {
    overflow: 'hidden',
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default StatisticsScreen;
