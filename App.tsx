import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/Screens/LoginScreen';
import ForgotPasswordScreen from './src/Screens/ForgotPasswordScreen';
import OTPVerificationScreen from './src/Screens/OTPVerificationScreen';
import CreateNewPasswordScreen from './src/Screens/CreateNewPasswordScreen';
import HomeScreen from './src/Screens/HomeScreen';
import ProfileScreen from './src/Screens/ProfileScreen';
import GoalsListDetailScreen from './src/Screens/GoalsListDetailScreen';
import ConfirmationModal from './src/Screens/ConfirmationModal';
import GoalsListVerify from './src/Screens/GoalsListVerify';
import DataDetailScreen from './src/Screens/DataDetailScreen';
import GoalsListNotesScreen from './src/Screens/GoalsListNotesScreen';
import NotificationScreen from './src/Screens/NotificationScreen';
import CollectDataScreen from './src/Screens/CollectDataScreen';
import InvoiceScreen from './src/Screens/InvoiceScreen';
import InvoiceDetailScreen from './src/Screens/InvoiceDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen}options={{ headerShown: false }} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen}options={{ headerShown: false }} />
        <Stack.Screen name="CreateNewPassword" component={CreateNewPasswordScreen}options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/> 
        <Stack.Screen name="Profile" component={ProfileScreen}options={{ headerShown: false }} />
        <Stack.Screen name="GoalsListDetail" component={GoalsListDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GoalsListNotes" component={GoalsListNotesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ConfirmationModal" component={ConfirmationModal} options={{ headerShown: false }} />
        <Stack.Screen name="GoalsListVerify" component={GoalsListVerify} options={{ headerShown: false }} />
        <Stack.Screen name="DataDetail" component={DataDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CollectData" component={CollectDataScreen} options={{ headerShown: false }} />
        <Stack.Screen name="InvoiceScreen" component={InvoiceScreen} options={{ headerShown: false }} />
        <Stack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} options={{ headerShown: false }}/>
 </Stack.Navigator>
    </NavigationContainer>
  );
}
