import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Header } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import biểu tượng từ react-native-vector-icons

const RoomScreen = ({ route }) => {
  const navigation = useNavigation();
  const { roomId, roomName } = route.params;

  const data = [
    { id: '1', title: 'Employee', screen: 'ListEmployee', icon: 'people' },
    { id: '2', title: 'Devices', screen: 'ListDevices', icon: 'devices' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate(item.screen, { roomId, roomName })}
    >
      <Icon name={item.icon} size={24} color="#fff" style={styles.icon} />
      <Text style={styles.itemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        leftComponent={{
          icon: 'arrow-back',
          color: '#fff',
          onPress: () => navigation.goBack(),
        }}
        centerComponent={<Text style={styles.headerTitle}>Room Details</Text>}
        containerStyle={styles.header}
      />
      <View style={styles.content}>
        <Text style={styles.roomName}>{roomName}</Text>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
};

export default RoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#333',
    borderBottomWidth: 0,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  roomName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#444',
    textTransform: 'uppercase',
  },
  list: {
    width: '100%',
  },
  item: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 8,
    flexDirection: 'row', // Sắp xếp các phần tử theo hàng
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  itemText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
    marginLeft: 10, // Cách biểu tượng và văn bản
  },
  icon: {
    // Không cần thêm style ở đây nếu không có yêu cầu cụ thể
  },
});
