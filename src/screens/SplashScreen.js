// src/screens/SplashScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

const SplashScreen = ({ navigation }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    //Simulate the wait time, then navigate to the main screen
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3000); // 3s

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    navigation.replace('SignIn'); 
  };

  return (
    <View style={styles.container}>
      <Animatable.Image
        animation="bounceIn"
        duration={1500}
        source={require('../assets/logo.png')}
        style={styles.logo}
      />
      <Animatable.Text animation="fadeIn" duration={2000} style={styles.text}>
        Device Management
      </Animatable.Text>
      
      {isReady && (
        <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite">
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
