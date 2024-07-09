import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const signUp = async (username, phone, email, password, role) => {
  try {
    if (!username || !phone || !email || !password  || !role) {
      throw new Error("Please enter all required data");
    }

    const userCredential = await auth().createUserWithEmailAndPassword(
      email.trim(),
      password
    );

    const user = userCredential.user;

    await user.updateProfile({
      displayName: username,
    });

    await firestore().collection('USERS').doc(user.email).set({
      username,
      phone,
      email,
      password, 
     
      role,
    });

    return user.email;
  } catch (error) {
    console.error('Error signing up:', error.message);
    throw error; 
  }
};
const signIn = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error("Please enter email and password");
    }

    const userCredential = await auth().signInWithEmailAndPassword(
      email.trim(),
      password
    );

    const user = userCredential.user;
    console.log('User signed in successfully:', user.uid);

    return user.uid;
  } catch (error) {
    console.error('Error signing in:', error.message);
    throw error; 
  }
};

const signOut = async () => {
  try {
    await auth().signOut();
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error.message);
    throw error;
  }
};

const Auth = {
  signUp,
  signIn,
  signOut,
};

export default Auth;
