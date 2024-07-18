import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const ReportDeviceScreen = ({ route, navigation }) => {
//  const [deviceId] = route.params.device;
  const [id, setId] = useState(0); // Initialize ID counter
  const [deviceId, setDeviceID] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [operationalStatus, setOperationalStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { label: 'Hoạt động', value: 'active' },
    { label: 'Không hoạt động', value: 'inactive' },
    { label: 'Bảo trì', value: 'maintenance' },
  ];

  const handleReportDevice = async () => {
    if (!reportDescription || !operationalStatus) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);

    try {
      await firestore()
        .collection('REPORTS')
        .add({
          id: id + 1, // Increment ID for new document
          deviceId,
          reportDescription,
          operationalStatus,
          reportDate: new Date(),
        });

      setId(id + 1); // Increment local ID counter
      Alert.alert('Thành công', 'Báo cáo đã được gửi thành công');
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi gửi báo cáo:', error);
      Alert.alert('Lỗi', 'Lỗi khi gửi báo cáo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mô tả báo cáo:</Text>
          <TextInput
            placeholder="Nhập mô tả báo cáo"
            value={reportDescription}
            onChangeText={setReportDescription}
            multiline
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Trạng thái hoạt động:</Text>
          {statusOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.statusOption,
                operationalStatus === option.value && styles.selectedStatusOption,
              ]}
              onPress={() => setOperationalStatus(option.value)}
            >
              <Text style={styles.statusOptionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          mode="contained"
          onPress={handleReportDevice}
          style={styles.saveButton}
          loading={loading}
          disabled={loading}
        >
          Gửi báo cáo
        </Button>
      </View>
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
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
    color: '#000',
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  statusOption: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedStatusOption: {
    backgroundColor: '#ddd',
  },
  statusOptionText: {
    fontSize: 16,
    color: '#000',
  },
  saveButton: {
    marginTop: 16,
  },
});

export default ReportDeviceScreen;
