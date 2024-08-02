import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/User/HomeScreen';
import AccountScreen from '../screens/User/AccountScreen';
import Notification from '../screens/User/Notification';





const Tab = createBottomTabNavigator();


const UserTab = ({ route, navigation }) => {


    const [isAdmin] = useState();
    const AddDeviceHandler = () => {
        navigation.navigate('AddDevice');
    }
    const SearchHandler = () => {
        navigation.navigate('SearchBar');
    }
    const NotificationHandler = () => {
        navigation.navigate('NotificationUser');
    }

    return (
        <Tab.Navigator>
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
                    headerTitle: "QUẢN LÝ THIẾT BỊ",
                    headerRight: () => (
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity onPress={SearchHandler}>
                                <Icon
                                    name="search"
                                    size={25}
                                    color="white"
                                    style={{ marginRight: 15 }}

                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={NotificationHandler}>
                                <Icon
                                    name="notifications"
                                    size={25}
                                    color="white"
                                    style={{ marginRight: 15 }}

                                />
                            </TouchableOpacity>

                        </View>
                    ),
                }}
            />
            {/* <Tab.Screen name='Notification' component={Notification}  options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="notifications" color={color} size={size} />
                ),
                headerShown:true,
                headerTitle: "QUẢN LÝ THIẾT BỊ",
                headerStyle: {
                    backgroundColor: "#1CD2BD",
                    
                },
            }}/> */}
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
                    headerTitle: "QUẢN LÝ THIẾT BỊ",
                    headerRight: () => (
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity>
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
        </Tab.Navigator>
    )
}

export default UserTab