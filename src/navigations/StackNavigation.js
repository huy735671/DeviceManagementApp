import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/SignInScreen';
import BottomNavigation from './BottomNavigation';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPassword from '../screens/ForgotPassword';
import Room from '../screens/User/Room';
import RoomList from '../components/RoomList';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName='Splash' screenOptions={{ 
      headerShown:false,   
    }}>
      <Stack.Screen name='Splash' component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name='SignIn' component={SignInScreen} />
      <Stack.Screen name='SignUp' component={SignUpScreen} />
      <Stack.Screen name='Tabs' component={BottomNavigation}  />
      <Stack.Screen name='ForgotPassword' component={ForgotPassword}/>
      <Stack.Screen name='Room' component={Room}  options={{ headerShown: false }} />
      <Stack.Screen name='RoomList' component={RoomList}  options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default StackNavigation