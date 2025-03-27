import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
const sessions = [
  { id: '1', title: 'Direct Therapy with taha, Hor', date: '17 Feb 2025', time: '03:00 PM - 05:30 PM', status: 'Completed' },
  { id: '2', title: 'Direct Therapy with taha, Hor', date: '17 Feb 2025', time: '03:00 PM - 05:30 PM', status: 'Completed' },
  { id: '3', title: 'Direct Therapy with taha, Hor', date: '17 Feb 2025', time: '03:00 PM - 05:30 PM', status: 'Completed' },
  { id: '4', title: 'Direct Therapy with taha, Hor', date: '17 Feb 2025', time: '03:00 PM - 05:30 PM', status: 'Completed' }
];


const CollectDataScreen = () => {

  const navigation = useNavigation();

 
  const handleHomeScreen = () => {
    navigation.navigate("Home");
  };
    
    const handleProfileScreen = () => {
      navigation.navigate("Profile");
    };
    const handleCollectDataScreen = () => {
      navigation.navigate("CollectData");
    };  const handleGoalsListDetailScreen = () => {
      navigation.navigate("DataDetail");
    };
    const handleInvoiceScreen = () => {
      navigation.navigate("InvoiceScreen");
    };
  return (
    <View style={styles.container}>
      {/* Header */}
       <View style={styles.header}>
                   <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                     <Icon name="chevron-left" size={30} color="white" />
                   </TouchableOpacity>
                   <Text style={styles.headerTitle}>Goals List</Text>
                  
                 </View>

      {/* Session List */}
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <AntDesign name="checksquare" size={20} color="white" style={styles.checkIcon} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>{item.date} {item.time}</Text>
              </View>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.billable}>Billable</Text>
              <Text style={styles.completed}>{item.status}</Text>
            </View>
            <TouchableOpacity style={styles.viewButton}onPress={handleGoalsListDetailScreen}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Bottom Navigation */}
     <View style={styles.bottomNav}>
                   <TouchableOpacity style={styles.navItem} onPress={handleHomeScreen} >
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
                     <FontAwesome name="user" size={24} color="white" />
                     <Text style={styles.navText}>Profile</Text>
                   </TouchableOpacity>
                 </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    backgroundColor: "#007BFF",
    padding: 40,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft:100,
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
  
  headerText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  card: { backgroundColor: 'white', padding: 15, margin: 10, borderRadius: 10, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  checkIcon: { backgroundColor: 'green', borderRadius: 5, padding: 8, marginRight: 10 },
  textContainer: { flex: 1 },
  title: { fontSize: 14, fontWeight: 'bold',color:'#090D4D' },
  date: { fontSize: 12, color: '#090D4D' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  billable: { fontSize: 14, fontWeight: 'bold',color:'#090D4D' },
  completed: { fontSize: 14, fontWeight: 'bold', color: 'green' },
  viewButton: { backgroundColor: '#007bff', padding: 8, marginTop: 10, borderRadius: 75, alignItems: 'center' ,marginLeft:130,marginRight:120,},
  viewButtonText: { color: 'white', fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#007bff', padding: 10, position: 'absolute', bottom: 0, width: '100%' },
  navItem: { alignItems: 'center' },
  navText: { color: 'white', fontSize: 12, marginTop: 2 },
  back:{
    marginLeft:-30,
  }
});

export default CollectDataScreen;
