import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function GoalsListScreen() {
  const [activeTab, setActiveTab] = useState("Details");

  const navigation = useNavigation();
  
    const handleDataDetailScreen = () => {
      navigation.navigate("DataDetail");
    };
        
          const handleGoalsListNotesScreen = () => {
            navigation.navigate("GoalsListNotes");
          };
    
        
          const handleGoalsListVerify= () => {
            navigation.navigate("GoalsListVerify");
          }; 
  return (
    <View style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
       <View  style={styles.back}> 
        <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={25} color="#fff"  />
        </TouchableOpacity>
       </View>
               <Text style={styles.logoText}>Goals List</Text>
           </View>

      {/* Sync Button */}
     
      {/* Tab Buttons */}
      <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.activeButton}>
                    <Text style={styles.buttonText}>Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inactiveButton}  onPress={handleGoalsListNotesScreen}>
                    <Text style={styles.inactiveText}>Notes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inactiveButton} onPress={handleGoalsListVerify}>
                    <Text style={styles.inactiveText}>Verify</Text>
                  </TouchableOpacity>
                 
                </View>

      {/* Content Section */}
      <ScrollView style={styles.contentContainer}>
      <View style={styles.infoBox}>
        {[
          { label: 'Client Name', value: 'Taha' },
          { label: 'Staff Name', value: 'JP Tandon' },
          { label: 'Service Type', value: 'ABC' },
          { label: 'Service', value: 'Direct Therapy' },
          { label: 'Activity', value: 'Activity' },
          { label: 'Date', value: '17 Feb 2025' },
          { label: 'Time', value: '03:00 PM - 05:30 PM' },
          { label: 'Supervisor', value: 'John' },
          { label: 'Status', value: 'Completed' },
          { label: 'Appointment Id', value: '123456' },
          { label: 'Notes', value: 'Abcdef' },
        ].map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.label}>{item.label}:</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </View>
      </ScrollView>

   
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FD",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#0073e6",
    padding: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,

  },
  back:{
  marginLeft:-300,
  top:20,
  color:"#fff"
  },
  buttonText:{
    color:"#fff"
  },
  logoButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 6,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  
  
  syncButton: {
    alignSelf: "flex-end",
    backgroundColor: "#E7EDFF",
    borderWidth: 1,
    borderColor: "#0080DC",
    paddingVertical:8,
    paddingHorizontal: 32,
    borderRadius: 50,
    marginRight:20,
    top:-19
  },
  syncText: {
    color: "#0080DC",
    fontWeight: "bold",  

  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding:23
  }, buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 1,
    marginHorizontal:8,
    top:-10
  },
  activeButton: {
    backgroundColor: '#0080DC',
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 20,
    color:"#fff",
  },
  inactiveButton: {
    borderColor: '#007bff',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 12,
    borderRadius: 9,
    backgroundColor: "white",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0080DC",
    
  },
  activeTab: {
    backgroundColor: "#0080DC",
  },
  tabText: {
    color: "#0080DC",
    fontWeight: "bold",
    
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  infoBox: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    margin:20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  collectButton: {
    backgroundColor: "#0080DC",
    paddingVertical: 12,
    borderRadius: 60,
    alignItems: "center",
    marginVertical: 15,
    margin:20,
    marginBottom:50,
  },
  collectButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
