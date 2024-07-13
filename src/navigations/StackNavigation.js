import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPassword from '../screens/ForgotPassword';
import Room from '../screens/User/Room';
import RoomList from '../components/RoomList';
import AddDeviceScreen from '../screens/Admin/AddDeviceScreen';
import AddEmployeeScreen from '../screens/Admin/AddEmployeeScreen';
import AddScreen from '../screens/Admin/AddScreen';
import RoomScreen from '../screens/Admin/RoomScreen';
import DevicesDetail from '../screens/Admin/DevicesDetail';
import EmployeeDetail from '../screens/Admin/EmployeeDetail';
import MaintenanceDetail from '../screens/Admin/MaintenanceDetail';
import EditProfileScreen from '../screens/User/EditProfileScreen';
import InfoDevices from '../screens/User/InfoDevices';
import ReportScreen from '../screens/User/ReportScreen';
import SearchBar from '../components/SearchBar';
import DashboardScreen from '../screens/Admin/DashboardScreen';
import HomeScreen from '../screens/User/HomeScreen';
import AdminTab from './AdminTab';
import UserTab from './UserTab';
import AddRoom from '../screens/Admin/AddRoom';
import EditDeviceScreen from '../screens/Admin/EditDeviceScreen';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName='Splash' screenOptions={{
      headerShown: false,
    }}>

      <Stack.Screen name='SignIn' component={SignInScreen} />
      <Stack.Screen name='SignUp' component={SignUpScreen} />
      <Stack.Screen name='AdminTab' component={AdminTab} />
      <Stack.Screen name='UserTab' component={UserTab} />
      <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
      <Stack.Screen name='Room' component={Room} options={{ headerShown: false }} />
      <Stack.Screen name='Dashboard' component={DashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name='RoomList' component={RoomList} options={{ headerShown: false }} />
      <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name='EditDevice' component={EditDeviceScreen} options={{ headerShown: false }} />
      <Stack.Screen name='AddRoom' component={AddRoom} options={{ headerShown: false }} />
      <Stack.Screen
        name="AddDevice"
        component={AddDeviceScreen}
        options={{
          title: "Thêm thiết bị",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1FD2BD",
          },
        }}
      />
      <Stack.Screen
        name="AddEmployee"
        component={AddEmployeeScreen}
        options={{
          title: "Thêm nhân viên",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1FD2BD",
          },
        }}
      />
      <Stack.Screen
        name="AddScreen"
        component={AddScreen}
        options={{
          title: "Thêm thiết bị/ Nhân viên",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1FD2BD",
          },
        }}
      />
      <Stack.Screen
        name="DevicesDetail"
        component={DevicesDetail}
        options={{
          title: "Thông tin thiết bị",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1FD2BD",
          },
        }}
      />
      <Stack.Screen
        name="EmployeeDetail"
        component={EmployeeDetail}
        options={{
          title: "Thông tin nhân viên",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1FD2BD",
          },
        }}
      />
      <Stack.Screen
        name="RoomScreen"
        component={RoomScreen}
        options={{
          title: "Thông tin phòng ban",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1FD2BD",
          },
        }}
      />
      <Stack.Screen
        name="MaintenanceDetail"
        component={MaintenanceDetail}
        options={{
          title: "Thông tin bảo trì",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1FD2BD",
          },
        }}
      />
      <Stack.Screen name='EditProfile'
        component={EditProfileScreen}
        options={{
          title: "Thông tin người dùng",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1FD2BD",
          },
        }}
      />
      <Stack.Screen name='InfoDevices'
        component={InfoDevices}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "#1FD2BD",
          },
        }}
      />
      <Stack.Screen name='Report'
        component={ReportScreen}
        options={{

          headerShown: false,
          headerStyle: {
            backgroundColor: "#1FD2BD",
          },
        }}
      />

      <Stack.Screen
        name="SearchBar"
        component={SearchBar}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}

export default StackNavigation