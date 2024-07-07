import {
  View,
  Text,
  Touchable,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";

const RoomScreen = ({ navigation }) => {
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
  ];

  const handleDetailPress = (item) => {
    navigation.navigate("DevicesDetail", {
      icon: item.icon,
      name: item.name,
      status: item.status,
    });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ ...styles.itemContainer }}>
        <TouchableOpacity
          style={styles.btn4FlstUnder}
          onPress={() => handleDetailPress(item)}
        >
          <Icon name={item.icon} size={60} color={"#000"} />
          <View style={{ flexDirection: "column", marginLeft: 20 }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.txtFearture}>Tên thiết bị: </Text>
              <Text style={{ ...styles.txtFearture, fontWeight: "0" }}>
                {item.name}
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={styles.txtFearture}>Trạng thái: </Text>
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
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
      }}
    >
      <FlatList
        data={allData}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default RoomScreen;

const styles = StyleSheet.create({
  txtFearture: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
    marginTop: 5,
  },
  btn4FlstUnder: {
    borderRadius: 10,
    borderWidth: 2,
    padding: 10,
    marginTop: 10,
    flexDirection: "row",
  },
  itemContainer: {
    marginHorizontal: 10,
  },
});