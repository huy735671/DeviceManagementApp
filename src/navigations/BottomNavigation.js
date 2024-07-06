import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DashboardScreen from '../screens/Admin/DashboardScreen';
import HomeScreen from '../screens/User/HomeScreen';
import AccountScreen from '../screens/User/AccountScreen';
import { TouchableOpacity, View } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
const Tab = createBottomTabNavigator();

const BottomNavigation = ({ route, navigation }) => {
    const { isAdmin } = route.params;
    const AddDeviceHandler = () => {
        navigation.navigate('AddDevice');
    }
    const SearchHandler = () => {
        navigation.navigate('SearchBar');
    }

    return (
        <Tab.Navigator>
            {isAdmin ? (
                <>
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
                            headerTitle: "Device Management",
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
                                </View>
                            ),
                        })}
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
                            headerTitle: "Device Management",
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
                                </View>
                            ),
                        })}
                    />
                </>
            ) : (
                <>
                    <Tab.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialIcons name="home" color={color} size={size} />
                            ),
                            headerStyle: {
                                backgroundColor: "#1CD2BD",
                            },
                            headerTitle: "Device Management",
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

                                </View>
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Account"
                        component={AccountScreen}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialIcons name="account-circle" color={color} size={size} />
                            ),
                            headerStyle: {
                                backgroundColor: "#1CD2BD",
                            },
                            headerTitle: "Device Management",
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

                                </View>
                            ),
                        }}
                    />
                </>
            )}
        </Tab.Navigator>
    );
};

export default BottomNavigation;
