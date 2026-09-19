import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../src/theme/colors";
import { neuStyles } from "../../src/theme/neumorphic";
import {
  User,
  Car,
  Database,
  FileText,
  Shield,
  Smartphone,
  ChevronRight,
  LogOut,
  Award
} from "lucide-react-native";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[neuStyles.card, styles.profileCard]}>
          <View style={[neuStyles.circle, styles.avatarCircle]}>
            <Text style={styles.avatarText}>SK</Text>
          </View>
          <Text style={styles.userName}>Souvik Kundu</Text>
          <Text style={styles.userTier}>DriveSense Premium Member</Text>

          <View style={styles.badgeRow}>
            <View style={[neuStyles.pill, styles.memberBadge]}>
              <Award size={12} color={colors.primary} />
              <Text style={styles.badgeText}>Verified Vehicle Owner</Text>
            </View>
          </View>
        </View>

        {/* Vehicle Management */}
        <Text style={styles.sectionTitle}>LINKED VEHICLES</Text>
        <View style={[neuStyles.card, styles.vehicleCard]}>
          <View style={styles.vehicleHeader}>
            <View style={[neuStyles.circle, { width: 40, height: 40 }]}>
              <Car size={20} color={colors.primary} />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.carName}>Honda City ZX</Text>
              <Text style={styles.carPlate}>MH 02 DQ 8841 • Petrol</Text>
            </View>
          </View>
          <View style={styles.vehicleFooter}>
            <Text style={styles.dbStatusText}>SQLite Offline Cached: 100%</Text>
            <TouchableOpacity
              style={neuStyles.pill}
              onPress={() => router.push("/onboarding")}
            >
              <Text style={styles.switchText}>+ Add New</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Feature Hub Shortcuts */}
        <Text style={styles.sectionTitle}>DRIVESENSE SUITE</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={[neuStyles.card, styles.menuItem]}
            onPress={() => router.push("/inspection")}
          >
            <View style={styles.menuLeft}>
              <Smartphone size={18} color={colors.primary} />
              <Text style={styles.menuText}>12-Angle Visual Inspection</Text>
            </View>
            <ChevronRight size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[neuStyles.card, styles.menuItem]}
            onPress={() => router.push("/ai-assistant")}
          >
            <View style={styles.menuLeft}>
              <Shield size={18} color={colors.accentBlue} />
              <Text style={styles.menuText}>DriveSense AI Diagnostics</Text>
            </View>
            <ChevronRight size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[neuStyles.card, styles.menuItem]}
            onPress={() => router.push("/emergency")}
          >
            <View style={styles.menuLeft}>
              <Shield size={18} color={colors.accentRose} />
              <Text style={styles.menuText}>Emergency SOS Hotline (112)</Text>
            </View>
            <ChevronRight size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[neuStyles.card, styles.menuItem]}
            onPress={() => router.push("/onboarding")}
          >
            <View style={styles.menuLeft}>
              <Car size={18} color={colors.accentAmber} />
              <Text style={styles.menuText}>View Onboarding Screen</Text>
            </View>
            <ChevronRight size={18} color={colors.textMuted} />
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
  profileCard: {
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.primary,
  },
  userName: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  userTier: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgeRow: {
    marginTop: 10,
  },
  memberBadge: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 12,
  },
  vehicleCard: {
    padding: 16,
    marginBottom: 24,
  },
  vehicleHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  carName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  carPlate: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  vehicleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  dbStatusText: {
    fontSize: 11,
    color: colors.accentEmerald,
    fontWeight: "600",
  },
  switchText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },
  menuContainer: {
    gap: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
});
