import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar
} from 'react-native';

// Note the added destructuring: { navigation }
export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleOTPVerificationScreen = () => {
    // Now you can navigate properly
    navigation.navigate('OTPVerification');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.logoButton}>
        <Text style={styles.logoText}>Logo Here</Text>
        </TouchableOpacity >

      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your email for the verification process we  will send 6 digits code to your email
        </Text>
       <Text style={styles.label}>Enter Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleOTPVerificationScreen}>
        <Text style={styles.sendButtonText}>Send code</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#0073e6",
    padding: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
  },
  logoButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 6,
  },
  logoText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#090D4D",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#090D4D',
  },
  subtitle: {
    fontSize: 14,
    color: '#090D4D',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    color: "#090D4D",
    paddingBottom:10,
    },
  input: {
    backgroundColor: '#E7EDFF',
    borderRadius: 4,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#090D4DB2',
    marginBottom: 15,
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 60,
    paddingVertical: 10,
    alignItems: 'center',
    margin:10,
    top:15,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
