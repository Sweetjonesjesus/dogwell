"use client"

import { View, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import AnalyzerDashboard from "../analyzer/analyzer-dashboard"

export default function AnalyzerTool() {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <AnalyzerDashboard />
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

