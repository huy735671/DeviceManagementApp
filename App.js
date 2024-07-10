import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { MyContextControllerProvider } from './src/context';
import StackNavigation from './src/navigations/StackNavigation';

const App = () => {
  return (
    <MyContextControllerProvider>
      <PaperProvider>
        <NavigationContainer>
          <StackNavigation />
        </NavigationContainer>
      </PaperProvider>
    </MyContextControllerProvider>
  );
};

export default App;
