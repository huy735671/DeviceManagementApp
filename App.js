import { View, Text } from 'react-native'
import React from 'react'
import StackNavigation from './src/navigations/StackNavigation'
import { NavigationContainer } from '@react-navigation/native'
import { PaperProvider } from 'react-native-paper'

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </PaperProvider>
  )
}

export default App