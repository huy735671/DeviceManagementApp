import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Button } from "react-native-paper";

const MaintenanceDetail = ({ route, navigation }) => {
  const { icon, name, status } = route.params;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
      }}
    >
      <View style={{ margin: 30, borderRadius: 10, borderWidth: 1 }}>
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Icon name={icon} size={100} color={"#000"} />
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              marginLeft: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={{ ...styles.txt, fontWeight: "bold" }}>
                Tên thiết bị:{" "}
              </Text>
              <Text style={styles.txt}>{name}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ ...styles.txt, fontWeight: "bold" }}>
                Tên thiết bị:{" "}
              </Text>
              <Text style={styles.txt}>NaN</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "column",
            padding: 10,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.txt, fontWeight: "bold" }}>
              Kiểu thiết bị:{" "}
            </Text>
            <Text style={styles.txt}>NaN</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.txt, fontWeight: "bold" }}>
              Loại tài sản:{" "}
            </Text>
            <Text style={styles.txt}>NaN</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.txt, fontWeight: "bold" }}>
              Thương hiệu:{" "}
            </Text>

            <Text style={styles.txt}>NaN</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.txt, fontWeight: "bold" }}>Mẫu: </Text>
            <Text style={styles.txt}>NaN</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.txt, fontWeight: "bold" }}>
              Nhà cung cấp:{" "}
            </Text>
            <Text style={styles.txt}>NaN</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.txt, fontWeight: "bold" }}>Giá: </Text>
            <Text style={styles.txt}>NaN</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.txt, fontWeight: "bold" }}>
              Ngày mua:{" "}
            </Text>
            <Text style={styles.txt}>NaN</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.txt, fontWeight: "bold" }}>
              Thời hạn bảo hành:{" "}
            </Text>
            <Text style={styles.txt}>NaN</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.txt, fontWeight: "bold" }}>
              Trạng thái hoạt động:{" "}
            </Text>
            <Text style={styles.txt}>{status}</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.txt, fontWeight: "bold" }}>
              Ngày đưa vào sử dụng:{" "}
            </Text>
            <Text style={styles.txt}>NaN</Text>
          </View>
        </View>
      </View>
      <View style={{ alignItems: "center" }}>
        <Button style={{ backgroundColor: "orange", ...styles.btn }}>
          <Text style={styles.txt}>Bảo trì thành công</Text>
        </Button>
      </View>
    </View>
  );
};

export default MaintenanceDetail;

const styles = StyleSheet.create({
  txt: {
    color: "#000",
    fontSize: 17,
  },

  btn: {
    borderRadius: 5,
    width: 200,
    marginBottom: 10,
  },
});