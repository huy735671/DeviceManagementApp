// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { Button, TextInput } from 'react-native-paper';
// import DatePicker from 'react-native-date-picker';
// import firestore from '@react-native-firebase/firestore';

// const EditDeviceScreen = ({ route, navigation }) => {
//   const { deviceId } = route.params;
//   const { id } = route.params;
//   const [device, setDevice] = useState(null);
//   const [price, setPrice] = useState([]);
//   const [rooms, setRooms] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [iconModalVisible, setIconModalVisible] = useState(false);
//   const [error, setError] = useState(null);
//   const [isDataReady, setIsDataReady] = useState(false);
//   const [isSpecificDevice, setIsSpecificDevice] = useState(false);

//   const [icons, setIcons] = useState([
//     'laptop',
//     'phone-android',
//     'tv',
//     'tablet',
//     'keyboard',
//     'headset',
//     // Add more icons as needed
//   ]);

//   const statusOptions = [
//     { label: 'Hoạt động', value: 'active' },
//     { label: 'Không hoạt động', value: 'inactive' },
//     { label: 'Bảo trì', value: 'maintenance' },
//   ];

//   const [datePickerVisible, setDatePickerVisible] = useState(false);
//   const [datePickerMode, setDatePickerMode] = useState('datetime');
//   const [selectedDateField, setSelectedDateField] = useState(null);

//   useEffect(() => {
//     const fetchDevice = async () => {
//       const deviceDoc = await firestore().collection('DEVICES').doc(id).get();
//       // const deviceData = deviceDoc.data();
//       setDevice({
//         id: deviceDoc.id,
//         ...deviceDoc.data(),
//         datetime: deviceDoc.data()?.datetime?.toDate() || new Date(),
//         deploymentDate: deviceDoc.data()?.deploymentDate?.toDate() || new Date(),
        
//       });
//     };

//     const fetchRooms = async () => {
//       const roomsCollection = await firestore().collection('ROOMS').get();
//       setRooms(roomsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     };
//     fetchDevice();
//     fetchRooms();
//   }, [deviceId]);

//   const handleSaveDevice = async () => {
//     if (device.selectedRoom && device.name && device.deviceType && device.warrantyPeriod && device.operationalStatus && device.selectedIcon) {
//       let numericPrice = 0;
//       if (device.price) {
//         if (typeof device.price === 'string') {
//           numericPrice = parseInt(device.price.replace(/\./g, ''), 10);
//         } else {
//           numericPrice = parseInt(device.price, 10);
//         }
//       }
  
//       const warrantyEndDate = new Date(device.datetime);
//       warrantyEndDate.setMonth(warrantyEndDate.getMonth() + parseInt(device.warrantyPeriod, 10));
  
//       try {
//         await firestore().collection('DEVICES').doc(id).update({
//           name: device.name,
//           id: id,
//           deviceType: device.deviceType,
//           price: numericPrice,
//           datetime: device.datetime,
//           warrantyEndDate,
//           roomId: device.selectedRoom.id,
//           supplier: device.supplier,
//           brand: device.brand,
//           operationalStatus: device.operationalStatus,
//           deploymentDate: device.deploymentDate,
//           icon: device.selectedIcon,
          
//         });
  
//         navigation.navigate('AdminTab'); // Navigate back to the admin screen or device list
//       } catch (error) {
//         console.error('Lỗi khi lưu thiết bị:', error);
//       }
//     } else {
//       console.log('Vui lòng điền đầy đủ thông tin');
//     }
//   };
  
//   const renderRoomItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.roomItem}
//       onPress={() => {
//         setDevice(prevDevice => ({
//           ...prevDevice,
//           selectedRoom: item
//         }));
//         setModalVisible(false);
//       }}
//     >
//       <Text style={styles.roomItemText}>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   const renderIconItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.iconItem}
//       onPress={() => {
//         setDevice(prevDevice => ({
//           ...prevDevice,
//           selectedIcon: item
//         }));
//         setIconModalVisible(false);
//       }}
//     >
//       <Icon name={item} size={30} color="#000" />
//     </TouchableOpacity>
//   );

//   const formatPrice = (price) => {
//     let formattedPrice = String(price).replace(/\./g, '');
//     formattedPrice = formattedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

//     return formattedPrice;
//   };

//   const handleDateChange = (date) => {
//     setDevice(prevDevice => ({
//       ...prevDevice,
//       [selectedDateField]: date,
//     }));
//     setDatePickerVisible(false);
//   };

//   if (!device) {
//     return (
//       <View style={styles.container}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.content}>
//         <View style={styles.iconContainer}>
//           <TouchableOpacity onPress={() => setIconModalVisible(true)}>
//             {device.selectedIcon ? (
//               <Icon name={device.selectedIcon} size={100} color={"#000"} />
//             ) : (
//               <Icon name={"account-circle"} size={100} color={"#000"} />
//             )}
//           </TouchableOpacity>
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Tên thiết bị:</Text>
//           <TextInput
//             placeholder={"Nhập tên thiết bị"}
//             value={device.name}
//             onChangeText={(text) => setDevice(prevDevice => ({ ...prevDevice, name: text }))}
//             style={styles.input}
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Số series:</Text>
//           <TextInput
//             placeholder={"Nhập số series"}
//             value={device.id}
//             onChangeText={(text) => setDevice(prevDevice => ({ ...prevDevice, id: text }))}
//             style={styles.input}
//              keyboardType="numeric"
//             editable={device.name !== "specificDeviceName"} // Prevent editing if it's a specific device
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Phòng ban:</Text>
//           <TouchableOpacity style={styles.roomInput} onPress={() => setModalVisible(true)}>
//             <Text style={styles.roomText}>{device.selectedRoom ? device.selectedRoom.name : 'Chọn phòng ban'}</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Kiểu thiết bị:</Text>
//           <TextInput
//             placeholder={'Nhập kiểu thiết bị'}
//             value={device.deviceType}
//             onChangeText={(text) => setDevice(prevDevice => ({ ...prevDevice, deviceType: text }))}
//             style={styles.input}
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Giá:</Text>
//           <TextInput
//             placeholder={"Nhập giá"}
//             value={formatPrice(device.price)}
//             onChangeText={(text) => {
//               const formattedText = text.replace(/\D/g, '');
//               setDevice(prevDevice => ({ ...prevDevice, price: formattedText }));
//             }}
//             keyboardType="numeric"
//             style={styles.input}
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Ngày mua:</Text>
//           <TouchableOpacity
//             style={styles.datePickerButton}
//             onPress={() => {
//               setDatePickerMode('datetime');
//               setSelectedDateField('datetime');
//               setDatePickerVisible(true);
//             }}
//           >
//             <Text style={{ fontSize: 16, color: "#000" }}>{device.datetime.toLocaleDateString()}</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Thời gian bảo hành (tháng):</Text>
//           <TextInput
//             placeholder={"Nhập thời gian bảo hành"}
//             value={device.warrantyPeriod}
//             onChangeText={(text) => setDevice(prevDevice => ({ ...prevDevice, warrantyPeriod: text }))}
//             keyboardType="numeric"
//             style={styles.input}
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Nhà cung cấp:</Text>
//           <TextInput
//             placeholder={"Nhập nhà cung cấp"}
//             value={device.supplier}
//             onChangeText={(text) => setDevice(prevDevice => ({ ...prevDevice, supplier: text }))}
//             style={styles.input}
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Thương hiệu:</Text>
//           <TextInput
//             placeholder={"Nhập thương hiệu"}
//             value={device.brand}
//             onChangeText={(text) => setDevice(prevDevice => ({ ...prevDevice, brand: text }))}
//             style={styles.input}
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Trạng thái hoạt động:</Text>
//           {statusOptions.map((status) => (
//             <TouchableOpacity
//               key={status.value}
//               style={[
//                 styles.statusOption,
//                 device.operationalStatus === status.value && styles.selectedStatusOption,
//               ]}
//               onPress={() => setDevice(prevDevice => ({ ...prevDevice, operationalStatus: status.value }))}
//             >
//               <Text
//                 style={[
//                   styles.statusOptionText,
//                   device.operationalStatus === status.value && styles.selectedStatusOptionText,
//                 ]}
//               >
//                 {status.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Ngày triển khai:</Text>
//           <TouchableOpacity
//             style={styles.datePickerButton}
//             onPress={() => {
//               setDatePickerMode('date');
//               setSelectedDateField('deploymentDate');
//               setDatePickerVisible(true);
//             }}
//           >
//             <Text style={{ fontSize: 16, color: "#000" }}>{device.deploymentDate.toLocaleDateString()}</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.buttonContainer}>
//           <Button mode="contained" onPress={handleSaveDevice} style={styles.saveButton}>
//             Lưu
//           </Button>
//         </View>

//         <Modal visible={modalVisible} animationType="slide" transparent={true}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <FlatList
//                 data={rooms}
//                 renderItem={renderRoomItem}
//                 keyExtractor={(item) => item.id}
//               />
//               <Button mode="contained" onPress={() => setModalVisible(false)} style={styles.closeButton}>
//                 Đóng
//               </Button>
//             </View>
//           </View>
//         </Modal>

//         <Modal visible={iconModalVisible} animationType="slide" transparent={true}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <FlatList
//                 data={icons}
//                 renderItem={renderIconItem}
//                 keyExtractor={(item) => item}
//                 numColumns={4}
//               />
//               <Button mode="contained" onPress={() => setIconModalVisible(false)} style={styles.closeButton}>
//                 Đóng
//               </Button>
//             </View>
//           </View>
//         </Modal>

//         <DatePicker
//           modal
//           mode={datePickerMode}
//           open={datePickerVisible}
//           date={device[selectedDateField] || new Date()}
//           onConfirm={handleDateChange}
//           onCancel={() => setDatePickerVisible(false)}
//         />
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   content: {
//     padding: 20,
//   },
//   inputContainer: {
//     marginBottom: 15,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 5,
//     color: "#000"
//   },
//   input: {
//     backgroundColor: '#fff',
//   },
//   saveButton: {
//     marginTop: 20,
//   },
//   buttonContainer: {
//     alignItems: 'center',
//   },
//   datePickerButton: {
//     padding: 10,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//   },
//   roomInput: {
//     padding: 10,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//   },
//   roomText: {
//     fontSize: 16,
//   },
//   statusOption: {
//     padding: 10,
//     marginVertical: 5,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//   },
//   selectedStatusOption: {
//     borderColor: '#007BFF',
//   },
//   statusOptionText: {
//     fontSize: 16,
//     color: '#000',
//   },
//   selectedStatusOptionText: {
//     color: '#007BFF',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     width: '80%',
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 10,
//   },
//   roomItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   roomItemText: {
//     fontSize: 16,
//     color: '#000'
//   },
//   iconContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   iconItem: {
//     padding: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   closeButton: {
//     marginTop: 10,
//   }
// });

// export default EditDeviceScreen;
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, TextInput } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import firestore from '@react-native-firebase/firestore';

const EditDeviceScreen = ({ route, navigation }) => {
  const { deviceId } = route.params;
  const { id } = route.params;
  const [device, setDevice] = useState(null);
  const [price, setPrice] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [iconModalVisible, setIconModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isSpecificDevice, setIsSpecificDevice] = useState(false);

  const [icons, setIcons] = useState([
    'laptop',
    'phone-android',
    'tv',
    'tablet',
    'keyboard',
    'headset',
    // Add more icons as needed
  ]);

  const statusOptions = [
    { label: 'Hoạt động', value: 'active' },
    { label: 'Không hoạt động', value: 'inactive' },
    { label: 'Bảo trì', value: 'maintenance' },
  ];

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState('datetime');
  const [selectedDateField, setSelectedDateField] = useState(null);

  useEffect(() => {
    const fetchDevice = async () => {
      const deviceDoc = await firestore().collection('DEVICES').doc(id).get();
      // const deviceData = deviceDoc.data();
      setDevice({
        id: deviceDoc.id,
        ...deviceDoc.data(),
        datetime: deviceDoc.data()?.datetime?.toDate() || new Date(),
        deploymentDate: deviceDoc.data()?.deploymentDate?.toDate() || new Date(),
        
      });
    };

    const fetchRooms = async () => {
      const roomsCollection = await firestore().collection('ROOMS').get();
      setRooms(roomsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchDevice();
    fetchRooms();
  }, [deviceId]);

  const handleSaveDevice = async () => {
    if (device.selectedRoom && device.name && device.deviceType && device.warrantyPeriod && device.operationalStatus && device.selectedIcon) {
      let numericPrice = 0;
      if (device.price) {
        if (typeof device.price === 'string') {
          numericPrice = parseInt(device.price.replace(/\./g, ''), 10);
        } else {
          numericPrice = parseInt(device.price, 10);
        }
      }
  
      const warrantyEndDate = new Date(device.datetime);
      warrantyEndDate.setMonth(warrantyEndDate.getMonth() + parseInt(device.warrantyPeriod, 10));
  
      try {
        await firestore().collection('DEVICES').doc(id).update({
          name: device.name,
          id: id,
          deviceType: device.deviceType,
          price: numericPrice,
          datetime: device.datetime,
          warrantyEndDate,
          roomId: device.selectedRoom.id,
          supplier: device.supplier,
          brand: device.brand,
          operationalStatus: device.operationalStatus,
          deploymentDate: device.deploymentDate,
          icon: device.selectedIcon,
          image: device.image, // Add this line if you want to save the image URL
          
        });
  
        navigation.navigate('AdminTab'); // Navigate back to the admin screen or device list
      } catch (error) {
        console.error('Lỗi khi lưu thiết bị:', error);
      }
    } else {
      console.log('Vui lòng điền đầy đủ thông tin');
    }
  };

  const renderRoomItem = ({ item }) => (
    <TouchableOpacity
      style={styles.roomItem}
      onPress={() => {
        setDevice(prevDevice => ({
          ...prevDevice,
          selectedRoom: item
        }));
        setModalVisible(false);
      }}
    >
      <Text style={styles.roomItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderIconItem = ({ item }) => (
    <TouchableOpacity
      style={styles.iconItem}
      onPress={() => {
        setDevice(prevDevice => ({
          ...prevDevice,
          selectedIcon: item
        }));
        setIconModalVisible(false);
      }}
    >
      <Icon name={item} size={30} color="#000" />
    </TouchableOpacity>
  );

  const formatPrice = (price) => {
    let formattedPrice = String(price).replace(/\./g, '');
    formattedPrice = formattedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return formattedPrice;
  };

  const handleDateChange = (date) => {
    setDevice(prevDevice => ({
      ...prevDevice,
      [selectedDateField]: date,
    }));
    setDatePickerVisible(false);
  };

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => setIconModalVisible(true)}>
            {device.image ? (
              <Image source={{ uri: device.image }} style={styles.deviceImage} />
            ) : (
              <Icon name={device.selectedIcon || 'account-circle'} size={100} color={"#000"} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tên thiết bị:</Text>
          <TextInput
            placeholder={"Nhập tên thiết bị"}
            value={device.name}
            onChangeText={(text) => setDevice(prevDevice => ({ ...prevDevice, name: text }))}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Số series:</Text>
          <TextInput
            placeholder={"Nhập số series"}
            value={device.id}
            onChangeText={(text) => setDevice(prevDevice => ({ ...prevDevice, id: text }))}
            style={styles.input}
             keyboardType="numeric"
            editable={device.name !== "specificDeviceName"} // Prevent editing if it's a specific device
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phòng ban:</Text>
          <TouchableOpacity style={styles.roomInput} onPress={() => setModalVisible(true)}>
            <Text style={styles.roomText}>{device.selectedRoom ? device.selectedRoom.name : 'Chọn phòng ban'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Kiểu thiết bị:</Text>
          <TextInput
            placeholder={'Nhập kiểu thiết bị'}
            value={device.deviceType}
            onChangeText={(text) => setDevice(prevDevice => ({ ...prevDevice, deviceType: text }))}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Giá:</Text>
          <TextInput
            placeholder={"Nhập giá"}
            value={formatPrice(device.price)}
            onChangeText={(text) => {
              const formattedText = text.replace(/\D/g, '');
              setDevice(prevDevice => ({ ...prevDevice, price: formattedText }));
            }}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ngày mua:</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => {
              setDatePickerMode('datetime');
              setSelectedDateField('datetime');
              setDatePickerVisible(true);
            }}
          >
            <Text style={{ fontSize: 16, color: "#000" }}>{device.datetime.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Thời gian bảo hành (tháng):</Text>
          <TextInput
            placeholder={"Nhập thời gian bảo hành"}
            value={device.warrantyPeriod}
            onChangeText={(text) => setDevice(prevDevice => ({ ...prevDevice, warrantyPeriod: text }))}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tình trạng hoạt động:</Text>
          <TouchableOpacity
            style={styles.statusButton}
            onPress={() => setDevice(prevDevice => ({
              ...prevDevice,
              operationalStatus: prevDevice.operationalStatus === 'active' ? 'inactive' : 'active'
            }))}
          >
            <Text style={styles.statusText}>
              {statusOptions.find(status => status.value === device.operationalStatus)?.label || 'Chọn tình trạng'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ngày triển khai:</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => {
              setDatePickerMode('date');
              setSelectedDateField('deploymentDate');
              setDatePickerVisible(true);
            }}
          >
            <Text style={{ fontSize: 16, color: "#000" }}>{device.deploymentDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        <Button mode="contained" onPress={handleSaveDevice} style={styles.saveButton}>
          Lưu
        </Button>
      </View>

      {/* Modal for room selection */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={rooms}
              keyExtractor={item => item.id}
              renderItem={renderRoomItem}
            />
          </View>
        </View>
      </Modal>

      {/* Modal for icon selection */}
      <Modal
        visible={iconModalVisible}
        transparent={true}
        onRequestClose={() => setIconModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={icons}
              keyExtractor={item => item}
              renderItem={renderIconItem}
              numColumns={3}
            />
          </View>
        </View>
      </Modal>

      {/* DatePicker Modal */}
      <DatePicker
        modal
        mode={datePickerMode}
        open={datePickerVisible}
        date={device[selectedDateField] || new Date()}
        onConfirm={handleDateChange}
        onCancel={() => setDatePickerVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  deviceImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  roomInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  roomText: {
    fontSize: 16,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  statusButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 16,
  },
  saveButton: {
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  iconItem: {
    alignItems: 'center',
    margin: 8,
  },
  roomItem: {
    padding: 16,
  },
  roomItemText: {
    fontSize: 16,
  },
});

export default EditDeviceScreen;
