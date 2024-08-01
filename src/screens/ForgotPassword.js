import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icons from 'react-native-vector-icons/Ionicons';


const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const handlerSignin = () => {
    navigation.navigate('SignIn');
  };

  const handleResetPassword = async () => {
    try {
      // Kiểm tra email có tồn tại trong Firestore
      const userRef = await firestore().collection('USERS').doc(email).get();
      if (!userRef.exists) {
        Alert.alert('Lỗi', 'Email này không tồn tại trong hệ thống.');
        return;
      }

      // Gửi email đặt lại mật khẩu
      await auth().sendPasswordResetEmail(email);
      Alert.alert('Thông báo', 'Email đặt lại mật khẩu đã được gửi thành công.');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gửi email đặt lại mật khẩu. Vui lòng kiểm tra lại địa chỉ email.');
      console.error('Error sending password reset email:', error);
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.TopImageContainer}>
        <Image source={require('./../assets/logo.png')} style={styles.TopImage} />
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.bodyText}>Quên mật khẩu</Text>
      </View>
      <View style={styles.inputContainer}>
      <Icons name="person-outline" size={24} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder='Nhập email của bạn'
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <TouchableOpacity onPress={handleResetPassword}>
        <View style={styles.signinButtonContainer}>
          <Text style={styles.signinText}>Gửi</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlerSignin}>
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}> Trở lại đăng nhập? <Text style={{ color: 'blue' }}>Đăng nhập</Text> </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    backgroundColor: 'white',
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
    marginHorizontal: 40,
    elevation: 10,
    marginVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  inputIcon: {
    paddingHorizontal:2,

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
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
    padding: 10,
  },
  signupContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  signupText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },
});
