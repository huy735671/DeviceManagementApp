// Firestore structure
notifications: [
    {
      id: "notificationId1",
      title: "Admin Notification",
      body: "This is a notification for admin",
      type: "admin", // hoặc "user"
      timestamp: firestore.FieldValue.serverTimestamp(),
    },
    {
      id: "notificationId2",
      title: "User Notification",
      body: "This is a notification for user",
      type: "user", // hoặc "admin"
      timestamp: firestore.FieldValue.serverTimestamp(),
    }
  ]
  