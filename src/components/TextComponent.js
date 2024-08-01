import React from 'react';
import { Text, StyleSheet } from 'react-native';


const TextComponent = ({ children, fontSize, color }) => {
  return (
    <Text style={[styles.text, { fontSize, color }]}>
      {children}
    </Text>
  )
}

export default TextComponent

const styles = StyleSheet.create({
  text: {
    fontSize: 16, // default size
    color: 'black', // default color
  },
});