// NotificationService.js
import firestore from '@react-native-firebase/firestore';

const reportsCollection = firestore().collection('reports');
const usersCollection = firestore().collection('users');

export async function getReports() {
  const snapshot = await reportsCollection.orderBy('timestamp', 'desc').get();
  return snapshot.docs.map(doc => doc.data());
}

export async function getUsers() {
  const snapshot = await usersCollection.get();
  return snapshot.docs.map(doc => doc.data());
}

export async function getNotifications() {
  const reports = await getReports();
  const users = await getUsers();

  const notifications = reports.map(report => {
    const user = users.find(user => user.id === report.userId);
    return {
      id: report.id,
      title: report.title,
      description: report.description,
      userName: user ? user.name : 'Unknown User',
      userType: user ? user.type : 'unknown',
      timestamp: report.timestamp,
    };
  });

  return notifications;
}
