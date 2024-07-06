import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Devices from '../../components/Devices'
import RoomList from '../../components/RoomList'

const HomeScreen = ({ navigation }) => {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
     
      <ScrollView>
        <Devices style={style.Devices} />
        <RoomList />
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen;
const style = StyleSheet.create({
  Devices: {

  }
});