import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle } from "react-native-svg";
import { colors } from "../src/theme/colors";
import { neuStyles } from "../src/theme/neumorphic";
import { Sparkles, ArrowRight, ShieldCheck, Activity, Camera } from "lucide-react-native";

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Header */}
        <View style={styles.brandRow}>
          <View style={neuStyles.circle}>
            <Sparkles size={20} color={colors.primary} />
          </View>
          <Text style={styles.brandName}>
            Drive<Text style={{ color: colors.primary }}>Sense</Text>
          </Text>
        </View>

        {/* Hero Vector Emblem (Screen 1 Reference - NO STOCK PHOTOS) */}
        <View style={styles.emblemContainer}>
          <View style={[neuStyles.card, styles.emblemCard]}>
            <Svg width="180" height="180" viewBox="0 0 180 180">
              <Circle cx="90" cy="90" r="75" stroke={colors.primary} strokeWidth="2" strokeDasharray="6,6" fill="none" />
              <Circle cx="90" cy="90" r="58" fill={colors.surfaceSunken} />
              {/* Modern Vehicle Winged Crest */}
              <Path
                d="M 50 100 Q 90 60 130 100 Q 90 85 50 100 Z"
                fill={colors.primary}
              />
              <Circle cx="90" cy="90" r="8" fill={colors.accentEmerald} />
            </Svg>
          </View>
        </View>

        {/* Screen 1 Exact Headline */}
        <View style={styles.textContainer}>
          <Text style={styles.mainHeadline}>
            Every Journey Tells a Story.{"\n"}
            <Text style={{ color: colors.primary }}>Let&apos;s Keep It Alive.</Text>
          </Text>
          <Text style={styles.subtext}>
            Tactile automotive telemetry, OBD-II health diagnostics, and smart upkeep reminders for discerning car owners.
          </Text>
        </View>

        {/* 3 Core Value Props */}
        <View style={styles.valuePropsContainer}>
          <View style={[neuStyles.card, styles.valueCard]}>
            <Activity size={20} color={colors.primary} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.valueTitle}>Live Health Dial</Text>
              <Text style={styles.valueDesc}>Concentric health gauge calibrated with OBD-II CAN-bus telemetry.</Text>
            </View>
          </View>

          <View style={[neuStyles.card, styles.valueCard]}>
            <Camera size={20} color={colors.accentEmerald} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.valueTitle}>12-Angle Visual Inspection</Text>
              <Text style={styles.valueDesc}>Comprehensive 360° walkaround, engine bay & underbody analysis.</Text>
            </View>
          </View>

          <View style={[neuStyles.card, styles.valueCard]}>
            <ShieldCheck size={20} color={colors.accentRose} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.valueTitle}>Emergency SOS Mode</Text>
              <Text style={styles.valueDesc}>One-touch 112 emergency dialer and live roadside GPS sharing.</Text>
            </View>
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={[neuStyles.buttonPrimary, styles.ctaButton]}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.ctaButtonText}>Enter DriveSense Cockpit</Text>
          <ArrowRight size={18} color={colors.textDark} style={{ marginLeft: 8 }} />
        </TouchableOpacity>
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
    padding: 24,
    paddingBottom: 40,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  brandName: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  emblemContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  emblemCard: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    marginVertical: 16,
  },
  mainHeadline: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.textPrimary,
    lineHeight: 36,
  },
  subtext: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 10,
  },
  valuePropsContainer: {
    gap: 12,
    marginVertical: 20,
  },
  valueCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  valueTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  valueDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    marginTop: 10,
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.textDark,
  },
});
