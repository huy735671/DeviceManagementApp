import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, FlatList, Text } from 'react-native';
import Icons from "react-native-vector-icons/MaterialIcons";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { Header } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';

const SearchBar = ({ userRole }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    setSearchResults([]);
    setSearchQuery('');
  }, [userRole]);

  const handleSearch = async () => {
    
    try {
      // const userQuery = firestore()
      //   .collection('USERS')
      //   .where('name', '>=', searchQuery)
      //   .where('name', '<=', searchQuery + '\uf8ff')
      //   .get();
      // const usernameQuery = firestore()
      //   .collection('USERS')
      //   .where('username', '>=', searchQuery)
      //   .where('username', '<=', searchQuery + '\uf8ff')
      //   .get();
      const roomQuery = firestore()
        .collection('ROOMS')
        .where('name', '>=', searchQuery)
        .where('name', '<=', searchQuery + '\uf8ff')
        .get();
      const deviceQuery = firestore()
        .collection('DEVICES')
        .where('name', '>=', searchQuery)
        .where('name', '<=', searchQuery + '\uf8ff')
        .get();

      const [
        // usersSnapshot, usernameSnapshot,
         roomsSnapshot, devicesSnapshot] = await Promise.all([
        // userQuery,
        // usernameQuery,
        roomQuery,
        deviceQuery
      ]);

      // const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'user' }));
      // const usernames = usernameSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'username' }));
      const rooms = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'room' }));
      const devices = devicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'device' }));

      setSearchResults([
        // ...users, ...usernames,
         ...rooms, ...devices]);
    } catch (error) {
      console.error("Error searching Firestore: ", error);
    }
    
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handlePress = (item) => {
    if (item.type === 'device') {
      navigation.navigate('DevicesDetail', { device: item });
    } else if (item.type === 'room') {
      navigation.navigate('ListDevices', { roomId: item.id, roomName: item.name });
    }
  };

  const renderItem = ({ item }) => (
    <Animatable.View animation="fadeIn" duration={600} style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.items}
        onPress={() => handlePress(item)}
      >
        <Icons name={item.icon || 'business-outline'} size={40} color="black" style={styles.icon} />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle}>{item.name 
          // ||item.username
           }</Text>
          <Text style={styles.itemTitle}>{item.roomName || " "}</Text>
       
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <Header
        leftComponent={{
          icon: "arrow-back",
          color: "#fff",
          onPress: () => navigation.goBack(),
        }}
      />
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchIconContainer} onPress={handleSearch}>
          <Icons name="search" size={24} color="#666" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        {searchQuery !== '' && (
          <TouchableOpacity style={styles.clearIconContainer} onPress={clearSearch}>
            <Icons name="close" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIconContainer: {
    padding: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  clearIconContainer: {
    padding: 10,
  },
  flatList: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
  },
  itemContainer: {
    flex: 1,
    margin: 5,
  },
  items: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    width: '100%',
  },
  icon: {
    marginBottom: 10,
  },
  itemTextContainer: {
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
 
});

export default SearchBar;
