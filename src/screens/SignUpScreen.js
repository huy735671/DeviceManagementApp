import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import firestore from '@react-native-firebase/firestore';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const handleSignUp = async () => {
    setEmailError('');
    setGeneralError('');
  
    if (password !== confirmPassword) {
      setGeneralError('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Email không hợp lệ.');
      return;
    }
  
    try {
      // Save user info to SIGNUP collection with email as document ID
      await firestore().collection('SIGNUP').doc(email).set({
        username,
        phone,
        email,
        password,
        status: 'pending' // User is pending approval
      });
  
      // Send notification to the user
      Alert.alert(
        "Đăng ký thành công!",
        "Tài khoản của bạn đang chờ xét duyệt. Chúng tôi sẽ thông báo khi tài khoản được chấp nhận.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
  
    } catch (error) {
      console.error('Error signing up:', error.message);
      Alert.alert('Đăng ký thất bại', 'Có lỗi xảy ra trong quá trình đăng ký: ' + error.message);
    }
  };
  

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handlerSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.headerContainer}>
      <Animatable.Image
        animation="bounceIn"
        duration={1500}
        source={require('../assets/logo.png')}
        style={styles.TopImage}
      />
      <View style={styles.bodyContainer}>
        <Text style={styles.bodyText}>Đăng ký tài khoản</Text>
      </View>

      <Animatable.View animation="fadeIn" duration={1500} style={styles.inputContainer}>
        <Icons name="person-outline" size={24} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder='Nhập tên đăng nhập'
          value={username}
          onChangeText={setUsername}
        />
      </Animatable.View>

      <Animatable.View animation="fadeIn" duration={1500} style={styles.inputContainer}>
        <Icons name="mail-outline" size={24} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder='Nhập email của bạn'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
        />
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
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

      <Animatable.View animation="fadeIn" duration={1500} style={styles.inputContainer}>
        <Icons name="lock-closed-outline" size={24} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder='Nhập lại mật khẩu'
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Icons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={24} color="gray" />
        </TouchableOpacity>
      </Animatable.View>

      {generalError ? <Text style={styles.error}>{generalError}</Text> : null}

      <Animatable.View animation="fadeIn" duration={1500} style={styles.inputContainer}>
        <Icons name="call-outline" size={24} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder='Nhập số điện thoại'
          value={phone}
          onChangeText={setPhone}
          keyboardType='phone-pad'
        />
      </Animatable.View>

      <View style={{ marginTop: 40 }} />
      <Animatable.View animation="pulse" duration={1500} style={{ top: '5%' }}>
        <TouchableOpacity onPress={handleSignUp} style={styles.signinButtonContainer}>
          <Text style={styles.signinText}>Đăng ký</Text>
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation="zoomIn" duration={1500} style={{ top: '5%' }}>
        <TouchableOpacity onPress={handlerSignIn} style={styles.signupContainer}>
          <Text style={styles.signupText}>Bạn đã có tài khoản?<Text style={{ color: 'blue' }}> Đăng nhập</Text></Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TopImageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  TopImage: {
    height: 200,
    width: 200,
  },
  bodyContainer: {
    marginBottom: 20,
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
  InputIcon: {
    marginHorizontal: 10,
  },
  textInput: {
    flex: 1,
    padding: 10,
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
    textAlign: 'left',
    marginTop: 5,
    marginHorizontal: 10,
  },
});
