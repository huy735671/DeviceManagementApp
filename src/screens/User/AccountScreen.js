import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const AccountScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);

        try {
          const userDoc = await firestore()
            .collection("USERS")
            .doc(user.email)
            .get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setAvatarUrl(userData.avatarUrl || null);
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

  const handleSignOut = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.navigate("SignIn");
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={styles.bodyContainer}>
        <View style={styles.bodyViewContainer}>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginVertical: 20,
              }}
            />
          ) : (
            <Icon
              name={"account-circle"}
              size={100}
              color={"#000"}
              style={{ marginVertical: 20 }}
            />
          )}
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              marginHorizontal: 25,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={{ ...styles.txt, fontWeight: "bold" }}>
                Họ và tên:{" "}
              </Text>
              <Text style={styles.txt}>{user ? user.displayName : "NaN"}</Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={{ ...styles.txt, fontWeight: "bold" }}>Email: </Text>
              <Text style={styles.txt}>{user ? user.email : "NaN"}</Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={{ ...styles.txt, fontWeight: "bold" }}>
                Số điện thoại:{" "}
              </Text>
              <Text style={styles.txt}>{user ? user.phone : "NaN"}</Text>
            </View>

            <Button
              style={{ backgroundColor: "#1FD2BD", ...styles.btn }}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Text style={styles.txt}>Chỉnh sửa</Text>
            </Button>

            <Button
              style={{ backgroundColor: "red", ...styles.btn }}
              onPress={handleSignOut}
            >
              <Text style={styles.txt}>Đăng xuất</Text>
            </Button>
          </View>
        </View>
      </View>

      <View style={{ marginLeft: 10, marginTop: 25 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>
          Các thiết bị đang bảo trì:
        </Text>
        <View style={styles.bodyContainer}>
          <Icon
            name={"computer"}
            size={60}
            color={"#000"}
            style={{ marginHorizontal: 10 }}
          />
          <View style={{ marginVertical: 5, alignItems: "center" }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ ...styles.txt, fontWeight: "bold" }}>Tên: </Text>
              <Text style={styles.txt}>NaN</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ ...styles.txt, fontWeight: "bold" }}>Mã: </Text>
              <Text style={styles.txt}>NaN</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  bodyContainer: {
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
  },
  bodyViewContainer: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
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
