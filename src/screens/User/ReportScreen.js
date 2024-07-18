import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import { TextInput } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";

const ReportScreen = () => {
  const navigation = useNavigation();
  const [text, setText] = useState("");

  const checkText = () => {
    if (text.trim() !== "") {
      alert('Reported Successfully');
    } else {
      alert('Please write something');
    }
  };

  return (
    <View>
      <Header
        leftComponent={{
          icon: "arrow-back",
          color: "#fff",
          onPress: () => navigation.goBack(),
        }}
        centerComponent={<Text style={styles.title}>Report Information</Text>}
      />
      <View style={styles.container}>

        <TextInput
          onChangeText={(e) => setText(e)}
          value={text}
          placeholder='Write something ...'
          multiline={true}
          scrollEnabled={true}
          style={styles.text}
        />
        <TouchableOpacity style={styles.btnReport} onPress={checkText}>
          <Text style={styles.btnText}>Report</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
   // flex: 1,
    padding: 10,
    backgroundColor: '#fff',


  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  text: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop:20,
    marginBottom: 50,
    minHeight: 500,
    backgroundColor: '#fff',
  },
  btnReport: {
    backgroundColor: '#007BFF',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 10,
    elevation: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 400,
    
    height: 50,
    alignSelf: 'center',
  
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default ReportScreen;