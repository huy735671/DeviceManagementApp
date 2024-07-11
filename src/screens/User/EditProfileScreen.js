import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Button, TextInput } from "react-native-paper";
import * as Animatable from 'react-native-animatable';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const EditProfileScreen = ({ navigation }) => { // Thêm navigation như một prop
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [numPhone, setNumPhone] = useState("");
  const [passCurrent, setPassCurrent] = useState("");
  const [passNew, setPassNew] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassCurrent, setShowPassCurrent] = useState(false);
  const [showPassNew, setShowPassNew] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);
  const [user, setUser] = useState(null);
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        setEmail(user.email);
        setName(user.displayName);
        try {
          const userDoc = await firestore().collection('USERS').doc(user.email).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setNumPhone(userData.phone || '');
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      } else {
        setUser(null);
      }
    });

    return unsubscribe; 
  }, []);

  const handleSave = async () => {
    if (passNew !== confirmPass) {
      Alert.alert("Lỗi", "Mật khẩu mới và nhập lại mật khẩu không trùng khớp.");
      return;
    }

    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        Alert.alert("Lỗi", "Không thể xác thực người dùng.");
        return;
      }

      // Xác thực lại người dùng bằng mật khẩu hiện tại
      const credential = auth.EmailAuthProvider.credential(
        currentUser.email,
        passCurrent
      );

      await currentUser.reauthenticateWithCredential(credential);

      // Cập nhật mật khẩu mới trên Firebase Authentication
      await currentUser.updatePassword(passNew);

      // Cập nhật thông tin khác trên Firestore
      await firestore().collection('USERS').doc(currentUser.email).update({
        username: name,
        phone: numPhone,
      });

      Alert.alert("Thành công", "Mật khẩu và thông tin người dùng đã được cập nhật thành công.", [
        { text: "OK", onPress: () => navigation.goBack() } // Quay lại trang trước đó sau khi nhấn OK
      ]);
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        Alert.alert("Lỗi", "Mật khẩu cũ không chính xác.");
      } else if (error.code === 'auth/invalid-credential') {
        Alert.alert("Lỗi", "Credential không hợp lệ hoặc đã hết hạn.");
      } else if (error.code === 'auth/user-mismatch') {
        Alert.alert("Lỗi", "Thông tin người dùng không khớp.");
      } else {
        Alert.alert("Lỗi", error.message);
      }
    }
  };

  const handleInputChange = (setter) => (value) => {
    setter(value);
    setIsEdited(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={{ flexDirection: "row" }}>
        <Icon name={"account-circle"} size={150} color={"#000"} />
        <View style={{ alignItems: "center", padding: 30 }}>
          <Button
            style={{ backgroundColor: isEdited ? "#1FD2BD" : "#CCC", ...styles.btn }}
            onPress={handleSave}
            disabled={!isEdited}
          >
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
          <Text style={{ ...styles.txt, padding: 10 }}>Họ và tên:</Text>
          <TextInput
            placeholder={user ? user.displayName : 'NaN'}
            value={name}
            onChangeText={handleInputChange(setName)}
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
            placeholder={user ? user.email : 'NaN'}
            value={email}
            onChangeText={handleInputChange(setEmail)}
            style={{ ...styles.txtInput, width: "76%" }}
            underlineColor="white"
            textColor="#000"
            placeholderTextColor={"#000"}
          />
        </View>

        <View style={styles.txtAndInput}>
          <Text style={{ ...styles.txt, padding: 10 }}>Số điện thoại: </Text>
          <TextInput
            placeholder={numPhone}
            value={numPhone}
            onChangeText={handleInputChange(setNumPhone)}
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
            onChangeText={handleInputChange(setPassCurrent)}
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
            onChangeText={handleInputChange(setPassNew)}
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
            onChangeText={handleInputChange(setConfirmPass)}
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

export default EditProfileScreen;

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
    paddingHorizontal:10,
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
