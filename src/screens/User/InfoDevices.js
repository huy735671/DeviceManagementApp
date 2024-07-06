import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Header } from 'react-native-elements';

const InfoDevices = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { device } = route.params;

  return (
    <View style={styles.container}>
      <Header
        leftComponent={{
          icon: "arrow-back",
          color: "#fff",
          onPress: () => navigation.goBack(),
        }}
        centerComponent={<Text style={styles.title}>Device Information</Text>}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Device: {device.devices}</Text>
        <Text style={styles.label}>Status: {device.status}</Text>
        <Text style={styles.label}>Color: {device.color}</Text>
        <Text style={styles.label}>Date: {device.date}</Text>
        <Text style={styles.label}>Price: {device.price}</Text>
      </View>
      <TouchableOpacity style={styles.btnReport} onPress={() => navigation.navigate("Report")}>
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', }}>Report</Text>
      </TouchableOpacity>
    </View>
  );
}

export default InfoDevices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  infoContainer: {
    padding: 20,
    borderWidth: 1,
    margin: 10,
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
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
  }

});