import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const [showArchived, setShowArchived] = useState(false);
  const [showCanceled, setShowCanceled] = useState(true);
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchUserAndAppointments();
  }, []);

  const fetchUserAndAppointments = async () => {
    try {
      setLoading(true);
      const user = await AsyncStorage.getItem("userData");
      if (!user) throw new Error("User not found in storage");

      const userData = JSON.parse(user);
      if (!userData.api_token) throw new Error("Token missing");

      // Fetch User Profile
      const profileResponse = await axios.get(
        "https://therapy.kidstherapy.me/api/profile",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userData.api_token}`,
          },
        }
      );
      setUser(profileResponse.data);

      // Fetch Appointments
      const appointmentsResponse = await axios.get(
        "https://therapy.kidstherapy.me/api/therapist-appointments",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userData.api_token}`,
          },
        }
      );
      setAppointments(appointmentsResponse.data.appointments);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentPress = (appointment) => {
    navigation.navigate("GoalsListDetail", { appointment });
  };

  const renderAppointment = ({ item }) => {
    const status =
      item.appointment_status?.name === "Completed" ? "Completed" : "Pending";

    return (
      <TouchableOpacity
        onPress={() => handleAppointmentPress(item)}
        style={[
          styles.card,
          status === "Completed" ? styles.completedCard : styles.pendingCard,
        ]}
      >
        <View style={styles.iconContainer}>
          {status === "Completed" ? (
            <AntDesign name="checksquare" size={40} color="#00AB5F" />
          ) : (
            <FontAwesome name="calendar" size={40} color="#FF6930" />
          )}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>
            Direct Therapy with {item.user?.name}
          </Text>
          <Text style={styles.date}>
            {`${item.appointment_date}  ${item.start_time} - ${item.end_time}`}
          </Text>
          <View style={styles.statusContainer}>
            <Text style={styles.billable}>Billable</Text>
            <Text
              style={[
                styles.statusText,
                status === "Completed" ? styles.completedText : styles.pendingText,
              ]}
            >
              {status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: user?.profile_picture || "https://via.placeholder.com/100",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.welcomeText}>Welcome Back,</Text>
          <Text style={styles.username}>{user?.name || "User"}</Text>
        </View>

        {/* Notification Icon */}
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.logoButton}>
            <Image
              source={require("../../src/assets/sun.png")}
              style={styles.logoImage}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bell} onPress={() => navigation.navigate("Notification")}>
            <FontAwesome name="bell" size={20} color="#0080DC" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Toggle Switches */}
      <View style={styles.toggleContainer}>
        <View style={styles.toggleOption}>
          <Text>Show Archived</Text>
          <Switch value={showArchived} onValueChange={setShowArchived} />
        </View>
        <View style={styles.toggleOption}>
          <Text>Show Canceled</Text>
          <Switch value={showCanceled} onValueChange={setShowCanceled} />
        </View>
      </View>

      <Text style={styles.calendarTitle}>Calendar</Text>

      {/* Appointments List */}
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAppointment}
        ListEmptyComponent={() => <Text style={styles.noData}>No Appointments</Text>}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome name="home" size={24} color="white" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("CollectData")}
        >
          <FontAwesome name="database" size={24} color="white" />
          <Text style={styles.navText}>Data Collect</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Image
            source={{ uri: user?.profile_picture || "https://via.placeholder.com/100" }}
            style={styles.profileImages}
          />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
 
    container: {
      flex: 1,
      backgroundColor: "#F8F9FA",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#0073E6",
      height:158,
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
    },
     bottomNav:
     { flexDirection: 'row',
       justifyContent: 'space-around',
        backgroundColor: '#007bff', 
        padding: 10,
         position: 'absolute',
          bottom: 0, 
          width: '100%',
            borderRadius: 25,
          },
    navItem: { 
      alignItems: 'center' 
    },
    navText: { 
      color: 'white', 
      fontSize: 12,
       marginTop: 2 
      },
    userInfo: {
    alignItems: "center",
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 25,
      marginRight: 10,
      
    },
    profileImages:{
      width: 25,
      height: 25,
      borderRadius: 25,
      marginRight: 10,
    },
    welcomeText: {
      color: "#fff",
      fontSize: 12,
      marginTop:10,
      marginStart:20,
    },
    username: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
      marginStart:20,
  
    },
    bell:{
    color:"#FFFFFF",
    width:30,
    height:30,
    backgroundColor:"#FFFFFF",
    borderRadius:40,
    paddingTop:4,
    marginRight:20,
    alignItems:"center",
    top:-20,
    

    },
    logoButton: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
    },
    logoImage: {
      width: 100, // Adjust size as needed
      height: 100, // Adjust size as needed
      resizeMode: 'contain',    
        borderRadius:90,
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 6,

    },
    headerIcons: {
      flexDirection: "row",
      alignItems: "center",
    },
    logoButton: {
      backgroundColor: "#fff",
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderRadius: 60,
      marginRight:80,
      
    },
    logoText: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#090D4D",      
    },
     toggleContainer: {
       flexDirection: "row",
        justifyContent: "space-between"
        , marginTop: 20,
         marginHorizontal:15 ,
         },
  toggleOption: {
     flexDirection: "row",
      alignItems: "center",
      color:"#0080DC33",
       gap: 10 },
  calendarTitle: {
     fontSize: 18, 
     fontWeight: "bold"
     , marginVertical: 15,
      marginHorizontal: 20,
      color:"#090D4D",
     },
  card: {
     flexDirection: "row",
      alignItems: "center",
       padding: 15, 
       borderRadius: 10,
        marginBottom: 10, shadowColor: "#000",
         shadowOpacity: 0.1, shadowRadius: 5, elevation: 3,
          marginHorizontal: 15,
          borderWidth:1,
          borderColor:"#0080DC33",
           height: 120,
           paddingBottom:0,
          
           },
  completedCard: { 
    backgroundColor: "#E7EDFF"

   },
  pendingCard: {
     backgroundColor: "#E7EDFF"
     },
  iconContainer: {
     marginRight: 10,
     top:-12
     },
  detailsContainer: { flex: 1 },
  title: {
     fontSize: 14,
     fontWeight: "bold",
      color: "#090D4D" },
  date: {
     fontSize: 12,
      color: "#090D4D",
      marginVertical: 5 },
  statusContainer: {
     flexDirection: "row",
      justifyContent: "space-between" },
  billable: {
     fontSize: 14,
      fontWeight: "bold", 
      marginLeft:-45,
      color: "#090D4D" },
  statusText: {
     fontSize: 12,
      fontWeight: "bold" },
  completedText: {
     color: "#00AB5F" },
  pendingText: {
     color: "#FF6930" },
  
});

export default HomeScreen;
