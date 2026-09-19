import { StyleSheet, ViewStyle } from "react-native";
import { colors } from "./colors";

export const neuStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  } as ViewStyle,

  cardPrimary: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,

  inset: {
    backgroundColor: colors.surfaceSunken,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.4)",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,

  button: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 6,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  pill: {
    borderRadius: 9999,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
});
