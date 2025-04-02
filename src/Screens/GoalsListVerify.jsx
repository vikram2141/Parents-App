import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import MultiSelect from 'react-native-multiple-select';
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import FormData from "form-data";
import Ionicons from "react-native-vector-icons/Ionicons";

const GoalsListVerify = () => {
  const [formData, setFormData] = useState({
    caregiverName: "",
    caregiverSignature: "",
    staffName: "",
  });

  const [selectedStaff, setSelectedStaff] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (!storedUserData) {
          console.error("User data not found in AsyncStorage");
          return;
        }

        const userData = JSON.parse(storedUserData);
        const token = userData?.api_token;
        if (!token) {
          console.error("No token found in stored user data");
          return;
        }

        console.log("Fetching therapists with token:", token);

        const response = await axios.get("https://therapy.kidstherapy.me/api/therapist-list", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response.data);

        if (response.data && Array.isArray(response.data.therapists)) {
          const formattedData = response.data.therapists.map((therapist) => ({
            label: therapist.name,
            value: therapist.id.toString(),
          }));
          setStaffList(formattedData);
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching therapists:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  
  const handleSave = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (!storedUserData) {
        Alert.alert("Error", "User data not found.");
        return;
      }

      const userData = JSON.parse(storedUserData);
      const token = userData?.api_token;
      if (!token) {
        Alert.alert("Error", "No authentication token found.");
        return;
      }

      let data = new FormData();
      data.append("note_id","74"); 
      data.append("therapist_id_or_staff_ids", formData.staffName);
      data.append("parent_name", formData.caregiverName);
      data.append("parent_signature", formData.caregiverSignature);

      let config = {
        method: "post",
        url: "https://therapy.kidstherapy.me/api/verify-mark-signin",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        data: data,
      };

      const response = await axios.request(config);
      console.log("API Response:", response.data);

      if (response.data.success) {
        Alert.alert("Success", "Data saved successfully!");
      } else {
        Alert.alert("Error", response.data.message || "Failed to save data.");
      }
    } catch (error) {
      console.error("Error saving data:", error.response?.data || error.message);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
      <Icon name="chevron-left" size={30} color="white" />
</TouchableOpacity>

        <Text style={styles.headerTitle}>Goals List</Text>
      </View>

     

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.inactiveButton} onPress={() => navigation.navigate("GoalsListDetail")}>
          <Text style={styles.inactiveText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inactiveButton} onPress={() => navigation.navigate("GoalsListNotes")}>
          <Text style={styles.inactiveText}>Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.activeButton}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>

      {/* <Text style={styles.label}>Parent/Caregiver</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={formData.caregiverName}
        onChangeText={(text) => handleInputChange("caregiverName", text)}
      /> */}

      {/* <Text style={styles.label}>Parent/Caregiver Signature</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Signature"
        value={formData.caregiverSignature}
        onChangeText={(text) => handleInputChange("caregiverSignature", text)}
      /> */}

      <Text style={styles.label}>Name of Staff</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <MultiSelect
  items={staffList}
  uniqueKey="value"
  onSelectedItemsChange={(selectedItems) => setSelectedStaff(selectedItems)}
  selectedItems={selectedStaff}
  selectText="  Select Staff"
  searchInputPlaceholderText="Search..."
  tagRemoveIconColor="#007bff"
  tagBorderColor="#007bff"
  tagTextColor="#007bff"
  selectedItemTextColor="#007bff"
  selectedItemIconColor="#007bff"
  itemTextColor="#000"
  displayKey="label"
  searchInputStyle={styles.searchInput}
  submitButtonText="Done"
  styleDropdownMenuSubsection={styles.dropdownMenu}
  styleInputGroup={styles.inputGroup}
  styleItemsContainer={styles.itemsContainer}
  styleSelectorContainer={styles.selectorContainer}
  styleMainWrapper={styles.mainWrapper}
/>

        
      )}
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
  }, searchInput: {
    color: "#000",
    fontSize: 16,
    padding: 8,
  },
  dropdownMenu: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    padding:22,    

    borderColor: "#007bff",
  },
  inputGroup: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    padding:5,
    borderColor: "#007bff",
  },
  itemsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
  },
  selectorContainer: {
    marginVertical: 5,
  },
  mainWrapper: {
    marginHorizontal: 20,
    marginBottom: 10,
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
  syncButton: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
    top:5,
    width: 100,
    marginStart:270,
    borderWidth:1,
    borderColor:"blue",
    alignItems: 'center',
    marginRight:20,
    marginLeft:200,
  },
  syncText: {
    color: '#007AFF',
    fontWeight: '500',
    fontSize: 16,
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
    color: 'black',
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
    padding:12,
    marginHorizontal:20,


  },
  input: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 10,
    fontSize: 14,
    marginHorizontal:20,
    color:"black",
    
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 60,
    alignItems: "center",
    marginTop: 70,
    margin:20,
  },activeButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },dropdown: { marginHorizontal: 20, backgroundColor: "#F5F5F5", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  placeholderStyle: { fontSize: 14, color: "#A0A0A0" },
  selectedTextStyle: { fontSize: 14, color: "#000" },
  inputSearchStyle: { fontSize: 14, color: "#000" },
  iconStyle: { marginRight: 10 },
  icon: { marginRight: 10 },
});

export default GoalsListVerify;
