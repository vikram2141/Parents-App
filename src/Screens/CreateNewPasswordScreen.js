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
import { useNavigation } from "@react-navigation/native"; // Import navigation hook

export default function CreateNewPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const handleToggleNewPassword = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  const handleToggleConfirmPassword = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleResetPassword = () => {
    // TODO: Implement your reset password logic here
    console.log('New Password:', newPassword);
    console.log('Confirm Password:', confirmPassword);
  };
  const navigation = useNavigation(); // Initialize navigation

  const handleLoginScreen=()=>{
    navigation.navigate("Login");
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007bff" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.logoButton}>
        <Text style={styles.logoText}>Logo Here</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.subtitle}>
          Set the new password for your account so you can login and access all the features
        </Text>

        {/* New Password Input */}
        <Text style={styles.label}>Enter New Password</Text>

        <View style={styles.inputContainer}>          
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Enter New Password"
            placeholderTextColor="#999"
            secureTextEntry={!isNewPasswordVisible}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={handleToggleNewPassword} style={styles.eyeIcon}>
            <Text style={{ color: '#007bff' }}>
              {isNewPasswordVisible ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Enter Confirm Password</Text>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Enter Confirm Password"
            placeholderTextColor="#999"
            secureTextEntry={!isConfirmPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={handleToggleConfirmPassword} style={styles.eyeIcon}>
            <Text style={{ color: '#007bff' }}>
              {isConfirmPasswordVisible ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reset Password Button */}
        <TouchableOpacity style={styles.resetButton} onPress={handleLoginScreen}>
          <Text style={styles.resetButtonText}>Reset Password</Text>
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    color: "#090D4D",
    marginBottom:10,

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 15,
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  eyeIcon: {
    marginRight: 10,
  },
  resetButton: {
    backgroundColor: '#007bff',
    borderRadius: 59,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
