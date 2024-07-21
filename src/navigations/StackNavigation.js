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
import ReportDevice from '../screens/Admin/ReportDevice';
import NotificationDetail from '../components/NotificationDetail';
import Settings from '../screens/Settings';
import ListEmployee from '../screens/Admin/ListEmployee';
import ListDevices from '../screens/Admin/ListDevices';

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

      <Stack.Screen name='AddRoom'
       component={AddRoom}
        options={{
          title: "Thêm phòng ban",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1FD2BD",
          },
        }} />

      <Stack.Screen name='EditDevice'
        component={EditDeviceScreen}
        options={{
          title: "Sửa thiết bị",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1FD2BD",
          },
        }} />

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
          headerShown: false,
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
          title: "Thông tin thiết bị",
          headerShown: true,
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
          title: "Tìm kiếm",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1FD2BD",
          },
        }}
      />
      <Stack.Screen
        name="ReportDevice"
        component={ReportDevice}
        options={{
          title: "Báo cáo thiết bị",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1FD2BD",
          },
        }}
      />
      <Stack.Screen
        name='NotificationDetail'
        component={NotificationDetail}
        options={{
          headerShown: true,
          headerTitle: "QUẢN LÝ THIẾT BỊ",
          headerStyle: {
            backgroundColor: "#1FD2BD",
          },
        }}
      />
      <Stack.Screen
        name='Settings'
        component={Settings}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1FD2BD",
          },
        }} />
      <Stack.Screen
        name='ListEmployee'
        component={ListEmployee}
        options={{
          headerShown: true,
          headerTitle: "QUẢN LÝ NHÂN VIÊN",
          headerStyle: {
            backgroundColor: "#1FD2BD",
          },
        }}
      />
      <Stack.Screen name='ListDevices'
        component={ListDevices}
        options={{
          headerShown: true,
          headerTitle: "QUẢN LÝ THIẾT BỊ",
          headerStyle: {
            backgroundColor: "#1FD2BD",
          },
        }}
      />

    </Stack.Navigator>

  )
}

export default StackNavigation