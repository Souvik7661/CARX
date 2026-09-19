import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Rect, Circle, Line } from "react-native-svg";
import { colors } from "../../src/theme/colors";
import { neuStyles } from "../../src/theme/neumorphic";
import {
  ShieldCheck,
  Zap,
  Disc,
  Cpu,
  Gauge,
  Sliders,
  ChevronRight,
} from "lucide-react-native";
import { useRouter } from "expo-router";

export default function MyCarScreen() {
  const router = useRouter();

  const subsystems = [
    { name: "Powertrain / Engine", score: 94, status: "Optimal", icon: Zap, color: colors.accentEmerald },
    { name: "Braking System", score: 88, status: "Good (Pads 7.2mm)", icon: Disc, color: colors.accentEmerald },
    { name: "Battery & Alternator", score: 96, status: "12.6V Steady", icon: Cpu, color: colors.primary },
    { name: "Tire Pressure & Tread", score: 91, status: "33 PSI Normal", icon: Gauge, color: colors.accentEmerald },
    { name: "Transmission & Gearbox", score: 95, status: "Smooth", icon: Sliders, color: colors.primary },
    { name: "Electrical & ECU", score: 98, status: "0 DTC Faults", icon: ShieldCheck, color: colors.accentEmerald },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.screenSubtitle}>VEHICLE TELEMETRY</Text>
            <Text style={styles.screenTitle}>Honda City ZX HUD</Text>
          </View>
          <TouchableOpacity
            style={neuStyles.pill}
            onPress={() => router.push("/inspection")}
          >
            <Text style={styles.inspectBtnText}>+ Scan</Text>
          </TouchableOpacity>
        </View>

        {/* Vector HUD Wireframe Schematic (Screen 3 Reference - NO PHOTOS) */}
        <View style={[neuStyles.card, styles.schematicCard]}>
          <View style={styles.hudBadge}>
            <Text style={styles.hudBadgeText}>3D HUD SCHEMATIC</Text>
          </View>

          <Svg width="260" height="150" viewBox="0 0 260 150" style={styles.svgSchematic}>
            {/* Grid & scanlines */}
            <Line x1="10" y1="75" x2="250" y2="75" stroke="rgba(6,182,212,0.15)" strokeDasharray="4,4" />
            <Line x1="130" y1="10" x2="130" y2="140" stroke="rgba(6,182,212,0.15)" strokeDasharray="4,4" />

            {/* Vehicle Outline Schematic */}
            <Path
              d="M 50 110 L 40 85 L 60 75 L 85 45 L 175 45 L 200 75 L 220 85 L 210 110 Z"
              fill="rgba(6,182,212,0.06)"
              stroke={colors.primary}
              strokeWidth="2"
            />
            {/* Cockpit Greenhouse */}
            <Path
              d="M 90 47 L 115 22 L 155 22 L 175 47 Z"
              fill="rgba(6,182,212,0.12)"
              stroke={colors.primary}
              strokeWidth="1.5"
            />
            {/* Wheels */}
            <Circle cx="70" cy="110" r="16" fill={colors.surfaceSunken} stroke={colors.primary} strokeWidth="2" />
            <Circle cx="70" cy="110" r="7" fill={colors.primary} />
            <Circle cx="190" cy="110" r="16" fill={colors.surfaceSunken} stroke={colors.primary} strokeWidth="2" />
            <Circle cx="190" cy="110" r="7" fill={colors.primary} />

            {/* Sensor nodes */}
            <Circle cx="45" cy="85" r="4" fill={colors.accentEmerald} />
            <Circle cx="130" cy="50" r="4" fill={colors.primary} />
            <Circle cx="215" cy="85" r="4" fill={colors.accentEmerald} />
          </Svg>

          <View style={styles.telemetryBar}>
            <Text style={styles.telemetryText}>OBD-II CAN-BUS: SYNCHRONIZED</Text>
            <Text style={[styles.telemetryText, { color: colors.accentEmerald }]}>HEALTH: 92%</Text>
          </View>
        </View>

        {/* 6 Subsystem Health Diagnostics */}
        <Text style={styles.sectionTitle}>SUBSYSTEM HEALTH STATUS</Text>
        <View style={styles.subsystemsContainer}>
          {subsystems.map((sub, idx) => {
            const Icon = sub.icon;
            return (
              <View key={idx} style={[neuStyles.card, styles.subsystemCard]}>
                <View style={styles.subsystemHeader}>
                  <View style={styles.subsystemLeft}>
                    <View style={[neuStyles.circle, styles.subsystemIcon]}>
                      <Icon size={18} color={sub.color} />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.subsystemName}>{sub.name}</Text>
                      <Text style={styles.subsystemStatus}>{sub.status}</Text>
                    </View>
                  </View>
                  <Text style={[styles.subsystemScore, { color: sub.color }]}>{sub.score}%</Text>
                </View>

                {/* Progress bar */}
                <View style={[neuStyles.inset, styles.progressBarBg]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${sub.score}%`, backgroundColor: sub.color },
                    ]}
                  />
                </View>
              </View>
            );
          })}
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
  screenSubtitle: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 1,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.textPrimary,
    marginTop: 2,
  },
  inspectBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primary,
  },
  schematicCard: {
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  hudBadge: {
    position: "absolute",
    top: 12,
    left: 14,
    backgroundColor: "rgba(6,182,212,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  hudBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  svgSchematic: {
    marginVertical: 14,
  },
  telemetryBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  telemetryText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 14,
  },
  subsystemsContainer: {
    gap: 12,
  },
  subsystemCard: {
    padding: 14,
  },
  subsystemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  subsystemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  subsystemIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  subsystemName: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subsystemStatus: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  subsystemScore: {
    fontSize: 15,
    fontWeight: "900",
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
});
