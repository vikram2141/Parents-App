import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons"; 
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation } from "@react-navigation/native";


const HomeScreen = () => {
 
  const [showArchived, setShowArchived] = useState(false);
  const [showCanceled, setShowCanceled] = useState(true);
  const navigation = useNavigation();

  const appointments = [
    { id: "1", title: "Direct Therapy with Taha", date: "17 Feb 2025", time: "03:00 PM - 05:30 PM", billable: "Billable", status: "Completed" },
    { id: "2", title: "Direct Therapy with John", date: "17 Feb 2025", time: "03:00 PM - 05:30 PM", billable: "Billable", status: "Completed" },
    { id: "3", title: "Direct Therapy with John", date: "17 Feb 2025", time: "03:00 PM - 05:30 PM", billable: "Billable", status: "Pending" },
    { id: "4", title: "Direct Therapy with John", date: "17 Feb 2025", time: "03:00 PM - 05:30 PM", billable: "Billable", status: "Need Verification" },
    { id: "5", title: "Direct Therapy with John", date: "17 Feb 2025", time: "03:00 PM - 05:30 PM", billable: "Billable", status: "Completed" },
    { id: "6", title: "Direct Therapy with John", date: "17 Feb 2025", time: "03:00 PM - 05:30 PM", billable: "Billable", status: "Completed" },
    { id: "7", title: "Direct Therapy with John", date: "17 Feb 2025", time: "03:00 PM - 05:30 PM", billable: "Billable", status: "Need Verification" },

  ];

  const handleAppointmentPress = (appointment) => {
    navigation.navigate("GoalsListDetail", { appointment });
  };
 
  

  const renderAppointment = ({ item }) => (
    <TouchableOpacity onPress={() => handleAppointmentPress(item)} style={[styles.card, item.status === "Completed" ? styles.completedCard : styles.pendingCard]}>
      <View style={styles.iconContainer}>
        {item.status === "Completed" ? (
          <AntDesign name="checksquare" size={40} color="#00AB5F" />
        ) : (
          <FontAwesome name="calendar" size={40} color="#FF6930" />
        )}
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{`${item.date}  ${item.time}`}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.billable}>{item.billable}</Text>
          <Text style={[styles.statusText, item.status === "Completed" ? styles.completedText : styles.pendingText]}>
            {item.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleDataDetailScreen = () => {
    navigation.navigate("DataDetail");
  };

  const handleGoalsListDetailScreen = () => {
    navigation.navigate("GoalsListDetail");
  };
  const handleProfileScreen = () => {
    navigation.navigate("Profile");
  };
  const handleCollectDataScreen = () => {
    navigation.navigate("CollectData");
  }; 
  const handleInvoiceScreen = () => {
    navigation.navigate("InvoiceScreen");
  };
  const handleNotificationScreen = () => {
    navigation.navigate("Notification");
  };
  

  return (
    <View style={styles.container}>
       

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: "https://s3-alpha-sig.figma.com/img/4162/414c/9b3f703ad8d5623b1cf082032f5945e2?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=mYPodw9VISmiL3Te0b0NsD1K3t9IV6JBwH7V0~RER-1unny7yayjiksOTxetl0XU0uwV1KqsAUbQ8vThqHlMm42EawzLagnpyx02xITEu3CH7wzGBNvOWNekEp2NiRZ~3etFDkC-LKjgEScvKTGjZCcg4hU3D0NV2fAYDH0kVez2cKLlEkHCQXxexzCkOIeOv7MraUxkyZVZyvNOE9tsWlmwIpNckULLd~eImFK1-c1wEloYTSaCnyBtKpDg4pd6EV4~FAgJ0Cw20HWMISE9KWFZcAjp6vRYqBhzZvZGn19fLG7rZxqhAABopPZuehdneCD7ZnRrPngd~Y3yfqHPpQ__" }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.welcomeText}>Welcome Back,</Text>
            <Text style={styles.username}>Taha</Text>
          </View>
        </View>

        {/* Logo & Notification Icon */}
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.logoButton}>
            <Text style={styles.logoText}>Logo Here</Text>
          </TouchableOpacity >
          <TouchableOpacity style={styles.bell} onPress={handleNotificationScreen}>
          <FontAwesome name="bell" size={20} color="#0080DC"   />
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
      <ScrollView>
        <FlatList data={appointments} keyExtractor={(item) => item.id} renderItem={renderAppointment} />
      </ScrollView>
      {/* Bottom Navigation */}
       <View style={styles.bottomNav}>
              <TouchableOpacity style={styles.navItem} >
                <FontAwesome name="home" size={24} color="white" />
                <Text style={styles.navText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={handleCollectDataScreen}>
                <FontAwesome name="database" size={24} color="white" />
                <Text style={styles.navText}>Data Collect</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navItem} onPress={handleInvoiceScreen}>
                <FontAwesome5 name="file-invoice-dollar" size={24} color="white" />
                <Text style={styles.navText}>Invoice</Text>
              </TouchableOpacity> 

              <TouchableOpacity style={styles.navItem} onPress={handleProfileScreen}>
              <Image
            source={{ uri: "https://s3-alpha-sig.figma.com/img/4162/414c/9b3f703ad8d5623b1cf082032f5945e2?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=mYPodw9VISmiL3Te0b0NsD1K3t9IV6JBwH7V0~RER-1unny7yayjiksOTxetl0XU0uwV1KqsAUbQ8vThqHlMm42EawzLagnpyx02xITEu3CH7wzGBNvOWNekEp2NiRZ~3etFDkC-LKjgEScvKTGjZCcg4hU3D0NV2fAYDH0kVez2cKLlEkHCQXxexzCkOIeOv7MraUxkyZVZyvNOE9tsWlmwIpNckULLd~eImFK1-c1wEloYTSaCnyBtKpDg4pd6EV4~FAgJ0Cw20HWMISE9KWFZcAjp6vRYqBhzZvZGn19fLG7rZxqhAABopPZuehdneCD7ZnRrPngd~Y3yfqHPpQ__" }}
            style={styles.profileImages}
          />              <Text style={styles.navText}>Profile</Text>
              </TouchableOpacity>
            </View>

    </View>
  );
};
// Navigation Item Component



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
      fontSize: 22,
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
    headerIcons: {
      flexDirection: "row",
      alignItems: "center",
    },
    logoButton: {
      backgroundColor: "#fff",
      paddingHorizontal: 20,
      paddingVertical: 5,
      borderRadius: 6,
      marginRight:80,
      top:-15,
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
