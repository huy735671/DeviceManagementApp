import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';



const ForgotPassword = () => {

const navigation = useNavigation();

const handlerSignip = ()=>{
  navigation.navigate('SignIn')
}

  






  return (
    <View style={styles.headerContainer}>
      <View style={styles.TopImageContainer}>
        <Image source={require('./../assets/logo.png')} style={styles.TopImage} />
      </View>
      <View style={styles.bodyContainer}>

        <Text style={styles.bodyText}>Quên mật khẩu</Text>
      </View>
      

      <View style={styles.inputContainer}>
      <FontAwesome name="user" size={24} color="gray" style={styles.InputIcon} />
        <TextInput style={styles.textInput} placeholder='Nhập email của bạn'/>
      </View>
     
      <View style={{marginTop:100}}/>

      <TouchableOpacity >
                <View style={styles.signinButtonContainer}>
                    <Text style={styles.signinText}>Gữi</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handlerSignip}>
                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}> Trở lại đăng nhập?<Text style={{ color:'blue'}}>Đăng nhập</Text> </Text>
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
    marginBottom:80,
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
    borderWidth:1,

  },
  InputIcon: {
    marginLeft: 12,
    marginRight: 5,
},
TextInput: {
  flex: 1,
  padding: 10,
  color:'black',
},
signinButtonContainer:{
  alignItems:'center',
  
  backgroundColor:'#1fde99',
  marginHorizontal:40,
  elevation:10,
  borderRadius:10,
},
signinText:{
  color: "black",
  fontSize: 25,
  fontWeight: "bold",
  padding:10,
},

signupText:{
  color: "black",
  textAlign: "center",
  fontSize: 16,
  marginTop:10,
},


});