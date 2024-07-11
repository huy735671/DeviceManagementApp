import React, { createContext, useContext, useReducer, useMemo } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const MyContext = createContext();
MyContext.displayName = "MyContext";

function reducer(state, action) {
    switch (action.type) {
      case "USER_LOGIN":
        return { ...state, userLogin: action.value };
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
  function MyContextControllerProvider({ children }) {
    const initialState = {
      user: null,
    };
    const [controller, dispatch] = useReducer(reducer, initialState);
    const value = useMemo(() => [controller, dispatch], [controller]);
    return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
  }
  function useMyContextController() {
    const context = useContext(MyContext);
    if (!context) {
      throw new Error(
        "useMyContextController should be used inside the MyContextControllerProvider."
      );
    }
    return context;
  }
  const USERS = firestore().collection("USERS");
  const login = (dispatch, email, password) => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() =>
        USERS.doc(email).onSnapshot((u) => {
          const value = u.data();
          console.log("Đăng Nhập Thành Công voi user: ", value);
          dispatch({ type: "USER_LOGIN", value });
        })
      )
      .catch((e) => alert("Sai user va password"));
  };
  
  const logout = (dispatch) => {
    dispatch({ type: "USER_LOGIN" });
  };
  
  export {
    MyContextControllerProvider,
    useMyContextController,
    login,
    logout,
   
  };