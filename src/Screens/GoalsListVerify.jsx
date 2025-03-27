import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from "@react-navigation/native";

const GoalsListVerify = () => {
  const [formData, setFormData] = useState({
    caregiverName: "",
    caregiverSignature: "",
    staffName: "",
    staffSignature: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };
   const navigation = useNavigation();
  
    const handleGoalsListNotesScreen = () => {
      navigation.navigate("GoalsListNotes");
    };
    const handleDataDetailScreen = () => {
      navigation.navigate("DataDetail");
    };
    const handleGoalsListVerify= () => {
      navigation.navigate("GoalsListVerify");
    };
   
    

  return (
    <View style={styles.container}>
     <View style={styles.header}>
             <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
               <Icon name="chevron-left" size={30} color="white" />
             </TouchableOpacity>
             <Text style={styles.headerTitle}>Goals List</Text>
            
           </View>
          
           {/* Tabs */}
          
                {/* Tab Buttons */}
                <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.inactiveButton} onPress={handleDataDetailScreen}>
                              <Text style={styles.inactiveText}>Details</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.inactiveButton} onPress={handleGoalsListNotesScreen} >
                              <Text style={styles.inactiveText}>Notes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.activeButton} onPress={handleGoalsListVerify}>
                              <Text style={styles.buttonText}>Verify</Text>
                            </TouchableOpacity>
                           
                          </View>

        {/* Form Inputs */}
        <Text style={styles.label}>Parent/Caregiver</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          value={formData.caregiverName}
          onChangeText={(text) => handleInputChange("caregiverName", text)}
        />

        <Text style={styles.label}>Parent/Caregiver Signature</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Signature"
          value={formData.caregiverSignature}
          onChangeText={(text) => handleInputChange("caregiverSignature", text)}
        />

        <Text style={styles.label}>Name of Staff</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          value={formData.staffName}
          onChangeText={(text) => handleInputChange("staffName", text)}
        />

        <Text style={styles.label}>Staff Signature</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Signature"
          value={formData.staffSignature}
          onChangeText={(text) => handleInputChange("staffSignature", text)}
        />

        {/* Save Button */}
       
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#007BFF",
    padding: 40,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  }, header: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    backgroundColor: '#007AFF', borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
    width: 40,
  },
  
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding:23,
  }, buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
    marginHorizontal:4,
  },
   activeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 20,
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
    borderRadius: 0,
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
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
 
  
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#007AFF',
    fontWeight: '500',
    fontSize: 16,
  },
  activeTabText: {
    color: 'white',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: "#007BFF",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  buttonTextOutline: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  buttonPrimary: {
    backgroundColor: "#007BFF",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginLeft:250,
    marginRight:20,
  },
  buttonTextDisabled: {
    color: "#A0A0A0",
    fontWeight: "bold",
    alignItems:"center",
    
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 5,
    padding:5,
    marginHorizontal:20,
    color:"#090D4D"


  },
  input: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 10,
    fontSize: 14,
    marginHorizontal:20,
    
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 60,
    alignItems: "center",
    marginTop: 40,
    margin:20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default GoalsListVerify;
