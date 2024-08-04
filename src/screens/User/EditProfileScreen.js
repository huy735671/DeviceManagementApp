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
  const [showChangePassword, setShowChangePassword] = useState(false);

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
  
      const userDataUpdate = {};
  
      if (imageSource) {
        const downloadURL = await uploadImageToFirebase(imageSource.uri, imageName);
        userDataUpdate.avatarUrl = downloadURL;
      }
  
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
          { text: "OK", onPress: () => navigation.goBack() }, 
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
        setIsEdited(true);
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert('Lỗi', 'Đã xảy ra lỗi khi chọn ảnh từ thư viện.');
      } else {
        console.log('User cancelled image picker');
      }
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FFF", }}>
        <View style={{ alignItems: "center", padding: 30,borderRadius:10, borderWidth:1, marginHorizontal:10, marginVertical:10, borderColor:'#ddd' }}>
          {imageSource || imageUri ? (
            <Image
              source={imageSource || { uri: imageUri }}
              style={{ width: 200, height: 150, borderRadius: 75, marginBottom: 10 }}
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Họ và tên:</Text>
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email: </Text>
            <TextInput
              disabled
              placeholder={user ? user.email : "Không có email"}
              value={email}
              onChangeText={handleInputChange(setEmail)}
              style={styles.txtInput}
              underlineColor="white"
              textColor="#000"
              placeholderTextColor={"#000"}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Số điện thoại: </Text>
            <TextInput
              placeholder={numPhone}
              value={numPhone}
              onChangeText={handleInputChange(setNumPhone)}
              style={styles.txtInput}
              underlineColor="white"
              textColor="#000"
              placeholderTextColor={"#000"}
            />
          </View>
        </Animatable.View>

        <TouchableOpacity onPress={() => setShowChangePassword(!showChangePassword)}>
          <Text style={{ ...styles.txt, textDecorationLine: "underline", fontWeight: "bold", marginTop: 15, marginLeft:10, }}>
            Đổi mật khẩu
          </Text>
        </TouchableOpacity>

        {showChangePassword && (
          <Animatable.View animation="bounceIn" style={{ ...styles.boder4Info, padding: 15 }}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mật khẩu cũ: </Text>
              <TextInput
                secureTextEntry={!showPassCurrent}
                placeholder={"Mật khẩu cũ"}
                value={passCurrent}
                onChangeText={handleInputChange(setPassCurrent)}
                style={styles.txtInput}
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

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mật khẩu mới: </Text>
              <TextInput
                secureTextEntry={!showPassNew}
                placeholder={"Mật khẩu mới"}
                value={passNew}
                onChangeText={handleInputChange(setPassNew)}
                style={styles.txtInput}
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

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nhập lại mật khẩu mới: </Text>
              <TextInput
                secureTextEntry={!showPassConfirm}
                placeholder={"Nhập lại mật khẩu mới"}
                value={confirmPass}
                onChangeText={handleInputChange(setConfirmPass)}
                style={styles.txtInput}
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
        )}
      </ScrollView>
      {isEdited && (
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Lưu thông tin</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  boder4Info: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "#FFF",
    marginHorizontal:10,
    borderColor:'#ddd',
    
  },
  label: {
    fontSize: 18,
    color: "#000",
    fontWeight: 'bold',
    marginBottom: 5,
  },
  txtInput: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  iconStyle: {
    position: "absolute",
    right: 10,
    top: 50,
  },
  editAvatar: {
    marginTop: 10,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
  },
  editAvatarText: {
    color: "#FFF",
  },
  saveButton: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#007BFF",
    padding: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
