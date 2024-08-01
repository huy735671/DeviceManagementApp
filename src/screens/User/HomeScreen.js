import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Devices from "../../components/Devices";
import RoomList from "../../components/RoomList";
import { Header } from "react-native-elements";
import { useMyContextController } from "../../context";

const HomeScreen = ({ navigation }) => {
  const [controller] = useMyContextController();
  const { userLogin } = controller;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView>
        <Devices style={style.Devices} />
        <RoomList />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const style = StyleSheet.create({
  header: {
    width: "200%",
    // backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
});
