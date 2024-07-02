import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/SignInScreen';
import BottomNavigation from './BottomNavigation';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName='Splash' screenOptions={{ 
      headerShown:false,   
    }}>
      <Stack.Screen name='Splash' component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name='SignIn' component={SignInScreen} />
      <Stack.Screen name='Tabs' component={BottomNavigation}  />
    </Stack.Navigator>
  )
}

export default StackNavigation