import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, FlatList, Text } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';

const devices = [
  { id: 1, name: 'Laptop', status: 'available', icon: 'laptop-outline' },
  { id: 2, name: 'Tablet', status: 'available', icon: 'tablet-landscape-outline' },
  { id: 3, name: 'Smartphone', status: 'unavailable', icon: 'phone-portrait-outline' },
];

const rooms = [
  { id: 1, name: 'Room 1', status: 'Normal' },
  { id: 2, name: 'Room 2', status: 'Broken' },
  { id: 3, name: 'Room 3', status: 'Normal' },
  { id: 4, name: 'Room 4', status: 'Maintenance' },
  { id: 5, name: 'Room 5', status: 'Normal' },
  { id: 6, name: 'Room 6', status: 'Normal' },
];
const getStatusColor = (status) => {
  switch (status) {
    case 'available':
    case 'Normal':
      return 'blue';
    case 'unavailable':
    case 'Broken':
      return 'red';
    case 'Maintenance':
      return 'orange';
    default:
      return 'black';
  }
};

const SearchBar = ({ userRole, navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    setSearchResults([]);
    setSearchQuery('');
  }, [userRole]);

  const handleSearch = () => {
    const data = userRole === 'admin' ? devices : rooms;
    const results = data.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const renderItem = ({ item }) => (
    <Animatable.View animation="fadeIn" duration={600} style={styles.itemContainer}>
      <TouchableOpacity style={styles.items}>
        <Icons name={userRole === 'admin' ? item.icon : 'laptop-outline'} size={40} color="black" style={styles.icon} />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={[styles.itemStatus, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchIconContainer} onPress={handleSearch}>
          <Icons name="search-outline" size={24} color="#666" />
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
            <Icons name="close-circle-outline" size={24} color="#666" />
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
  itemStatus: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default SearchBar;
