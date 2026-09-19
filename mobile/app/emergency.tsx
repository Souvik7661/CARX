import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors } from "../src/theme/colors";
import { neuStyles } from "../src/theme/neumorphic";
import {
  ChevronLeft,
  Phone,
  ShieldAlert,
  MapPin,
  Truck,
  BatteryCharging,
  Disc,
  Share2,
} from "lucide-react-native";
import { triggerHaptic } from "../src/services/haptics";

export default function EmergencyScreen() {
  const router = useRouter();

  const handleDial112 = async () => {
    await triggerHaptic("warning");
    Linking.openURL("tel:112").catch(() => {
      Alert.alert("Emergency Call", "Dialing national emergency services: 112");
    });
  };

  const handleDispatchRSA = async (type: string) => {
    await triggerHaptic("medium");
    Alert.alert(
      "Roadside Assistance Dispatched",
      `Your request for ${type} has been dispatched. Closest patrol vehicle ETA is 14 minutes. GPS coordinates shared.`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={neuStyles.circle} onPress={() => router.back()}>
            <ChevronLeft size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.screenTitle}>Emergency Mode</Text>
            <Text style={styles.screenSubtitle}>SOS & Roadside Dispatch</Text>
          </View>
          <TouchableOpacity
            style={neuStyles.circle}
            onPress={() => Alert.alert("Location Shared", "Live GPS broadcasted to emergency contacts.")}
          >
            <Share2 size={18} color={colors.accentRose} />
          </TouchableOpacity>
        </View>

        {/* Big Pulsing SOS Button (Screen 8 Reference) */}
        <View style={styles.sosContainer}>
          <View style={styles.pulseRingOuter}>
            <View style={styles.pulseRingInner}>
              <TouchableOpacity
                style={styles.sosButton}
                activeOpacity={0.8}
                onPress={handleDial112}
              >
                <ShieldAlert size={44} color="#fff" />
                <Text style={styles.sosText}>SOS</Text>
                <Text style={styles.sosSubtext}>PRESS TO CALL 112</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* GPS Location & Telemetry Card */}
        <View style={[neuStyles.card, styles.locationCard]}>
          <View style={styles.locationHeader}>
            <MapPin size={18} color={colors.accentRose} />
            <Text style={styles.locationTitle}>CURRENT GPS TELEMETRY</Text>
          </View>
          <Text style={styles.coordText}>Lat: 19.0760° N • Long: 72.8777° E</Text>
          <Text style={styles.addressText}>Western Express Highway, Near Airport Exit</Text>
          <View style={styles.etaPill}>
            <Text style={styles.etaText}>NEAREST PATROL UNIT ETA: 14 MINS</Text>
          </View>
        </View>

        {/* 24x7 Roadside Assistance Actions */}
        <Text style={styles.sectionTitle}>ROADSIDE ASSISTANCE (RSA)</Text>
        <View style={styles.rsaContainer}>
          <TouchableOpacity
            style={[neuStyles.card, styles.rsaCard]}
            onPress={() => handleDispatchRSA("Flat Tyre Support")}
          >
            <View style={[neuStyles.circle, { backgroundColor: "rgba(244,63,94,0.15)" }]}>
              <Disc size={20} color={colors.accentRose} />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.rsaTitle}>Flat Tyre Assistance</Text>
              <Text style={styles.rsaDesc}>Stepney replacement & high-pressure inflation</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[neuStyles.card, styles.rsaCard]}
            onPress={() => handleDispatchRSA("Battery Jumpstart")}
          >
            <View style={[neuStyles.circle, { backgroundColor: "rgba(244,63,94,0.15)" }]}>
              <BatteryCharging size={20} color={colors.accentRose} />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.rsaTitle}>Battery Jumpstart</Text>
              <Text style={styles.rsaDesc}>12V boost pack & alternator test on-site</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[neuStyles.card, styles.rsaCard]}
            onPress={() => handleDispatchRSA("Flatbed Towing Truck")}
          >
            <View style={[neuStyles.circle, { backgroundColor: "rgba(244,63,94,0.15)" }]}>
              <Truck size={20} color={colors.accentRose} />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.rsaTitle}>Flatbed Towing</Text>
              <Text style={styles.rsaDesc}>Safe transport to nearest authorized workshop</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  screenSubtitle: {
    fontSize: 11,
    color: colors.accentRose,
    fontWeight: "600",
  },
  sosContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18,
  },
  pulseRingOuter: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(244,63,94,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRingInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(244,63,94,0.20)",
    alignItems: "center",
    justifyContent: "center",
  },
  sosButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.accentRose,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.accentRose,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  sosText: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    marginTop: 4,
  },
  sosSubtext: {
    fontSize: 8,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  locationCard: {
    padding: 16,
    marginBottom: 24,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  locationTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.accentRose,
    letterSpacing: 1,
  },
  coordText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textPrimary,
    fontFamily: "monospace",
  },
  addressText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  etaPill: {
    backgroundColor: "rgba(6,182,212,0.12)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  etaText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 12,
  },
  rsaContainer: {
    gap: 10,
  },
  rsaCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  rsaTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  rsaDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});
