import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Circle, Polyline } from "react-native-svg";
import { colors } from "../../src/theme/colors";
import { neuStyles } from "../../src/theme/neumorphic";
import {
  Play,
  Square,
  Navigation,
  Fuel,
  Gauge,
  MapPin,
  Flame,
} from "lucide-react-native";

export default function TrackDriveScreen() {
  const [isDriving, setIsDriving] = useState(true);
  const [seconds, setSeconds] = useState(2538); // 00:42:18

  useEffect(() => {
    let interval: any = null;
    if (isDriving) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isDriving]);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.screenSubtitle}>LIVE TELEMETRY</Text>
            <Text style={styles.screenTitle}>Track Drive</Text>
          </View>
          <View style={styles.liveIndicator}>
            <View style={[styles.liveDot, { backgroundColor: isDriving ? colors.accentEmerald : colors.accentAmber }]} />
            <Text style={styles.liveText}>{isDriving ? "LIVE GPS" : "PAUSED"}</Text>
          </View>
        </View>

        {/* Digital Timer Card (Screen 7 Reference: 00:42:18) */}
        <View style={[neuStyles.card, styles.timerCard]}>
          <Text style={styles.timerLabel}>ELAPSED TRIP TIME</Text>
          <Text style={styles.timerValue}>{formatTimer(seconds)}</Text>
          <Text style={styles.timerSub}>Route: Powai &rarr; Bandra Kurla Complex</Text>
        </View>

        {/* GPS Map Polyline Schematic */}
        <View style={[neuStyles.inset, styles.mapSchematic]}>
          <Svg width="100%" height="160" viewBox="0 0 300 160">
            {/* Grid */}
            <Polyline
              points="20,130 60,110 110,120 160,80 200,85 240,40 280,45"
              fill="none"
              stroke={colors.primary}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Start & End Points */}
            <Circle cx="20" cy="130" r="6" fill={colors.accentEmerald} />
            <Circle cx="280" cy="45" r="7" fill={colors.primary} />
            <Circle cx="280" cy="45" r="13" fill="rgba(6,182,212,0.25)" />
          </Svg>
          <View style={styles.mapPinRow}>
            <MapPin size={14} color={colors.primary} />
            <Text style={styles.mapPinText}>BKC Main Ave (Traffic Flow: Smooth)</Text>
          </View>
        </View>

        {/* 4 Inset Telemetry Stats (Distance, Speed, Fuel, Economy) */}
        <View style={styles.statsGrid}>
          <View style={[neuStyles.card, styles.statCard]}>
            <Navigation size={18} color={colors.primary} />
            <Text style={styles.statNumber}>14.8</Text>
            <Text style={styles.statMetric}>DISTANCE (KM)</Text>
          </View>
          <View style={[neuStyles.card, styles.statCard]}>
            <Gauge size={18} color={colors.accentEmerald} />
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statMetric}>AVG SPEED (KM/H)</Text>
          </View>
          <View style={[neuStyles.card, styles.statCard]}>
            <Fuel size={18} color={colors.accentAmber} />
            <Text style={styles.statNumber}>0.8</Text>
            <Text style={styles.statMetric}>FUEL USED (L)</Text>
          </View>
          <View style={[neuStyles.card, styles.statCard]}>
            <Flame size={18} color={colors.accentRose} />
            <Text style={styles.statNumber}>18.5</Text>
            <Text style={styles.statMetric}>ECONOMY (KM/L)</Text>
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={[neuStyles.buttonPrimary, styles.mainControlBtn]}
            onPress={() => setIsDriving(!isDriving)}
          >
            {isDriving ? (
              <>
                <Square size={18} color={colors.textDark} />
                <Text style={styles.controlBtnTextDark}>Pause Drive</Text>
              </>
            ) : (
              <>
                <Play size={18} color={colors.textDark} />
                <Text style={styles.controlBtnTextDark}>Resume Drive</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[neuStyles.button, styles.endTripBtn]}
            onPress={() => {
              setIsDriving(false);
              setSeconds(0);
            }}
          >
            <Text style={styles.endTripText}>End Trip</Text>
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
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16,185,129,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.accentEmerald,
  },
  timerCard: {
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  timerLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 1,
  },
  timerValue: {
    fontSize: 44,
    fontWeight: "900",
    color: colors.textPrimary,
    marginVertical: 4,
    fontVariant: ["tabular-nums"],
  },
  timerSub: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "600",
  },
  mapSchematic: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  mapPinRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  mapPinText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    width: "48%",
    padding: 14,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.textPrimary,
    marginTop: 6,
  },
  statMetric: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  controlRow: {
    flexDirection: "row",
    gap: 12,
  },
  mainControlBtn: {
    flex: 2,
    flexDirection: "row",
    gap: 8,
    paddingVertical: 16,
  },
  controlBtnTextDark: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textDark,
  },
  endTripBtn: {
    flex: 1,
    paddingVertical: 16,
  },
  endTripText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.accentRose,
  },
});
