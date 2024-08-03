// import io from 'socket.io-client';
// import PushNotification from 'react-native-push-notification';
// import { useEffect } from 'react';
// const socket = io('http://192.168.1.11:3000'); 
// const send = () => {
// const CHANNEL_ID = '4'; // ID cố định cho kênh thông báo

//   useEffect(() => {
//     // Lắng nghe sự kiện 'receiveNotification' từ server
//     socket.on('receiveNotification', (message) => {
//       PushNotification.localNotification({
//         channelId: CHANNEL_ID, // Sử dụng channelId cố định
//         title: "Thông báo mới",
//         message: message,
//         importance: 4,
//         vibrate: 300,
//       });
//     });

//     // Tạo kênh thông báo
//     PushNotification.createChannel(
//       {
//         channelId: CHANNEL_ID, // ID duy nhất cho kênh này
//         channelName: "Thông báo", // Tên kênh thông báo
//         channelDescription: "Thông báo từ server", // Mô tả kênh
//         importance: 4, // Độ quan trọng của kênh (mức 4 là cao nhất)
//         vibrate: true, // Có sử dụng rung hay không
//       },
//       (created) => console.log(`createChannel returned '${created}'`) // Phản hồi sau khi tạo kênh
//     );

//     return () => {
//       socket.off('receiveNotification');
//     };
//   }, []);

//   const sendNotification = () => {
//     const message = 'Đây là một thông báo!';
//     socket.emit('sendNotification', message);
//   };
// }
// export default send;
// send.js

import io from 'socket.io-client';
import PushNotification from 'react-native-push-notification';
import { useEffect } from 'react';

const socket = io('http://192.168.1.51:3000');
const CHANNEL_ID = '4'; // ID cố định cho kênh thông báo

const useNotificationSetup = () => {
  useEffect(() => {
    // Lắng nghe sự kiện 'receiveNotification' từ server
    socket.on('receiveNotification', (message) => {
      PushNotification.localNotification({
        channelId: CHANNEL_ID, // Sử dụng channelId cố định
        title: "Thông báo mới",
        message: message,
        importance: 4,
        vibrate: 300,
      });
    });

    // Tạo kênh thông báo
    PushNotification.createChannel(
      {
        channelId: CHANNEL_ID, // ID duy nhất cho kênh này
        channelName: "Thông báo", // Tên kênh thông báo
        channelDescription: "Thông báo từ server", // Mô tả kênh
        importance: 4, // Độ quan trọng của kênh (mức 4 là cao nhất)
        vibrate: true, // Có sử dụng rung hay không
      },
      (created) => console.log(`createChannel returned '${created}'`) // Phản hồi sau khi tạo kênh
    );

    return () => {
      socket.off('receiveNotification');
    };
  }, []);
};

export const sendNotification = () => {
  const message = 'Đây là một thông báo!';
  socket.emit('sendNotification', message);
};

export default useNotificationSetup;
