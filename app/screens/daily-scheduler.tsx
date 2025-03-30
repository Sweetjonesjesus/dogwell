"use client"

import { View, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import SchedulerDashboard from "../schedule/scheduler-dashboard"

export default function DailyScheduler() {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <SchedulerDashboard />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
})

