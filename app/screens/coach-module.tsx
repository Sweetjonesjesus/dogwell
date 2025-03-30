"use client"

import { View, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import CoachDashboard from "../coach/coach-dashboard"

export default function CoachModule() {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <CoachDashboard />
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

