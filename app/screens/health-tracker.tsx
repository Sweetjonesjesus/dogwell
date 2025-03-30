"use client"
import { View, StyleSheet } from "react-native"
import { FAB } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import HealthDashboard from "../health/health-dashboard"

export default function HealthTracker() {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <HealthDashboard />
      <FAB style={styles.fab} icon="plus" onPress={() => navigation.navigate("AddHealthRecord")} color="#fff" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#6200EA",
  },
})

