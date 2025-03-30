"use client"

import React from 'react'
import { useEffect } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Provider as PaperProvider } from "react-native-paper"
import { Provider as StoreProvider } from "react-redux"
import { store } from "./app/store"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as Notifications from "expo-notifications"
import { ThemeProvider } from "./components/theme-provider"
import { AccessibilityProvider } from "./components/accessibility-provider"

// Import screens
import Dashboard from "./app/screens/dashboard"
import HealthTracker from "./app/screens/health-tracker"
import CoachModule from "./app/screens/coach-module"
import AnalyzerTool from "./app/screens/analyzer-tool"
import DailyScheduler from "./app/screens/daily-scheduler"

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

const Tab = createBottomTabNavigator()

export default function App() {
  useEffect(() => {
    // Request notification permissions
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync()
      if (status !== "granted") {
        console.log("Notification permissions not granted")
      }
    }

    requestPermissions()
  }, [])

  return (
    <StoreProvider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <AccessibilityProvider>
          <PaperProvider>
            <SafeAreaProvider>
              <NavigationContainer>
                <Tab.Navigator
                  screenOptions={{
                    tabBarActiveTintColor: "#6200EA",
                    tabBarInactiveTintColor: "#757575",
                    tabBarLabelStyle: {
                      fontSize: 12,
                    },
                    headerStyle: {
                      elevation: 0,
                      shadowOpacity: 0,
                      borderBottomWidth: 1,
                      borderBottomColor: "#f0f0f0",
                    },
                  }}
                >
                  <Tab.Screen
                    name="Home"
                    component={Dashboard}
                    options={{
                      tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />,
                    }}
                  />
                  <Tab.Screen
                    name="Health"
                    component={HealthTracker}
                    options={{
                      tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="heart-pulse" color={color} size={size} />
                      ),
                    }}
                  />
                  <Tab.Screen
                    name="Coach"
                    component={CoachModule}
                    options={{
                      tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="school" color={color} size={size} />
                      ),
                    }}
                  />
                  <Tab.Screen
                    name="Analyzer"
                    component={AnalyzerTool}
                    options={{
                      tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="chart-bar" color={color} size={size} />
                      ),
                    }}
                  />
                  <Tab.Screen
                    name="Schedule"
                    component={DailyScheduler}
                    options={{
                      tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="calendar-clock" color={color} size={size} />
                      ),
                    }}
                  />
                </Tab.Navigator>
                {/* NotificationManager component needs to be imported */}
                <NotificationManager />
                {/* Removing AccessibilityMenu since it cannot be found */}
              </NavigationContainer>
            </SafeAreaProvider>
          </PaperProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </StoreProvider>
  )
}

