import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Button, TextInput } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import { launchImageLibrary } from "react-native-image-picker";

const EditProfileScreen = ({ navigation }) => {
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
  const [imageUri, setImageUri] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageSource, setImageSource] = useState(null);
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        setEmail(user.email);
        setName(user.displayName);
        try {
          const userDoc = await firestore()
            .collection("USERS")
            .doc(user.email)
            .get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setNumPhone(userData.phone || "");
            // setAvatar(userData.avatarUrl);
            setImageUri(userData.avatarUrl || null); 
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
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        Alert.alert("Lỗi", "Không thể xác thực người dùng.");
        return;
      }
  
      // Chuẩn bị đối tượng cập nhật thông tin người dùng
      const userDataUpdate = {};
  
      // Nếu người dùng đã chọn ảnh mới, tải ảnh lên Firebase Storage và lưu URL
      if (imageSource) {
        const downloadURL = await uploadImageToFirebase(imageSource.uri, imageName);
        userDataUpdate.avatarUrl = downloadURL;
      }
  
      // Chỉ cập nhật tên và số điện thoại nếu chúng đã được thay đổi
      if (name) {
        userDataUpdate.username = name;
      }
      if (numPhone) {
        userDataUpdate.phone = numPhone;
      }
  
      await firestore().collection("USERS").doc(currentUser.email).update(userDataUpdate);
  
      Alert.alert(
        "Thành công",
        "Thông tin người dùng đã được cập nhật thành công.",
        [
          { text: "OK", onPress: () => navigation.goBack() }, // Quay lại trang trước đó sau khi nhấn OK
        ]
      );
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };
  
  const handleInputChange = (setter) => (value) => {
    setter(value);
    setIsEdited(true);
  };

  const uploadImageToFirebase = async (localImagePath, imageName) => {
    try {
      const reference = storage().ref(`imagesUser/${imageName}`);
      await reference.putFile(localImagePath);
      const downloadURL = await reference.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image: ', error);
      throw error;
    }
  };

  const selectedImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.error && response.assets.length > 0) {
        const filePath = response.assets[0].uri;
        const parts = filePath.split('/');
        const imageName = parts[parts.length - 1];
  
        console.log('Image Info:', response.assets[0]);
        setImageSource({ uri: filePath });
        setImageName(imageName);
        setIsEdited(true); // Đánh dấu rằng đã chỉnh sửa để enable nút Lưu
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert('Lỗi', 'Đã xảy ra lỗi khi chọn ảnh từ thư viện.');
      } else {
        console.log('User cancelled image picker');
      }
    });
  };
  
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Button
        style={{ backgroundColor: isEdited ? "#1FD2BD" : "#CCC", ...styles.btn }}
        onPress={handleSave}
        disabled={!isEdited}
      >
        <Text style={styles.txt}>Lưu thông tin</Text>
      </Button>
      <View style={{ alignItems: "center", padding: 30 }}>
        {imageSource || imageUri ? (
          <Image
            source={imageSource || { uri: imageUri }}
            style={{ width: 150, height: 150, borderRadius: 75, marginBottom: 10 }}
          />
        ) : (
          <Icon name={"account-circle"} size={150} color={"#000"} />
        )}
        <TouchableOpacity onPress={selectedImage} style={styles.editAvatar}>
          <Text style={styles.editAvatarText}>Chỉnh sửa ảnh đại diện</Text>
        </TouchableOpacity>
      </View>
      <Animatable.View animation="bounceIn" style={{ ...styles.boder4Info, padding: 15 }}>
        <Text style={{ ...styles.txt, textDecorationLine: "underline", fontWeight: "bold" }}>
          Thông tin người dùng:
        </Text>
        <View style={styles.txtAndInput}>
          <Text style={{ ...styles.txt, padding: 10 }}>Họ và tên:</Text>
          <TextInput
            placeholder={user ? user.displayName : "Không có tên"}
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
            placeholder={user ? user.email : "Không có email"}
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
      <Animatable.View animation="bounceIn" style={{ ...styles.boder4Info, padding: 15 }}>
        <Text style={{ ...styles.txt, textDecorationLine: "underline", fontWeight: "bold" }}>
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
            style={{ ...styles.txtInput, width: "60%" }}
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
          <Text style={{ ...styles.txt, padding: 10 }}>Nhập lại mật khẩu: </Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  btn: {
    margin: 10,
    // marginTop: 50,
    width: 160,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  txt: {
    color: "black",
  },
  editAvatar: {
    backgroundColor: "#1FD2BD",
    padding: 10,
    borderRadius: 5,
  },
  editAvatarText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  boder4Info: {
    margin: 10,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: "#1FD2BD",
  },
  txtAndInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 5,
  },
  txtInput: {
    backgroundColor: "#FFF",
    width: "75%",
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 5,
    margin: 5,
    fontSize: 15,
  },
  iconStyle: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditProfileScreen;

