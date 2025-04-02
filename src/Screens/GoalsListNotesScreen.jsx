"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
} from "react-native"
import { LineChart } from "react-native-chart-kit"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import FormData from "form-data"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const { width } = Dimensions.get("window")

const GoalsListNotesScreen = ({ route }) => {
  // Boolean type for visibility states
  const [logoutVisible, setLogoutVisible] = useState(false)

  const [tableData, setTableData] = useState([])
  const [data, setData] = useState([])
  const [graphLists, setGraphLists] = useState([[], [], []])
  const [pagesLists, setPagesLists] = useState([[1, -1], [], []])
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [activeTimerIndex, setActiveTimerIndex] = useState(null)
  const [timerValues, setTimerValues] = useState({})

  const [labels, setLabels] = useState([])

  const [stepValue, setStepValue] = useState(0)

  // Ref to track if component is mounted
  const isMounted = useRef(true)

  // Run when component mounts and unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // Run when screen comes into focus with better error handling
  useFocusEffect(
    React.useCallback(() => {
      isMounted.current = true
      setGraphLists([[], [], []])
      setPagesLists([[], [], []])
      setLabels([])

      // Check if we have valid route params before fetching data
      if (route?.params?.profileData?.id) {
        console.log("Found valid appointment ID:", route.params.profileData.id)
        getGraphData()
      } else {
        console.log("No valid appointment ID found, using default data")
        // Set empty data or mock data for development
        setTableData([])
      }

      return () => {
        isMounted.current = false
      }
    }, []),
  )

  const graphValueUpdate = (index, type, item) => {
    console.log(`graphValueUpdate called with index: ${index}, type: ${type}, item type: ${item.type}`)

    setTableData((prevData) => {
      const newData = [...prevData]

      if (type === "chartVisible") {
        newData[index] = { ...newData[index], hasChart: !newData[index].hasChart }
        return newData
      }

      // Handle bool type
      if (item.type === "bool") {
        if (type === "countAdd" || type === "countMinus") {
          let newValue = Number.parseFloat(newData[index].value) || 0

          if (type === "countAdd") {
            newValue = newValue + 10
          } else if (type === "countMinus" && newValue >= 10) {
            newValue = newValue - 10
          }

          newData[index] = { ...newData[index], value: newValue }

          const positiveValue = tableData[index].positiveValue

          // Calculate step_value
          let step_value = tableData[index].positiveValue + tableData[index].negativeValue

          // Modify step_value based on type
          step_value = type === "countAdd" ? step_value + 1 : step_value - 1

          // Create API data object
          const data = {
            goal_id: item.totData.id,
            type: item.totData.type,
            step: type === "countAdd" ? 1 : -1,
            step_value: step_value,
          }

          callApi(data, index)
        }
      }
      // Handle percentage type
      else if (item.type === "percentage") {
        if (type === "countAdd" || type === "countMinus") {
          let newValue = Number.parseFloat(newData[index].value) || 0

          if (type === "countAdd") {
            newValue = newValue + 10
          } else if (type === "countMinus" && newValue >= 10) {
            newValue = newValue - 10
          }

          newData[index] = { ...newData[index], value: newValue }

          const positiveValue = tableData[index].positiveValue

          // Calculate step_value
          let step_value = tableData[index].positiveValue + tableData[index].negativeValue

          // Modify step_value based on type
          step_value = type === "countAdd" ? step_value + 1 : step_value - 1

          // Create API data object
          const data = {
            goal_id: item.totData.id,
            type: item.totData.type,
            step: type === "countAdd" ? 1 : -1,
            step_value: step_value,
          }

          callApi(data, index)
        }
      }
      // Handle timer type
      else if (item.type === "timer") {
        if (type === "timerStart") {
          setIsRunning(!isRunning)
          setActiveTimerIndex(isRunning ? null : index)
        } else if (type === "timerStop") {
          if (isRunning) {
            // Save the current timer value for this goal
            setTimerValues((prev) => ({
              ...prev,
              [item.totData.id]: time,
            }))
          }
          const data = {
            goal_id: item.totData.id,
            type: item.totData.type,
            step_value: time * 1000,
            value: formatTime(time),
          }

          callApi(data, index)
          resetTimer()
          setActiveTimerIndex(null)
        }
      }

      return newData
    })
  }

  const callApi = async (goalData, index) => {
    console.log("Calling API... ", goalData)
    try {
      const storedUserData = await AsyncStorage.getItem("userData")
      if (!storedUserData) throw new Error("User data not found")

      const userData = JSON.parse(storedUserData)
      const token = userData?.api_token
      if (!token) throw new Error("No token found")

      const data = new FormData()

      if (goalData.goal_id != null) data.append("goal_id", goalData.goal_id.toString())
      if (goalData.step != null) data.append("step", goalData.step.toString())
      if (goalData.step_value != null) data.append("step_value", goalData.step_value.toString())
      if (goalData.type) data.append("type", goalData.type)
      if (goalData.value != null) data.append("value", goalData.value.toString())

      const config = {
        method: "post",
        url: "https://therapy.kidstherapy.me/api/add-goal-step-data",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        data: data,
      }

      const response = await axios(config)
      const responseData = response.data
      console.log("API Response:", responseData)

      if (!isMounted.current) return

      // Get timestamp from API response or use current time
      const newTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      // Update labels with new timestamp
      setLabels((prevLabels) => {
        const newLabels = [...prevLabels, newTimestamp]
        // Keep only the last 10 labels to prevent overcrowding
        return newLabels.length > 10 ? newLabels.slice(newLabels.length - 10) : newLabels
      })

      // Update graph data based on goal type and response
      setGraphLists((prevGraphLists) => {
        const newGraphLists = [...prevGraphLists]

        // Find the correct index for this goal type
        let typeIndex = 0
        if (goalData.type === "percentage") typeIndex = 1
        else if (goalData.type === "timer") typeIndex = 2

        // Ensure the array exists
        if (!newGraphLists[typeIndex]) newGraphLists[typeIndex] = []

        // Add the new step value from the API response
        const stepValue = Number.parseFloat(responseData.trial.step_value)
        newGraphLists[typeIndex].push(stepValue)

        return newGraphLists
      })

      // Update table data with new values from API response
      setTableData((prevData) =>
        prevData.map((goal) => {
          if (goal.totData.id === goalData.goal_id) {
            if (goalData.type === "bool") {
              return {
                ...goal,
                stepValue: responseData.trial.step_value,
                value: responseData.goal.positive_count - responseData.goal.negative_count,
                positiveValue: responseData.goal.positive_count,
                negativeValue: responseData.goal.negative_count,
              }
            } else if (goalData.type === "percentage") {
              return {
                ...goal,
                stepValue: responseData.trial.step_value,
                positiveValue: responseData.goal.positive_count,
                negativeValue: responseData.goal.negative_count,
                value: Number.parseFloat(responseData.trial.step_value),
              }
            } else if (goalData.type === "timer") {
              return {
                ...goal,
                stepValue: responseData.trial.step_value,
                value: responseData.goal.value || "00:00:00",
                timerValue: Number.parseInt(responseData.trial.step_value) || 0,
              }
            }
          }
          return goal
        }),
      )

      // Refresh graph data to ensure it's up to date
      await getGraphData(index)
    } catch (error) {
      console.error("API Error:", error.response ? error.response.data : error.message)
    }
  }

  const getGraphData = async (openValue) => {
    try {
      if (!isMounted.current) return

      setGraphLists([[], [], []])
      setLabels([])

      const storedUserData = await AsyncStorage.getItem("userData")
      if (!storedUserData) throw new Error("User data not found")

      const userData = JSON.parse(storedUserData)
      const token = userData?.api_token
      if (!token) throw new Error("No token found")

      // Check if route and params exist
      if (!route || !route.params) {
        console.log("No route params available, using default data")
        // Set empty data when no route params
        setTableData([])
        return
      }

      // Check if profileData exists
      if (!route.params.profileData) {
        console.log("No profileData available, using default data")
        // Set empty data when no profileData
        setTableData([])
        return
      }

      // Check if profileData.id exists
      const appointmentId = route.params.profileData.id
      if (!appointmentId) {
        console.log("No appointment ID available, using default data")
        // Set empty data when no appointment ID
        setTableData([])
        return
      }

      const formData = new FormData()
      formData.append("appointment_id", `${appointmentId}`)

      const config = {
        method: "post",
        url: "https://therapy.kidstherapy.me/api/appointment-goals",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      }

      const response = await axios(config)
      const responseData = response.data
      const patientGoals = responseData.patientGoals || []

      console.log("Patient goals fetched:", patientGoals.length)

      // Create separate arrays for each goal type
      const boolGraphData = []
      const percentageGraphData = []
      const timerGraphData = []

      // Create a single set of labels from the most recent goal with the most trials
      let maxTrials = 0
      let labelsSource = null

      patientGoals.forEach((goal) => {
        if (goal.trials && goal.trials.length > maxTrials) {
          maxTrials = goal.trials.length
          labelsSource = goal
        }
      })

      // Generate labels from timestamps in the trials
      if (labelsSource && labelsSource.trials && labelsSource.trials.length > 0) {
        const newLabels = labelsSource.trials.slice(-10).map((trial) => {
          const time = trial.updated_at
          return time.substring(0, 5) // Extract HH:MM from the timestamp
        })
        setLabels(newLabels)
      }

      // Process each goal and categorize by type
      patientGoals.forEach((goal) => {
        if (!goal.trials) {
          console.log("Goal has no trials:", goal)
          return
        }

        const trialValues = goal.trials.map((trial) => Number.parseFloat(trial.step_value))

        if (goal.type === "bool") {
          boolGraphData.push(...trialValues)
        } else if (goal.type === "percentage") {
          percentageGraphData.push(...trialValues)
        } else if (goal.type === "timer") {
          timerGraphData.push(...trialValues)

          // Store the latest timer value
          if (goal.trials.length > 0) {
            const latestTrial = goal.trials[goal.trials.length - 1]
            setTimerValues((prev) => ({
              ...prev,
              [goal.id]: Number.parseInt(latestTrial.step_value) || 0,
            }))
          }
        }
      })

      // Update graph lists with categorized data
      setGraphLists([boolGraphData, percentageGraphData, timerGraphData])

      // Process for pagination display
      const updatedLists = [[], [], []]
      patientGoals.forEach((goal) => {
        if (!goal.trials) return

        goal.trials.forEach((trial) => {
          const typeIndex = goal.type === "bool" ? 0 : goal.type === "percentage" ? 1 : 2
          updatedLists[typeIndex].push(trial.value)
        })
      })

      setPagesLists(updatedLists)

      // Update table data
      const goals = patientGoals.map((goal, index) => {
        // Get the latest trial value for timer type
        let timerValue = 0
        if (goal.type === "timer" && goal.trials && goal.trials.length > 0) {
          timerValue = Number.parseInt(goal.trials[goal.trials.length - 1].step_value) || 0
        }

        return {
          id: index + 1,
          subDescription: goal.goal,
          description: goal.goal_category?.category || "Other",
          value:
            goal.type === "bool"
              ? goal.positive_count - goal.negative_count
              : goal.type === "percentage"
                ? Number.parseFloat(
                    goal.trials && goal.trials.length > 0 ? goal.trials[goal.trials.length - 1].step_value : 0,
                  )
                : goal.value || "00:00:00",
          timeCount: goal.timeCount || "",
          hasChart: openValue != null ? openValue === index : false,
          type: goal.type,
          totData: goal,
          stepValue: goal.trials && goal.trials.length > 0 ? goal.trials[goal.trials.length - 1].step_value : 0,
          positiveValue: goal.positive_count || 0,
          negativeValue: goal.negative_count || 0,
          timerValue: timerValue,
        }
      })

      setTableData(goals)
    } catch (error) {
      console.error("Error fetching data:", error.response ? error.response.data : error.message)
      // Set empty data on error
      setTableData([])
    }
  }

  // Timer effect
  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (seconds) => {
    const hh = String(Math.floor(seconds / 3600)).padStart(2, "0")
    const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")
    const ss = String(seconds % 60).padStart(2, "0")
    return `${hh}:${mm}:${ss}`
  }

  const formatTime2 = (seconds) => {
    const hh = String(Math.floor(seconds / 3600)).padStart(2, "0")
    const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")
    const ss = String(seconds % 60).padStart(2, "0")
    return `${hh}:${mm}:${ss}`
  }

  const resetTimer = () => {
    setTime(0)
    setIsRunning(false)
  }

  const renderValueControl = (item, index) => {
    if (item.value === null) return null

    // Determine if this timer is active
    const isActiveTimer = item.type === "timer" && activeTimerIndex === index

    return (
      <View style={styles.valueControl}>
       <View
          style={[styles.minusButton, item.type === "percentage" && { backgroundColor: "#007AFF" }]}
          onPress={() => {
            if (item.type === "bool" || item.type === "percentage") {
              graphValueUpdate(index, "countMinus", item)
            } else if (item.type === "timer") {
              graphValueUpdate(index, "timerStart", item)
            }
          }}
        >
          <Text style={styles.buttonText}>{item.type === "bool" ? "X" : item.type === "percentage" ? "-" : "▶"}</Text>
          </View>

        {item.type === "percentage" && (
          <View style={styles.valueDisplay}>
            <Text style={styles.valueText}>{item.value}</Text>
          </View>
        )}

        {item.type === "timer" && (
          <View style={styles.valueDisplay}>
            <Text style={styles.valueText}>{formatTime(time)}</Text>
          </View>
        )}

<View 
          style={[styles.plusButton, item.type === "percentage" && { backgroundColor: "#007AFF" }]}
          onPress={() => {
            if (item.type === "bool" || item.type === "percentage") {
              graphValueUpdate(index, "countAdd", item)
            } else if (item.type === "timer") {
              graphValueUpdate(index, "timerStop", item)
            }
          }}
        >
          <Text style={[styles.buttonText, item.type === "timer" ? { color: "black" } : {}]}>
            {item.type === "bool" ? "✔" : item.type === "percentage" ? "+" : "⏸"}
          </Text>
          </View>
      </View>
    )
  }

  const renderActionButtons = (index) => {
    return (
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.graphButton}
          onPress={() => graphValueUpdate(index, "chartVisible", tableData[index])}
        >
          <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <MaterialCommunityIcons name="close" size={20} color="#FF3B30" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton}>
          <MaterialCommunityIcons name="briefcase-download-outline" size={20} color="#34C759" />
        </TouchableOpacity>
      </View>
    )
  }

  const navigation = useNavigation()

  const handleGoalsListNotesScreen = () => {
    navigation.navigate("GoalsListNotes")
  }

  const handleGoalsListDetailScreen = () => {
    navigation.navigate("GoalsListDetail")
  }

  const handleGoalsListVerify = () => {
    navigation.navigate("GoalsListVerify")
  }

  const handleLogout = () => {
    setLogoutVisible(false)
    console.log("User logged out")
    // Add logout logic here (e.g., clearing auth state)
  }

  const renderChart = (index) => {
    const scrollViewRef = React.createRef() // Create a ref for ScrollView

    const item = tableData[index]
    const dataIndex = item.type === "bool" ? 0 : item.type === "percentage" ? 1 : 2

    const chartData = graphLists[dataIndex] || []

    const displayData = item.type === "timer" ? chartData.map((val) => val / 100) : chartData

    // Determine the dynamic width based on data points (e.g., 50px per data point)
    const dynamicWidth = Math.max(width, displayData.length * 50)

    // Auto-scroll to the end after a delay
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true })
      }
    }, 500)

    return (
      <View style={styles.chartContainer}>
        {displayData.length > 0 ? (
          <ScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={true}>
            <View>
              <LineChart
                data={{
                  labels: labels.length > 0 ? labels : ["0"],
                  datasets: [
                    {
                      data: displayData.length > 0 ? displayData : [0],
                      color: () => (item.type === "percentage" ? "#34C759" : "#007AFF"),
                      strokeWidth: 2,
                    },
                  ],
                }}
                width={dynamicWidth} // Set dynamic width based on data length
                height={220}
                chartConfig={{
                  backgroundColor: "#f0f5ff",
                  backgroundGradientFrom: "#f0f5ff",
                  backgroundGradientTo: "#f0f5ff",
                  decimalPlaces: item.type === "percentage" ? 0 : 1,
                  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: item.type === "percentage" ? "#007AFF" : "#007AFF",
                  },
                  propsForBackgroundLines: { stroke: "#d0d0ff", strokeDasharray: "5, 5" },
                  useShadowColorFromDataset: false,
                }}
                bezier
                style={{ marginHorizontal: 10 }}
                withInnerLines
                withOuterLines={false}
                withVerticalLines
                withHorizontalLines
                fromZero
                yAxisLabel=""
                yAxisSuffix={item.type === "percentage" ? "%" : item.type === "timer" ? "m" : ""}
                yAxisInterval={20}
                segments={5}
              />
            </View>
          </ScrollView>
        ) : (
          <Text style={{ textAlign: "center", fontSize: 16, color: "gray", marginTop: 20 }}>No Data Found</Text>
        )}
        {pagesLists[dataIndex] && pagesLists[dataIndex].length > 0 && (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.pagination}>
              {pagesLists[dataIndex].map((page, idx) => (
                <TouchableOpacity key={idx} style={[styles.pageButton, { backgroundColor: "#0000FF" }]}>
                  <Text style={styles.pageButtonText}>{page === 1 ? page : page}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
          <Icon name="chevron-left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Goals List</Text>
      </View>

      {/* Tabs */}
      <View style={styles.buttonC}>
        {/* Tab Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.inactiveButton} onPress={handleGoalsListDetailScreen}>
            <Text style={styles.inactiveText}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.activeButton} onPress={handleGoalsListNotesScreen}>
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
        {tableData.length > 0 ? (
          tableData.map((item, index) => (
            <View key={item.id}>
              {/* Table Row */}
              <View style={styles.tableRow}>
                {/* Description Column */}
                <View style={{ flex: 2 }}>
                  <Text style={styles.descriptionText}>{item.description}</Text>
                  {item.subDescription && <Text style={styles.subDescriptionText}>{item.subDescription}</Text>}
                  <Text style={styles.Dtext}>
                    {item.type === "bool"
                      ? `(${(item.positiveValue + item.negativeValue) / 1})%`
                      : item.type === "percentage"
                        ? `(+${item.positiveValue || 0}, ${item.negativeValue || 0})`
                        : formatTime2(item.timerValue || 0)}
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems: "center" }}>{renderValueControl(item, index)}</View>
                <View style={{ flex: 1.4, flexDirection: "row", justifyContent: "space-around" }}>
                  {renderActionButtons(index)}
                </View>
              </View>

              {/* Dynamic Graph Rendering */}
              {item.hasChart && renderChart(index)}
            </View>
          ))
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No goals data available</Text>
            <Text style={styles.noDataSubText}>
              {!route?.params?.profileData?.id
                ? "Missing appointment information. Please go back and select an appointment."
                : "No goals found for this appointment."}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal transparent={true} visible={logoutVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <MaterialCommunityIcons name="help-circle-outline" size={40} color="#007AFF" />
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#007AFF",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  Dtext: {
    color: "red",
    fontSize: 12,
  },
  backButton: {
    padding: 5,
    width: 40,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
    marginLeft: 10,
    alignItems: "flex-end",
    alignContent: "flex-end",
  },
  pageButton: {
    backgroundColor: "#007bff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 5,
  },
  buttonC: {
    marginHorizontal: 20,
    top: 10,
  },
  pageButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 1,
    marginHorizontal: 8,
  },
  activeButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  inactiveButton: {
    borderColor: "#007bff",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  inactiveText: {
    color: "#007bff",
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
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  timerText: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
  },
  totalTimeContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    top: 18,
  },
  totalTimeText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f7",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    top: 20,
    margin: 10,
  },
  tableHeaderText: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#fff",
    margin: 10,
    marginEnd: 30,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    alignItems: "center",
    backgroundColor: "white",
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  subDescriptionText: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
    width: 120,
  },
  valueControl: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    borderRadius: 4,
    overflow: "hidden",
  },
  minusButton: {
    backgroundColor: "#007AFF",
    width: 39,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  plusButton: {
    backgroundColor: "#007AFF",
    width: 39,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  valueDisplay: {
    backgroundColor: "white",
    width: 40,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#007AFF",
  },
  valueText: {
    color: "#333",
    fontSize: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100",
  },
  graphButton: {
    padding: 5,
    marginLeft: 25,
  },
  deleteButton: {
    padding: 2,
    marginLeft: 10,
    top: 5,
  },
  editButton: {
    padding: 2,
    top: 5,
  },
  chartContainer: {
    backgroundColor: "#f0f5ff",
    padding: 5,
    alignItems: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 0,
  },
  timeCountContainer: {
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 5,
  },
  timeCountText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  timeLabels: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    paddingHorizontal: 50,
    marginTop: 5,
    marginBottom: 10,
  },
  timeLabel: {
    backgroundColor: "#007AFF",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  timeLabelText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0080DC",
    padding: 20,
    borderRadius: 60,
    margin: 20,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 10,
    paddingLeft: 103,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    padding: 50,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: 350,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 15,
  },
  noDataContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  noDataText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  noDataSubText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#E7EDFF",
    padding: 10,
    borderRadius: 35,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  cancelText: {
    color: "black",
    fontWeight: "bold",
  },
  yesButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 35,
    flex: 1,
    alignItems: "center",
  },
  yesText: {
    color: "white",
    fontWeight: "bold",
  },
})

export default GoalsListNotesScreen

