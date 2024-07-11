import { View, Text } from 'react-native'
import React,{useEffect} from 'react'
import StackNavigation from './src/navigations/StackNavigation'
import { NavigationContainer } from '@react-navigation/native'
import { PaperProvider } from 'react-native-paper'
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { MyContextControllerProvider } from './src/context'

const initial = async()=>{
  const USERS = firestore().collection('USERS');
  const admin = {
    name: 'Hiep',
    phone: '0326319810',
    // address: 'Binh Duong',
    email: 'hiep1234@gmail.com',
    password: '123456',
    role: 'admin',
  };
  try {
    const userDoc = USERS.doc(admin.email);
    const userSnapshot = await userDoc.get();

    if (!userSnapshot.exists) {
      await auth().createUserWithEmailAndPassword(admin.email, admin.password);
      await userDoc.set(admin);
      console.log("Add new user admin!");
    }
  } catch (error) {
    console.error("Error during initial setup:", error);
  }
}
const App = () => {
  useEffect(()=>{
    initial();
    },[]);
  
  return (
    <MyContextControllerProvider>
    <PaperProvider>
      <NavigationContainer>
        <StackNavigation />
        
      </NavigationContainer>
    </PaperProvider>
    </MyContextControllerProvider>
  )
}

export default App