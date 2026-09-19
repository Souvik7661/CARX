import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors } from "../src/theme/colors";
import { neuStyles } from "../src/theme/neumorphic";
import {
  ChevronLeft,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Share2,
  Sparkles
} from "lucide-react-native";
import { DEFAULT_INSPECTION_ANGLES, detectMockDefects } from "../src/services/inspectionService";
import { InspectionZone, InspectionAngle } from "../src/types";

export default function InspectionScreen() {
  const router = useRouter();
  const [activeZone, setActiveZone] = useState<InspectionZone>("exterior");
  const [angles, setAngles] = useState<InspectionAngle[]>(DEFAULT_INSPECTION_ANGLES);
  const [selectedAngle, setSelectedAngle] = useState<InspectionAngle | null>(DEFAULT_INSPECTION_ANGLES[0]);
  const [isScanning, setIsScanning] = useState(false);

  const filteredAngles = angles.filter((a) => a.zone === activeZone);
  const verifiedCount = angles.filter((a) => a.status === "verified").length;

  const handleCapturePhoto = () => {
    if (!selectedAngle) return;
    setIsScanning(true);

    setTimeout(() => {
      const defect = detectMockDefects(selectedAngle.id);
      setAngles((prev) =>
        prev.map((a) =>
          a.id === selectedAngle.id
            ? {
                ...a,
                status: defect.hasDefect ? "flagged" : "verified",
                damageDetected: defect.hasDefect,
                damageSeverity: defect.severity,
                notes: defect.message || "Surface verified intact. Paint thickness standard.",
                capturedAt: new Date().toISOString(),
              }
            : a
        )
      );
      setIsScanning(false);
      Alert.alert(
        defect.hasDefect ? "Flagged Checkpoint" : "Checkpoint Verified",
        defect.message || `${selectedAngle.title} has passed structural verification.`
      );
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={neuStyles.circle} onPress={() => router.back()}>
            <ChevronLeft size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.screenTitle}>Visual Inspection</Text>
            <Text style={styles.screenSubtitle}>12-Angle Vehicle Walkaround</Text>
          </View>
          <TouchableOpacity
            style={neuStyles.circle}
            onPress={() => Alert.alert("Report Export", "Exporting inspection report PDF...")}
          >
            <Share2 size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Inspection Progress Card */}
        <View style={[neuStyles.card, styles.progressCard]}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>INSPECTION COMPLETION</Text>
            <Text style={styles.progressValue}>{verifiedCount}/12 COMPLETED</Text>
          </View>
          <View style={[neuStyles.inset, styles.progressBarBg]}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(verifiedCount / 12) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Zone Selector Pills */}
        <View style={styles.zoneRow}>
          {(["exterior", "interior", "engine", "underbody"] as InspectionZone[]).map((zone) => (
            <TouchableOpacity
              key={zone}
              onPress={() => setActiveZone(zone)}
              style={[
                neuStyles.pill,
                styles.zonePill,
                activeZone === zone && styles.zonePillActive,
              ]}
            >
              <Text
                style={[
                  styles.zonePillText,
                  activeZone === zone && styles.zonePillTextActive,
                ]}
              >
                {zone.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Active Angle Target Inset View */}
        {selectedAngle && (
          <View style={[neuStyles.cardPrimary, styles.activeTargetCard]}>
            <View style={styles.targetHeader}>
              <View>
                <Text style={styles.targetBadge}>SELECTED CHECKPOINT</Text>
                <Text style={styles.targetTitle}>{selectedAngle.title}</Text>
              </View>
              <View style={styles.statusBadge}>
                {selectedAngle.status === "verified" ? (
                  <CheckCircle2 size={18} color={colors.accentEmerald} />
                ) : selectedAngle.status === "flagged" ? (
                  <AlertTriangle size={18} color={colors.accentRose} />
                ) : (
                  <Clock size={18} color={colors.accentAmber} />
                )}
              </View>
            </View>

            {/* Viewfinder simulation */}
            <View style={[neuStyles.inset, styles.viewfinder]}>
              <Camera size={36} color={colors.primary} />
              <Text style={styles.viewfinderText}>
                {isScanning ? "AI Computer Vision Analyzing..." : "Aim camera at component target"}
              </Text>
              {selectedAngle.notes && (
                <Text style={styles.notesText}>{selectedAngle.notes}</Text>
              )}
            </View>

            {/* Trigger Capture Button */}
            <TouchableOpacity
              style={[neuStyles.buttonPrimary, styles.captureBtn]}
              onPress={handleCapturePhoto}
              disabled={isScanning}
            >
              <Sparkles size={18} color={colors.textDark} />
              <Text style={styles.captureBtnText}>
                {isScanning ? "Scanning Component..." : "Capture & Verify Angle"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Checkpoints Grid */}
        <Text style={styles.sectionTitle}>
          {activeZone.toUpperCase()} CHECKPOINTS ({filteredAngles.length})
        </Text>
        <View style={styles.checkpointsList}>
          {filteredAngles.map((angle) => (
            <TouchableOpacity
              key={angle.id}
              style={[
                neuStyles.card,
                styles.checkpointRow,
                selectedAngle?.id === angle.id && { borderColor: colors.primary },
              ]}
              onPress={() => setSelectedAngle(angle)}
            >
              <View style={styles.cpLeft}>
                <View style={[neuStyles.circle, { width: 36, height: 36 }]}>
                  {angle.status === "verified" ? (
                    <CheckCircle2 size={18} color={colors.accentEmerald} />
                  ) : angle.status === "flagged" ? (
                    <AlertTriangle size={18} color={colors.accentRose} />
                  ) : (
                    <Clock size={18} color={colors.textMuted} />
                  )}
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.cpTitle}>{angle.title}</Text>
                  <Text style={styles.cpStatus}>
                    Status: {angle.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
    color: colors.primary,
    fontWeight: "600",
  },
  progressCard: {
    padding: 16,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
  },
  progressValue: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  zoneRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  zonePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  zonePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  zonePillText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
  },
  zonePillTextActive: {
    color: colors.textDark,
  },
  activeTargetCard: {
    padding: 16,
    marginBottom: 24,
  },
  targetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  targetBadge: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  targetTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.textPrimary,
    marginTop: 2,
  },
  statusBadge: {
    marginTop: 2,
  },
  viewfinder: {
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    padding: 16,
  },
  viewfinderText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 10,
    fontWeight: "600",
  },
  notesText: {
    fontSize: 11,
    color: colors.accentEmerald,
    marginTop: 6,
    textAlign: "center",
  },
  captureBtn: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 14,
    marginTop: 14,
  },
  captureBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textDark,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 12,
  },
  checkpointsList: {
    gap: 10,
  },
  checkpointRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  cpLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  cpTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  cpStatus: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
});
