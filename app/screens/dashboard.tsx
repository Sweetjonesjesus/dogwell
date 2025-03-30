"use client"

import { View, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import DashboardComponent from "../dashboard/dashboard"

export default function Dashboard() {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <DashboardComponent />
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

