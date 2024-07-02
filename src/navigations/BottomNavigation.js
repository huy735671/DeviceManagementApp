import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DashboardScreen from '../screens/Admin/DashboardScreen';
import EmployeeScreen from '../screens/Admin/EmployeeScreen';
import HomeScreen from '../screens/User/HomeScreen';
import AccountScreen from '../screens/User/AccountScreen';

const Tab = createBottomTabNavigator();

const BottomNavigation = ({ route }) => {
    const { isAdmin } = route.params;

    return (
        <Tab.Navigator>
            {isAdmin ? (
                <>
                    <Tab.Screen
                        name="Dashboard"
                        component={DashboardScreen}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialIcons name="home" color={color} size={size} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Employee"
                        component={EmployeeScreen}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialIcons name="account-circle" color={color} size={size} />
                            ),
                        }}
                    />
                </>
            ) : (
                <>
                    <Tab.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="home-outline" color={color} size={size} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Account"
                        component={AccountScreen}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="person-circle-outline" color={color} size={size} />
                            ),
                        }}
                    />
                </>
            )}
        </Tab.Navigator>
    );
};

export default BottomNavigation;
