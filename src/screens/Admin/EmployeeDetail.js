import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Button } from "react-native-paper";

const EmployeeDetail = ({ route }) => {
  const { name } = route.params;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
      }}
    >
      <View style={styles.boder4Info}>
        <View style={{ alignItems: "center" }}>
          <Icon name={"account-circle"} size={200} color={"#000"} />
        </View>
        <View style={{ flexDirection: "column", padding: 20 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.txt, fontWeight: "bold" }}>
              Họ và tên:{" "}
            </Text>
            <Text style={styles.txt}>{name}</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.txt, fontWeight: "bold" }}>
              Mã nhân viên:{" "}
            </Text>
            <Text style={styles.txt}>NaN</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.txt, fontWeight: "bold" }}>
              Phòng ban:{" "}
            </Text>
            <Text style={styles.txt}>NaN</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...styles.txt, fontWeight: "bold" }}>
              Số điện thoại:{" "}
            </Text>
            <Text style={styles.txt}>NaN</Text>
          </View>
        </View>
      </View>
      <View style={{ alignItems: "center" }}>
        <Button style={{ backgroundColor: "#1FD2BD", ...styles.btn }}>
          <Text style={styles.txt}>Chỉnh sửa</Text>
        </Button>
        <Button style={{ backgroundColor: "red", ...styles.btn }}>
          <Text style={styles.txt}>Xóa</Text>
        </Button>
      </View>
    </View>
  );
};

export default EmployeeDetail;

const styles = StyleSheet.create({
  boder4Info: {
    borderRadius: 30,
    borderWidth: 1,
    marginHorizontal: 10,
    margin: 10,
  },
  txt: {
    color: "#000",
    fontSize: 20,
  },

  btn: {
    borderRadius: 5,
    width: 200,
    marginBottom: 10,
  },
});