import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import bcrypt from 'react-native-bcrypt';
import { randomBytes } from 'react-native-randombytes';

// Set the fallback random number generator for bcrypt
bcrypt.setRandomFallback((length) => {
  return randomBytes(length).toString('hex').slice(0, length);
});

// Function to hash passwords
const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          reject(err);
        } else {
          resolve(hashedPassword);
        }
      });
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

// Function to compare passwords during sign-in
const comparePasswords = async (password, hashedPassword) => {
  try {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          reject(err);
        } else {
          resolve(isMatch);
        }
      });
    });
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw error;
  }
};

// Function to sign up a new user
const signUp = async (username, phone, email, password, role, roomId) => {
  try {
    if (!username || !phone || !email || !password || !role) {
      throw new Error("Please enter all required data");
    }

    // Hash the password before storing it
    const hashedPassword = await hashPassword(password);

    const userCredential = await auth().createUserWithEmailAndPassword(
      email.trim(),
      password
    );

    const finalRoomId = roomId || "1";
    const user = userCredential.user;

    await user.updateProfile({
      displayName: username,
    });

    // Store the hashed password in Firestore
    await firestore().collection("USERS").doc(user.email).set({
      username,
      phone,
      email,
      password: hashedPassword, // Save the hashed password
      role,
      roomId: finalRoomId,
    });

    return user.email;
  } catch (error) {
    console.error("Error signing up:", error.message);
    throw error;
  }
};

// Function to sign in an existing user
const signIn = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error("Please enter email and password");
    }

    // Fetch the user document from Firestore to get the hashed password
    const userDoc = await firestore().collection("USERS").doc(email).get();
    if (!userDoc.exists) {
      throw new Error("User not found");
    }
    const userData = userDoc.data();

    // Compare the entered password with the stored hashed password
    const isMatch = await comparePasswords(password, userData.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const userCredential = await auth().signInWithEmailAndPassword(
      email.trim(),
      password
    );

    const user = userCredential.user;
    console.log("User signed in successfully:", user.uid);

    return user.uid;
  } catch (error) {
    console.error("Error signing in:", error.message);
    throw error;
  }
};

// Function to sign out the current user
const signOut = async () => {
  try {
    await auth().signOut();
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error.message);
    throw error;
  }
};

// Exporting the Auth functions
const Auth = {
  signUp,
  signIn,
  signOut,
};

export default Auth;
