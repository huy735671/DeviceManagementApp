import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';


const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = () => {
    // Kiểm tra các điều kiện đăng ký
    if (!email || !username || !phone || !password || !confirmPassword) {
      setError('Please fill all fields');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      // Xử lý đăng ký thành công
      // Ví dụ: Gửi dữ liệu đến máy chủ hoặc lưu trữ dữ liệu
      setError('');
      console.log('User signed up:', { email, username, phone, password });
      navigation.navigate('SignIn');
    }
  };
  const handlerSignIn = () => {
    navigation.navigate('SignIn');
  }

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


      <Animatable.View animation="fadeIn"  duration={1500} style={styles.inputContainer}>
        <Icons name="person-outline" size={24} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder='Nhập tên đăng nhập'
          value={username}
          onChangeText={setUsername}
        />
      </Animatable.View>

      <Animatable.View animation="fadeIn"  duration={1500} style={styles.inputContainer}>
        <Icons name="mail-outline" size={24} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder='Nhập email của bạn'
          value={email}
          onChangeText={setEmail}
        />
      </Animatable.View>

      <Animatable.View animation="fadeIn"  duration={1500} style={styles.inputContainer}>
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

      <Animatable.View animation="fadeIn"  duration={1500} style={styles.inputContainer}>
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
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Animatable.View animation="fadeIn"   duration={1500} style={styles.inputContainer}>
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
      <Animatable.View animation="pulse"  duration={1500} style={{ top: '5%' }}>
        <TouchableOpacity onPress={handleSignUp} style={styles.signinButtonContainer}>
          <Text style={styles.signinText}>Đăng ký</Text>
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation="zoomIn"  duration={1500} style={{ top: '5%' }}>
        <TouchableOpacity onPress={handlerSignIn} style={styles.signupContainer}>
          <Text style={styles.signupText}> Bạn đã có tài khoản?<Text style={{ color: 'blue' }}>Đăng nhập</Text> </Text>
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


});