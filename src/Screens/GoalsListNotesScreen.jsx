import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  StatusBar,
  Dimensions,Modal
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window');

const GoalsList = () => {
  const [activeTab, setActiveTab] = useState('Details');
    const [logoutVisible, setLogoutVisible] = useState(false);
  
  // Sample data for the chart
  const chartData = {
    labels: ["12/20/12", "12/21/14", "12/22/14", "12/22/50", "12/23/24"],
    datasets: [
      {
        data: [20, 100, 30, 60, 30],
        color: () => '#007AFF', // iOS blue color
        strokeWidth: 2
      }
    ],
  };

  // Sample data for the table
  const tableData = [
    { 
      id: 1, 
      description: 'ABC', 
      subDescription: 'Verbal & Motor Imitation (0)',
      value: 0,
      timeCount: '3 Minutes',
      hasChart: true
    },
    { 
      id: 2, 
      description: 'Gross Motor Imitation (3-2)', 
      value: null,
      hasChart: false
    },
    { 
      id: 3, 
      description: 'Gross Motor Imitation (1.0 3)', 
      value: '00:07',
      hasChart: false
    },
  ];

  const renderValueControl = (item) => {
    if (item.value === null) return null;
    
    const handleLogout = () => {
      setLogoutVisible(false);
      console.log("User logged out"); 
      // Add logout logic here (e.g., clearing auth state)
    };
    return (
      <View style={styles.valueControl}>
        <TouchableOpacity style={styles.minusButton}>
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>
        <View style={styles.valueDisplay}>
          <Text style={styles.valueText}>{item.value}</Text>
        </View>
        <TouchableOpacity style={styles.plusButton}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderActionButtons = () => {
    return (
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.graphButton} >
          <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <MaterialCommunityIcons name="close" size={20} color="#FF3B30" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton}>
          <MaterialCommunityIcons name="briefcase-download-outline" size={20} color="#34C759" />
        </TouchableOpacity>
      </View>
    );
  };
  const navigation = useNavigation();

  const handleGoalsListNotesScreen = () => {
    navigation.navigate("GoalsListNotes");
  };
   const handleGoalsListDetailScreen = () => {
    navigation.navigate("GoalsListDetail");
  };
 
  const handleGoalsListVerify= () => {
    navigation.navigate("GoalsListVerify");
  };
  const handleLogout = () => {
    setLogoutVisible(false);
    console.log("User logged out"); 
    // Add logout logic here (e.g., clearing auth state)
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      
      {/* Header */} 
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Goals List</Text>
       
      </View>
      
      {/* Tabs */}
         <View style={styles.buttonC}>
           {/* Tab Buttons */}
           <View style={styles.buttonContainer}>
             
                       <TouchableOpacity style={styles.inactiveButton}onPress={handleGoalsListDetailScreen}>
                         <Text style={styles.inactiveText}>Details</Text>
                       </TouchableOpacity>
                       <TouchableOpacity style={styles.activeButton}  onPress={handleGoalsListNotesScreen}>
                         <Text style={styles.buttonText}>Notes</Text>
                       </TouchableOpacity>
                       <TouchableOpacity style={styles.inactiveButton} onPress={handleGoalsListVerify}>
                         <Text style={styles.inactiveText}>Verify</Text>
                       </TouchableOpacity>
                      
                     </View>
                     </View>
      {/* Total Time Count */}
      <View style={styles.totalTimeContainer}>
        <Text style={styles.totalTimeText}>Total Time Count: 10 Minutes</Text>
      </View>
      
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Description</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Value</Text>
        <Text style={[styles.tableHeaderText, { flex: 0.7 }]}>Graph</Text>
        <Text style={[styles.tableHeaderText, { flex: 0.7 }]}>Action</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Table Rows */}
        {tableData.map((item, index) => (
          <View key={item.id}>
            <View style={styles.tableRow}>
              <View style={{ flex: 2 }}>
                <Text style={styles.descriptionText}>{item.description}</Text>
                {item.subDescription && (
                  <Text style={styles.subDescriptionText}>{item.subDescription}</Text>
                )}
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                {renderValueControl(item)}
              </View>
              <View style={{ flex: 1.4, flexDirection: 'row', justifyContent: 'space-around' }}>
                {renderActionButtons()}
              </View>
            </View>
            
            {/* Chart for first item */}
            {item.hasChart && (
              <View style={styles.chartContainer}>
                <LineChart
                  data={chartData}
                  width={width - 20}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#f0f5ff',
                    backgroundGradientFrom: '#f0f5ff',
                    backgroundGradientTo: '#f0f5ff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 0,
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: "#007AFF"
                    },
                    propsForBackgroundLines: {
                      stroke: "#d0d0ff",
                      strokeDasharray: "5, 5"
                    },
                    useShadowColorFromDataset: false
                  }}
                  bezier
                  style={styles.chart}
                  withInnerLines={true}
                  withOuterLines={false}
                  withVerticalLines={true}
                  withHorizontalLines={true}
                  fromZero={true}
                  yAxisLabel=""
                  yAxisSuffix=""
                  yAxisInterval={20}
                  segments={5}
                />
                <View style={styles.timeCountContainer}>
                  <Text style={styles.timeCountText}>Time Count: 3 Minutes</Text>
                </View>
                <View style={styles.pagination}>
                          <TouchableOpacity style={styles.pageButton}>
                            <Text style={styles.pageButtonText}>-1</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.pageButton}>
                            <Text style={styles.pageButtonText}>1</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.pageButton}>
                            <Text style={styles.pageButtonText}>1</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.pageButton}>
                            <Text style={styles.pageButtonText}>-1</Text>
                          </TouchableOpacity>
                        </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      
      
            {/* Logout Confirmation Modal */}
            <Modal transparent={true} visible={logoutVisible} animationType="fade">
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <MaterialCommunityIcons name="" size={40} color="blue" />
                  <Text style={styles.modalText}>
                  Are you sure you want to submit the data? Once submitted, it cannot be edited.
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setLogoutVisible(false)}>
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.yesButton} onPress={handleLogout}>
                      <Text style={styles.yesText}>Submit</Text>
                    </TouchableOpacity>
                    
                  </View>
                </View>
              </View>
            </Modal>
    </SafeAreaView>

    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007AFF', 
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
    width: 40,
  },pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginLeft:-160,
  },
  pageButton: {
    backgroundColor: "#007bff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 5,
  },
  buttonC:{
    marginHorizontal:20,
    top:10,
  },
  pageButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding:23
  },
   buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 1,
    marginHorizontal:8,
  
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
    borderColor: "blue",
    
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
  
 
 
  totalTimeContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    top:18,
  },
  totalTimeText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f7',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    top:20,
    margin:10
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    borderWidth:1,
    borderColor:"#fff",
    margin:10,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  subDescriptionText: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
    width:120,
  },
  valueControl: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    borderRadius: 4,
    overflow: 'hidden',
  },
  minusButton: {
    backgroundColor: '#007AFF',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  plusButton: {
    backgroundColor: '#007AFF',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  valueDisplay: {
    backgroundColor: 'white',
    width: 23,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#007AFF',
  },
  valueText: {
    color: '#333',
    fontSize: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100',
  },
  graphButton: {
    padding: 5,
  },
  deleteButton: {
    padding: 5,
  },
  editButton: {
    padding: 5,
  },
  chartContainer: {
    backgroundColor: '#f0f5ff',
    padding: 10,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 0,
  },
  timeCountContainer: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 5,
  },
  timeCountText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 50,
    marginTop: 5,
    marginBottom: 10,
  },
  timeLabel: {
    backgroundColor: '#007AFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeLabelText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
 
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0080DC",
    padding: 20,
    borderRadius: 60,
    margin: 20, alignItems: 'center',
  },
  logoutText: { fontSize: 16, color: "#fff", marginLeft: 10,paddingLeft:103 },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContainer: { backgroundColor: "#FFFFFF", padding: 50, paddingHorizontal: 20, borderRadius: 30, width: 350, alignItems: "center" },
  modalText: { fontSize: 16, textAlign: "center", marginVertical: 15 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  cancelButton: { backgroundColor: "#E7EDFF", padding: 10, borderRadius: 35, flex: 1, alignItems: "center", marginRight: 10 },
  cancelText: { color: "black", fontWeight: "bold" },
  yesButton: { backgroundColor: "blue", padding: 10, borderRadius: 35, flex: 1, alignItems: "center" },
  yesText: { color: "white", fontWeight: "bold" },
});

export default GoalsList;