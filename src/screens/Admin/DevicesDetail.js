// import React from 'react';
// import { View, Text, StyleSheet, Alert } from 'react-native';
// import { Button } from 'react-native-paper';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import firestore from '@react-native-firebase/firestore';

// const DeviceDetail = ({ route, navigation }) => {
//   const device = route.params?.device;

//   if (!device) {
//     return (
//       <View style={styles.container}>
//         <Text>Không có dữ liệu thiết bị.</Text>
//       </View>
//     );
//   }

//   const {
//     id, icon = 'devices', name, operationalStatus, deviceType, brand,
//     supplier, price, deploymentDate, purchaseDate, warrantyEndDate
//   } = device;

//   const handleDeleteDevice = async () => {
//     try {
//       await firestore().collection('DEVICES').doc(id).delete();
//       console.log('Thiết bị đã được xóa khỏi Firestore');
//       navigation.navigate('AdminTab');
//       Alert.alert('Xóa thành công', 'Thiết bị đã được xóa khỏi hệ thống.');
//     } catch (error) {
//       console.error('Lỗi khi xóa thiết bị:', error);
//       Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xóa thiết bị.');
//     }
//   };

//   const handleReportDevice = () => {
//     navigation.navigate('ReportDevice', {
//       name,
//       id
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.card}>
//         <View style={styles.header}>
//           <Icon name={icon} size={100} color="#000" />
//           <View style={styles.headerText}>
//             <Text style={styles.title}>Tên thiết bị:</Text>
//             <Text style={styles.text}>{name}</Text>
//             <Text style={styles.title}>Trạng thái:</Text>
//             <Text style={styles.text}>{operationalStatus}</Text>
//           </View>
//         </View>
//         <View style={styles.details}>
//           <Text style={styles.detailText}>Kiểu thiết bị: {deviceType}</Text>
//           <Text style={styles.detailText}>Thương hiệu: {brand}</Text>
//           <Text style={styles.detailText}>Nhà cung cấp: {supplier}</Text>
//           <Text style={styles.detailText}>Giá: {price.toLocaleString()}</Text>
//           <Text style={styles.detailText}>Ngày mua: {purchaseDate?.toDate().toLocaleDateString()}</Text>
//           <Text style={styles.detailText}>Ngày bảo hành kết thúc: {warrantyEndDate?.toDate().toLocaleDateString()}</Text>
//           <Text style={styles.detailText}>Ngày đưa vào sử dụng: {deploymentDate?.toDate().toLocaleDateString()}</Text>
//         </View>
//       </View>
//       <View style={styles.buttonContainer}>
//         <Button
//           mode="contained"
//           style={[styles.button, { backgroundColor: 'orange' }]}
//           onPress={handleReportDevice}
//         >
//           Báo cáo
//         </Button>
//         <Button
//           mode="contained"
//           style={[styles.button, { backgroundColor: '#1FD2BD' }]}
//           onPress={() => navigation.navigate('EditDevice', { id })}
//         >
//           Chỉnh sửa
//         </Button>
//         <Button
//           mode="contained"
//           style={[styles.button, { backgroundColor: 'red' }]}
//           onPress={handleDeleteDevice}
//         >
//           Xóa
//         </Button>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFF',
//     padding: 20,
//   },
//   card: {
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#000',
//     marginBottom: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//   },
//   headerText: {
//     marginLeft: 10,
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   text: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   details: {
//     padding: 10,
//   },
//   detailText: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 20,
//   },
//   button: {
//     borderRadius: 5,
//     width: 120,
//     marginBottom: 10,
//   },
// });

// export default DeviceDetail;
import React from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';

const DeviceDetail = ({ route, navigation }) => {
  const device = route.params?.device;

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>Không có dữ liệu thiết bị.</Text>
      </View>
    );
  }

  const {
    id, image, icon = 'devices', name, operationalStatus, deviceType, brand,
    supplier, price, deploymentDate, purchaseDate, warrantyEndDate
  } = device;

  const handleDeleteDevice = async () => {
    try {
      await firestore().collection('DEVICES').doc(id).delete();
      console.log('Thiết bị đã được xóa khỏi Firestore');
      navigation.navigate('AdminTab');
      Alert.alert('Xóa thành công', 'Thiết bị đã được xóa khỏi hệ thống.');
    } catch (error) {
      console.error('Lỗi khi xóa thiết bị:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xóa thiết bị.');
    }
  };

  const handleReportDevice = () => {
    navigation.navigate('ReportDevice', {
      name,
      id
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          {image ? (
            <Image source={{ uri: image }} style={styles.deviceImage} />
          ) : (
            <Icon name={icon} size={100} color="#000" />
          )}
          <View style={styles.headerText}>
            <Text style={styles.title}>Tên thiết bị:</Text>
            <Text style={styles.text}>{name}</Text>
            <Text style={styles.title}>Trạng thái:</Text>
            <Text style={styles.text}>{operationalStatus}</Text>
          </View>
        </View>
        <View style={styles.details}>
          <Text style={styles.detailText}>Kiểu thiết bị: {deviceType}</Text>
          <Text style={styles.detailText}>Thương hiệu: {brand}</Text>
          <Text style={styles.detailText}>Nhà cung cấp: {supplier}</Text>
          <Text style={styles.detailText}>Giá: {price.toLocaleString()}</Text>
          <Text style={styles.detailText}>Ngày mua: {purchaseDate?.toDate().toLocaleDateString()}</Text>
          <Text style={styles.detailText}>Ngày bảo hành kết thúc: {warrantyEndDate?.toDate().toLocaleDateString()}</Text>
          <Text style={styles.detailText}>Ngày đưa vào sử dụng: {deploymentDate?.toDate().toLocaleDateString()}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: 'orange' }]}
          onPress={handleReportDevice}
        >
          Báo cáo
        </Button>
        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: '#1FD2BD' }]}
          onPress={() => navigation.navigate('EditDevice', { id })}
        >
          Chỉnh sửa
        </Button>
        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: 'red' }]}
          onPress={handleDeleteDevice}
        >
          Xóa
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  deviceImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  headerText: {
    marginLeft: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  details: {
    padding: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    borderRadius: 5,
    width: 120,
    marginBottom: 10,
  },
});

export default DeviceDetail;
