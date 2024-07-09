import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import users from './../data/userData';
import Icons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import firestore from "@react-native-firebase/firestore";
import {Auth} from "@react-native-firebase/auth";
import { useMyContextController, login } from "../context";



const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
 
  useEffect(() => {
    console.log("userLogin:", userLogin);
    console.log("error:", error);

    if (userLogin != null) {
      console.log("User role:", userLogin.role);

      if (userLogin.role === "admin") {
        navigation.navigate('AdminTab');
      } else if (userLogin.role === "user"){
        navigation.navigate('UserTab');
      }
    } 
  }, [userLogin, error]);

  const handleSignIn = () => {
    login(dispatch, email, password);
  };
  const handlerForgotPassword = () => {
    navigation.navigate('ForgotPassword')
  }

  const handlerSignUp = () => {
    navigation.navigate('SignUp')
  }


  useEffect(() => {
    //Simulate the wait time, then navigate to the main screen
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3000); // 3s

    return () => clearTimeout(timer);
  }, []);



  return (

    <View style={styles.headerContainer}>
      <Animatable.Image
        animation="bounceIn"
        duration={1500}
        source={require('../assets/logo.png')}
        style={styles.TopImage}
      />
      <Animatable.Text animation="fadeIn" duration={2000} style={styles.text}>
        Device Management
      </Animatable.Text>

      {isReady && (
        <>
          <Animatable.View animation="fadeIn" duration={1500} style={styles.inputContainer}>
            <Icons name="mail-outline" size={24} color="gray" style={styles.InputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder='Nhập email của bạn'
              value={email}
              onChangeText={setEmail} />
          </Animatable.View>
          <Animatable.View animation="fadeIn" duration={1500} style={styles.inputContainer}>
            <Icons name="lock-closed-outline" size={24} color="gray" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder='Nhập mật khẩu'
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} color="gray" />
            </TouchableOpacity>
          </Animatable.View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Animatable.View animation="pulse" duration={1500} style={{ top: '5%' }}>
            <TouchableOpacity onPress={handleSignIn} style={styles.signinButtonContainer}>
              <Text style={styles.signinText}>Đăng nhập</Text>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="zoomIn" duration={1500} style={{ top: '5%' }}>
            <TouchableOpacity onPress={handlerSignUp}>
              <Text style={styles.signupText}> Bạn chưa có tài khoản?<Text style={{ color: 'blue' }}>Đăng ký</Text> </Text>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="zoomIn" duration={1500} style={{ top: '5%' }}>
            <TouchableOpacity onPress={handlerForgotPassword} style={styles.forgotPassword}>
              <Text style={{ color: 'blue', textAlign: 'center', fontSize: 16 }}>Quên mật khẩu</Text>
            </TouchableOpacity>
          </Animatable.View>
        </>
      )}




    </View>

  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  TopImageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  TopImage: {
    height: 200,
    width: 200,
  },
  bodyContainer: {
    marginBottom: 80,
  },
  bodyText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
    textAlign: 'center',

  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius: 10,
    elevation: 10,
    marginVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,

  },
  inputIcon: {
    marginHorizontal: 0,
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 15,
    color: 'black',
  },
  signinButtonContainer: {
    alignItems: 'center',
    backgroundColor: '#1fde99',
    marginHorizontal: 40,
    elevation: 10,
    borderRadius: 10,
  },
  signinText: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
    padding: 10,
  },
  signupText: {
    color: "black",
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default SignInScreen;
