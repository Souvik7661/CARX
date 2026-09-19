import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../src/theme/colors";
import { neuStyles } from "../../src/theme/neumorphic";
import {
  Bell,
  Sparkles,
  Bot,
  Activity,
  Wrench,
  CreditCard,
  FileText,
  Clock,
  Shield,
  Camera,
  ChevronRight,
  Plus
} from "lucide-react-native";

export default function MobileHomeScreen() {
  const router = useRouter();
  const [activeCar, setActiveCar] = useState({
    brand: "Honda",
    model: "City ZX",
    year: 2024,
    healthScore: 92,
    odometerKm: 28450,
    mileageKmpl: 18.6,
    nextService: "Jan 2026",
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingText}>Good Evening, Souvik</Text>
            <Text style={styles.vehicleTitle}>
              {activeCar ? `${activeCar.brand} ${activeCar.model}` : "DriveSense Cockpit"}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={neuStyles.circle}
              onPress={() => router.push("/emergency")}
            >
              <Shield size={20} color={colors.accentRose} />
            </TouchableOpacity>
            <TouchableOpacity style={[neuStyles.circle, { marginLeft: 10 }]}>
              <Bell size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Central Neumorphic Health Dial (Reference Screen 2) */}
        <View style={[neuStyles.card, styles.healthCard]}>
          <View style={styles.healthHeader}>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>ALL SYSTEMS OPTIMAL</Text>
            </View>
            <Text style={styles.syncText}>OBD-II SYNCED</Text>
          </View>

          {/* Concentric Dial Gauge */}
          <View style={styles.dialContainer}>
            <View style={[neuStyles.inset, styles.outerRing]}>
              <View style={[neuStyles.card, styles.innerDial]}>
                <Text style={styles.healthScoreText}>{activeCar.healthScore}%</Text>
                <Text style={styles.healthScoreLabel}>OVERALL HEALTH</Text>
              </View>
            </View>
          </View>

          {/* Key Stat Insets (3 Cards from Screen 2) */}
          <View style={styles.statsRow}>
            <View style={[neuStyles.inset, styles.statBox]}>
              <Text style={styles.statLabel}>ODOMETER</Text>
              <Text style={styles.statValue}>
                {activeCar.odometerKm.toLocaleString()} <Text style={styles.statUnit}>km</Text>
              </Text>
            </View>
            <View style={[neuStyles.inset, styles.statBox]}>
              <Text style={styles.statLabel}>AVG MILEAGE</Text>
              <Text style={styles.statValue}>
                {activeCar.mileageKmpl} <Text style={styles.statUnit}>km/l</Text>
              </Text>
            </View>
            <View style={[neuStyles.inset, styles.statBox]}>
              <Text style={styles.statLabel}>NEXT SERVICE</Text>
              <Text style={styles.statValue}>{activeCar.nextService}</Text>
            </View>
          </View>
        </View>

        {/* 12-Angle Inspection Quick Banner */}
        <TouchableOpacity
          style={[neuStyles.cardPrimary, styles.inspectionBanner]}
          onPress={() => router.push("/inspection")}
        >
          <View style={styles.bannerLeft}>
            <View style={[neuStyles.circle, { backgroundColor: "rgba(6,182,212,0.15)" }]}>
              <Camera size={22} color={colors.primary} />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.bannerTitle}>12-Angle Visual Inspection</Text>
              <Text style={styles.bannerSubtitle}>360° Exterior, Engine & Underbody scan</Text>
            </View>
          </View>
          <ChevronRight size={20} color={colors.primary} />
        </TouchableOpacity>

        {/* 6 Quick Actions Grid (Screen 2 Reference) */}
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[neuStyles.card, styles.actionCard]}
            onPress={() => router.push("/(tabs)/my-car")}
          >
            <Wrench size={22} color={colors.primary} />
            <Text style={styles.actionLabel}>Smart Upkeep</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[neuStyles.card, styles.actionCard]}
            onPress={() => router.push("/ai-assistant")}
          >
            <Bot size={22} color={colors.accentBlue} />
            <Text style={styles.actionLabel}>AI Assistant</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[neuStyles.card, styles.actionCard]}
            onPress={() => router.push("/expenses")}
          >
            <CreditCard size={22} color={colors.accentPurple} />
            <Text style={styles.actionLabel}>Expense Log</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[neuStyles.card, styles.actionCard]}
            onPress={() => router.push("/(tabs)/my-car")}
          >
            <Clock size={22} color={colors.accentAmber} />
            <Text style={styles.actionLabel}>Reminders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[neuStyles.card, styles.actionCard]}
            onPress={() => router.push("/(tabs)/drive")}
          >
            <Activity size={22} color={colors.accentEmerald} />
            <Text style={styles.actionLabel}>Live Sensors</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[neuStyles.card, styles.actionCard]}
            onPress={() => router.push("/(tabs)/profile")}
          >
            <FileText size={22} color={colors.accentRose} />
            <Text style={styles.actionLabel}>Documents</Text>
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
  greetingText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "600",
  },
  vehicleTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.textPrimary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  healthCard: {
    padding: 20,
    marginBottom: 20,
  },
  healthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accentEmerald,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.accentEmerald,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  syncText: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  dialContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 24,
  },
  outerRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    alignItems: "center",
    justifyContent: "center",
  },
  innerDial: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  healthScoreText: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  healthScoreLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.primary,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  statBox: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.textMuted,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  statUnit: {
    fontSize: 10,
    color: colors.primary,
  },
  inspectionBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 24,
  },
  bannerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  bannerSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  actionCard: {
    width: "48%",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    marginTop: 10,
  },
});
