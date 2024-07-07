import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Animatable from 'react-native-animatable';

const DashboardScreen = ({ navigation }) => {
  const [numColumns, setNumColumns] = useState(2);
  const featuresData = [
    { id: "1", title: "Tất cả", icon: "menu" },
    { id: "2", title: "Nhân viên", icon: "group" },
    { id: "3", title: "Phòng ban", icon: "groups" },
    { id: "4", title: "Bảo trì", icon: "settings" },
    { id: "5", title: "Thống kê", icon: "insert-chart-outlined" },
    // Add more items as needed
  ];

  const allData = [
    {
      id: "1",
      featureId: "1",
      name: "Máy tính",
      status: "Bảo trì",
      icon: "computer",
    },
    {
      id: "2",
      featureId: "1",
      name: "Máy tính",
      status: "Hư hỏng",
      icon: "computer",
    },
    {
      id: "3",
      featureId: "1",
      name: "Máy lạnh",
      status: "Hoạt động",
      icon: "air",
    },
    {
      id: "4",
      featureId: "1",
      name: "Camera",
      status: "Bảo trì",
      icon: "camera",
    },
    { id: "5", featureId: "2", name: "Nhân viên", icon: "person" },
    { id: "6", featureId: "2", name: "Nhân viên", icon: "person" },
    { id: "7", featureId: "2", name: "Nhân viên", icon: "person" },
    { id: "8", featureId: "3", name: "Phòng ban", icon: "groups" },
    { id: "9", featureId: "3", name: "Phòng ban", icon: "groups" },
    { id: "10", featureId: "4", name: "Bảo trì", icon: "settings" },
    {
      id: "11",
      featureId: "5",
      name: "Thống kê",
      icon: "insert-chart-outlined",
    },
  ];

  const [selectedFeatureId, setSelectedFeatureId] = useState("1");

  const handleFeaturePress = (featureId) => {
    setSelectedFeatureId(featureId);
  };

  const renderItem = ({ item }) => {
    return (
      <Animatable.View animation='zoomIn' style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.btnFearture}
          onPress={() => handleFeaturePress(item.id)}
        >
          <Icon name={item.icon} size={40} color={"#000"} />
        </TouchableOpacity>
        <Text style={styles.txtFearture}>{item.title}</Text>
      </Animatable.View>
    );
  };

  const handleDetailPress = (item) => {
    if (item.featureId == 1) {
      navigation.navigate("DevicesDetail", {
        icon: item.icon,
        name: item.name,
        status: item.status,
      });
    }
    if (item.featureId == 2) {
      navigation.navigate("EmployeeDetail", {
        name: item.name,
      });
    }
    if (item.featureId == 3) {
      navigation.navigate("RoomScreen", { icon: item.icon, name: item.name });
    }
    if (item.featureId == 4) {
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
          {item.status == "Bảo trì" && (
            <Text style={{ ...styles.txtFearture, color: "orange" }}>
              {item.status}
            </Text>
          )}
          {item.status == "Hư hỏng" && (
            <Text style={{ ...styles.txtFearture, color: "red" }}>
              {item.status}
            </Text>
          )}
          {item.status == "Hoạt động" && (
            <Text style={{ ...styles.txtFearture, color: "blue" }}>
              {item.status}
            </Text>
          )}
        </TouchableOpacity>
        <Text style={styles.txtFearture}>{item.name}</Text>
      </Animatable.View>
    );
  };

  const renderStatistics = () => {
    return (
      <View
        style={{
          margin: 15,
          borderRadius: 10,
          borderWidth: 1,
          padding: 25,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Icon name={"group"} size={50} color={"#000"} />
          <Text style={styles.txt}> Tổng nhân viên: </Text>
          <Text style={{ fontSize: 20, padding: 10, color: "red" }}>
            NaN{" "}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Icon name={"devices"} size={50} color={"#000"} />
          <Text style={styles.txt}> Tổng thiết bị: </Text>
          <Text style={{ fontSize: 20, padding: 10, color: "red" }}>
            NaN{" "}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Icon name={"groups"} size={50} color={"#000"} />
          <Text style={styles.txt}> Tổng phòng ban: </Text>
          <Text style={{ fontSize: 20, padding: 10, color: "red" }}>
            NaN{" "}
          </Text>
        </View>
      </View>
    );
  };

  const filteredData = allData.filter(
    (item) => item.featureId === selectedFeatureId
  );

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.txt}>Các chức năng quản lí</Text>
        <FlatList
          horizontal
          data={featuresData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      
        <Text style={styles.txt}>Chi tiết</Text>
        {selectedFeatureId === "5" ? (
          renderStatistics()
        ) : (
          <View style={styles.secondContainer}>
          <FlatList
            numColumns={numColumns}
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={renderDetailItem}
            contentContainerStyle={styles.listContainer}
            showsHorizontalScrollIndicator={false}
          />
          </View>
        )}
     
    </View>
  );
};

export default DashboardScreen;

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  txt: {
    fontSize: 20,
    padding: 10,
    color: "#000",
    fontWeight: "bold",
  },
  listContainer: {
    // paddingHorizontal: 10,
  },
  itemContainer: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  btnFearture: {
    borderRadius: 50,
    borderWidth: 2,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btn4FlstUnder: {
    alignItems: "center",
    justifyContent: "center",
  },
  txtFearture: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
    // marginTop: 5,
    textAlign: "center",
  },
  secondContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  items: {
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
