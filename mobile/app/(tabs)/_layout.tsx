import React from "react";
import { Tabs } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";
import { colors } from "../../src/theme/colors";
import { Home, Car, Compass, User } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-car"
        options={{
          title: "My Car",
          tabBarIcon: ({ color, size }) => <Car size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="drive"
        options={{
          title: "Track Drive",
          tabBarIcon: ({ color, size }) => <Compass size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surfaceSunken,
    borderTopColor: colors.borderSubtle,
    borderTopWidth: 1,
    height: Platform.OS === "ios" ? 85 : 68,
    paddingBottom: Platform.OS === "ios" ? 28 : 10,
    paddingTop: 8,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 2,
  },
});
