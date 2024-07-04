import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Button, TextInput } from "react-native-paper";
import DatePicker from "react-native-date-picker";

const AddEmployeeScreen = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [room, setRoom] = useState("");
  const [email, setEmail] = useState("");
  const [numPhone, setNumPhone] = useState("");
  const [role, setRole] = useState("Staff");
  const [password, setPassword] = useState("");
  const [datetime, setDatetime] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={{ alignItems: "center" }}>
        <Icon name={"account-circle"} size={150} color={"#000"} />
      </View>
      <View style={{ margin: 20 }}>
        <View style={styles.txtAndInput}>
          <Text style={styles.txt}>Tên nhân viên: </Text>
          <TextInput
            placeholder={"Tên nhân viên"}
            value={name}
            onChangeText={setName}
            style={styles.txtInput}
            underlineColor="white"
            textColor="#000"
            placeholderTextColor={"#000"}
          />
        </View>
        <View style={styles.txtAndInput}>
          <Text style={styles.txt}>Mã nhân viên: </Text>
          <TextInput
            placeholder={"Mã nhân viên"}
            value={id}
            onChangeText={setId}
            style={styles.txtInput}
            underlineColor="white"
            textColor="#000"
            placeholderTextColor={"#000"}
          />
        </View>
        <View style={styles.txtAndInput}>
          <Text style={styles.txt}>Phòng ban: </Text>
          <TextInput
            placeholder={"Phòng ban"}
            value={room}
            onChangeText={setRoom}
            style={styles.txtInput}
            underlineColor="white"
            textColor="#000"
            placeholderTextColor={"#000"}
          />
        </View>
        <View style={styles.txtAndInput}>
          <Text style={styles.txt}>Email: </Text>
          <TextInput
            placeholder={"Email"}
            value={email}
            onChangeText={setEmail}
            style={styles.txtInput}
            underlineColor="white"
            textColor="#000"
            placeholderTextColor={"#000"}
          />
        </View>
        <View style={styles.txtAndInput}>
          <Text style={styles.txt}>Số điện thoại: </Text>
          <TextInput
            placeholder={"Số điện thoại"}
            value={numPhone}
            onChangeText={setNumPhone}
            keyboardType="numeric"
            style={styles.txtInput}
            underlineColor="white"
            textColor="#000"
            placeholderTextColor={"#000"}
          />
        </View>
        <View style={styles.txtAndInput}>
          <Text style={styles.txt}>Ngày sinh: </Text>
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={styles.datePickerButton}
          >
            <Text style={{ fontSize: 18, color: "#000" }}>
              {datetime.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          <DatePicker
            modal
            mode="date"
            open={open}
            date={datetime}
            onConfirm={(date) => {
              setOpen(false);
              setDatetime(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </View>
        <View style={styles.txtAndInput}>
          <Text style={styles.txt}>Vai trò: </Text>
          <TextInput
            placeholder={"Vai trò"}
            value={role}
            onChangeText={setRole}
            style={styles.txtInput}
            underlineColor="white"
            textColor="#000"
            placeholderTextColor={"#000"}
          />
        </View>
        <View style={styles.txtAndInput}>
          <Text style={styles.txt}>Mật khẩu: </Text>
          <TextInput
            secureTextEntry={!showPass}
            placeholder={"Mật khẩu"}
            value={password}
            onChangeText={setPassword}
            style={styles.txtInput}
            underlineColor="white"
            textColor="#000"
            placeholderTextColor={"#000"}
          />
          <TouchableOpacity
            onPress={() => setShowPass(!showPass)}
            style={styles.iconStyle}
          >
            <Icon
              name={showPass ? "visibility" : "visibility-off"}
              size={24}
              color={"#000"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ alignItems: "center" }}>
        <Button
          style={{ backgroundColor: "#1FD2BD", ...styles.btn }}
          onPress={() => console.log("Touched Button")}
        >
          <Text style={styles.txt}>Lưu thông tin</Text>
        </Button>
      </View>
    </View>
  );
};

export default AddEmployeeScreen;

const styles = StyleSheet.create({
  txt: {
    color: "#000",
    fontSize: 18,
  },
  btn: {
    borderRadius: 5,
    width: 200,
    marginBottom: 10,
  },
  txtInput: {
    backgroundColor: null,
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 40,
    flex: 1,
    borderWidth: 1,
    marginBottom: 10,
  },
  txtAndInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  datePickerButton: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 5,
  },
  iconStyle: {
    position: "absolute",
    right: 15,
    top: 12,
  },
});