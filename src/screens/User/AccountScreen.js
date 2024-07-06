import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Button, TextInput } from "react-native-paper";
import * as Animatable from 'react-native-animatable';



const AccountScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [numPhone, setNumPhone] = useState("");
  const [passCurrent, setPassCurrent] = useState("");
  const [passNew, setPassNew] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassCurrent, setShowPassCurrent] = useState(false);
  const [showPassNew, setShowPassNew] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={{ flexDirection: "row" }}>
        <Icon name={"account-circle"} size={150} color={"#000"} />
        <View style={{ alignItems: "center", padding: 30 }}>

          <Button style={{ backgroundColor: "#1FD2BD", ...styles.btn }}>
            <Text style={styles.txt}>Lưu thông tin</Text>
          </Button>

        </View>
      </View>
      <Animatable.View animation='bounceIn' style={{ ...styles.boder4Info, padding: 15 }}>
        <Text
          style={{
            ...styles.txt,
            textDecorationLine: "underline",
            fontWeight: "bold",
          }}
        >
          Thông tin người dùng:
        </Text>
        <View style={styles.txtAndInput}>
          <Text style={{ ...styles.txt, padding: 10 }}>Họ và tên: </Text>
          <TextInput
            placeholder={"Tên người dùng"}
            value={name}
            onChangeText={setName}
            style={styles.txtInput}
            underlineColor="white"
            textColor="#000"
            placeholderTextColor={"#000"}
          />
        </View>

        <View style={styles.txtAndInput}>
          <Text style={{ ...styles.txt, padding: 10 }}>Email: </Text>
          <TextInput
            disabled
            placeholder={"Email"}
            value={email}
            onChangeText={setEmail}
            style={{ ...styles.txtInput, width: "76%" }}
            underlineColor="white"
            textColor="#000"
            placeholderTextColor={"#000"}
          />
        </View>

        <View style={styles.txtAndInput}>
          <Text style={{ ...styles.txt, padding: 10 }}>Số điện thoại: </Text>
          <TextInput
            placeholder={"Số điện thoại"}
            value={numPhone}
            onChangeText={setNumPhone}
            style={{ ...styles.txtInput, width: "56%" }}
            underlineColor="white"
            textColor="#000"
            placeholderTextColor={"#000"}
          />
        </View>
      </Animatable.View>
      <Animatable.View animation='bounceIn' style={{ ...styles.boder4Info, padding: 15 }}>
        <Text
          style={{
            ...styles.txt,
            textDecorationLine: "underline",
            fontWeight: "bold",
          }}
        >
          Đổi mật khẩu:
        </Text>
        <View style={styles.txtAndInput}>
          <Text style={{ ...styles.txt, padding: 10 }}>Mật khẩu cũ: </Text>
          <TextInput
            secureTextEntry={!showPassCurrent}
            placeholder={"Mật khẩu cũ"}
            value={passCurrent}
            onChangeText={setPassCurrent}
            style={{ ...styles.txtInput, width: "60%" }}
            underlineColor="white"
            textColor="#000"
            placeholderTextColor={"#000"}
          />
          <TouchableOpacity
            onPress={() => setShowPassCurrent(!showPassCurrent)}
            style={styles.iconStyle}
          >
            <Icon
              name={showPassCurrent ? "visibility" : "visibility-off"}
              size={24}
              color={"#000"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.txtAndInput}>
          <Text style={{ ...styles.txt, padding: 10 }}>Mật khẩu mới: </Text>
          <TextInput
            secureTextEntry={!showPassNew}
            placeholder={"Mật khẩu mới"}
            value={passNew}
            onChangeText={setPassNew}
            style={{ ...styles.txtInput, width: "56%" }}
            underlineColor="white"
            textColor="#000"
            placeholderTextColor={"#000"}
          />
          <TouchableOpacity
            onPress={() => setShowPassNew(!showPassNew)}
            style={styles.iconStyle}
          >
            <Icon
              name={showPassNew ? "visibility" : "visibility-off"}
              size={24}
              color={"#000"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.txtAndInput}>
          <Text style={{ ...styles.txt, padding: 10 }}>Nhập lại pass: </Text>
          <TextInput
            secureTextEntry={!showPassConfirm}
            placeholder={"Nhập lại mật khẩu"}
            value={confirmPass}
            onChangeText={setConfirmPass}
            style={{ ...styles.txtInput, width: "56%" }}
            underlineColor="white"
            textColor="#000"
            placeholderTextColor={"#000"}
          />
          <TouchableOpacity
            onPress={() => setShowPassConfirm(!showPassConfirm)}
            style={styles.iconStyle}
          >
            <Icon
              name={showPassConfirm ? "visibility" : "visibility-off"}
              size={24}
              color={"#000"}
            />
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  boder4Info: {
    borderRadius: 30,
    borderWidth: 1,
    marginHorizontal: 10,
    marginVertical: 10,
  },
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
    width: "65%",
    borderWidth: 1,
    marginBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },

  txtAndInput: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  iconStyle: {
    position: "absolute",
    right: 10,
    top: 12,
  },
});