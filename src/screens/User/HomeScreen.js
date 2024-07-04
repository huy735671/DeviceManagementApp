import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Devices from '../../components/Devices'
import RoomList from '../../components/RoomList'

const HomeScreen = ({ navigation }) => {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      </View>
      <Devices style={style.Devices} />
      <RoomList />
    </SafeAreaView>
  )
}

export default HomeScreen;
const style = StyleSheet.create({
  Devices: {

  }
});