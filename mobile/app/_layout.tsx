import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { colors } from "../src/theme/colors";

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "fade_from_bottom",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ presentation: "fullScreenModal" }} />
        <Stack.Screen name="inspection" options={{ title: "Visual Inspection" }} />
        <Stack.Screen name="ai-assistant" options={{ title: "DriveSense AI" }} />
        <Stack.Screen name="expenses" options={{ title: "Expenses & Fuel" }} />
        <Stack.Screen name="emergency" options={{ presentation: "modal" }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
