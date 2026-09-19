import * as Haptics from "expo-haptics";

export async function triggerHaptic(
  type: "light" | "medium" | "heavy" | "success" | "warning" = "light"
): Promise<void> {
  try {
    if (type === "light") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (type === "medium") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (type === "heavy") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else if (type === "success") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (type === "warning") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  } catch {
    // Safe no-op on desktop or simulators without vibration motor
  }
}
