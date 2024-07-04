import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
  } from "react-native";
  import React, { useState } from "react";
  import Icon from "react-native-vector-icons/MaterialIcons";
  import { Button, TextInput } from "react-native-paper";
  import DatePicker from "react-native-date-picker";
  
  const AddDeviceScreen = () => {
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
      <ScrollView style={{ flex: 1, backgroundColor: "#FFF" }}>
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            marginTop: 10,
          }}
        >
          <Icon name={"account-circle"} size={100} color={"#000"} />
          <View style={{ flexDirection: "column" }}>
            <View
              style={{
                ...styles.txtAndInput,
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <Text style={styles.txt}>Tên thiết bị: </Text>
              <TextInput
                placeholder={"Tên nhân viên"}
                value={name}
                onChangeText={setName}
                style={{
                  backgroundColor: null,
                  borderRadius: 10,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  height: 40,
                  width: "55%",
                  borderWidth: 1,
                  marginBottom: 10,
                }}
                underlineColor="white"
                textColor="#000"
                placeholderTextColor={"#000"}
              />
            </View>
            <View style={styles.txtAndInput}>
              <Text style={styles.txt}>Số series: </Text>
              <TextInput
                placeholder={"Số series"}
                value={id}
                onChangeText={setId}
                style={{
                  backgroundColor: null,
                  borderRadius: 10,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  height: 40,
                  width: "60%",
                  borderWidth: 1,
                  marginBottom: 10,
                }}
                underlineColor="white"
                textColor="#000"
                placeholderTextColor={"#000"}
              />
            </View>
          </View>
        </View>
        <View style={{ margin: 20 }}>
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
            <Text style={styles.txt}>Kiểu thiết bi: </Text>
            <TextInput
              placeholder={"Kiểu thiết bi"}
              value={email}
              onChangeText={setEmail}
              style={styles.txtInput}
              underlineColor="white"
              textColor="#000"
              placeholderTextColor={"#000"}
            />
          </View>
  
          <View style={styles.txtAndInput}>
            <Text style={styles.txt}>Loại tài sản: </Text>
            <TextInput
              placeholder={"Loại tài sản"}
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
            <Text style={styles.txt}>Thương hiệu: </Text>
            <TextInput
              placeholder={"Thương hiệu"}
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
            <Text style={styles.txt}>Mẫu: </Text>
            <TextInput
              placeholder={"Mẫu"}
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
            <Text style={styles.txt}>Nhà cung cấp: </Text>
            <TextInput
              placeholder={"Nhà cung cấp"}
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
            <Text style={styles.txt}>Giá: </Text>
            <TextInput
              placeholder={"Giá"}
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
            <Text style={styles.txt}>Ngày mua: </Text>
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
            <Text style={styles.txt}>Thời gian bảo hành: </Text>
            <TextInput
              placeholder={"Thời gian bảo hành"}
              value={role}
              onChangeText={setRole}
              style={styles.txtInput}
              underlineColor="white"
              textColor="#000"
              placeholderTextColor={"#000"}
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
            <Text style={styles.txt}>Ngày đưa vào sử dụng: </Text>
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
        </View>
        <View style={{ alignItems: "center" }}>
          <Button
            style={{ backgroundColor: "#1FD2BD", ...styles.btn }}
            onPress={() => console.log("Touched Button")}
          >
            <Text style={styles.txt}>Lưu thông tin</Text>
          </Button>
        </View>
      </ScrollView>
    );
  };
  
  export default AddDeviceScreen;
  
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