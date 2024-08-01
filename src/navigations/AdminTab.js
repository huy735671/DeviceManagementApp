import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../screens/Admin/DashboardScreen";
import AccountScreen from "../screens/User/AccountScreen";
import Icon from "react-native-vector-icons/MaterialIcons";
import Notification from "../screens/Admin/Notification";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const AdminTab = () => {
  const navigation = useNavigation();
  const [isAdmin] = useState();
  const AddDeviceHandler = () => {
    navigation.navigate("AddDevice");
  };
  const SearchHandler = () => {
    navigation.navigate("SearchBar");
  };

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={({ navigation }) => ({
          headerStyle: {
            backgroundColor: "#1CD2BD",
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" color={color} size={size} />
          ),
          headerTitle: "QUẢN LÝ THIẾT BỊ",
          headerRight: () => (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => alert("Search icon pressed")}>
                <MaterialIcons
                  name="search"
                  size={25}
                  color="white"
                  style={{ marginRight: 15 }}
                  onPress={SearchHandler}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("AddScreen")}
              >
                <MaterialIcons
                  name="add-circle"
                  size={25}
                  color="white"
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" color={color} size={size} />
          ),
          headerTitle: "QUẢN LÝ THIẾT BỊ",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1CD2BD",
          },
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={({ navigation }) => ({
          headerStyle: {
            backgroundColor: "#1CD2BD",
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
          headerTitle: "QUẢN LÝ THIẾT BỊ",
          headerRight: () => (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => alert("Search icon pressed")}>
                <Icon
                  name="search"
                  size={25}
                  color="white"
                  style={{ marginRight: 15 }}
                  onPress={SearchHandler}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("AddScreen")}
              >
                <Icon
                  name="add-circle"
                  size={25}
                  color="white"
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                <Icon
                  name="settings"
                  size={25}
                  color="white"
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
    </Tab.Navigator>
  );
};

export default AdminTab;
