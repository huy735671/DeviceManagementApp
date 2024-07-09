import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import StackNavigation from './src/navigations/StackNavigation'
import { NavigationContainer } from '@react-navigation/native'
import { PaperProvider } from 'react-native-paper'
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { MyContextControllerProvider } from './src/context'

const initial = async () => {
  const USERS = firestore().collection('USERS');
  const admin = {
    name: 'Hiep',
    phone: '0326319810',
    // address: 'Binh Duong',
    email: 'hiep1234@gmail.com',
    password: '123456',
    role: 'admin',
  };

  const user = {
    name: 'thuy',
    phone: '0987654321',
    email: 'thuy@gmail.com',
    password: '123456',
    role: 'user',
  };

  try {
    // create account admin
    const adminDoc = USERS.doc(admin.email);
    const adminSnapshot = await adminDoc.get();
    if (!adminSnapshot.exists) {
      await auth().createUserWithEmailAndPassword(admin.email, admin.password);
      await adminDoc.set(admin);
      console.log("Add new user admin!");
    }


    // create account user 
    const userDoc = USERS.doc(user.email);
    const userSnapshot = await userDoc.get();
    if (!userSnapshot.exists) {
      await auth().createUserWithEmailAndPassword(user.email, user.password);
      await userDoc.set(user);
      console.log("Add new user user!");
    }



  } catch (error) {
    console.error("Error during initial setup:", error);
  }
}
const App = () => {
  useEffect(() => {
    initial();
  }, []);

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