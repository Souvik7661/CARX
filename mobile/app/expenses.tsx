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
  Plus,
  Fuel,
  Wrench,
  CreditCard,
  Car,
  TrendingUp,
  Calendar,
} from "lucide-react-native";

export default function ExpensesScreen() {
  const router = useRouter();

  const monthlyHistory = [
    { month: "Sep", amount: 4850, heightPercent: 78 },
    { month: "Oct", amount: 3200, heightPercent: 52 },
    { month: "Nov", amount: 6100, heightPercent: 100 },
    { month: "Dec", amount: 5400, heightPercent: 88 },
    { month: "Jan", amount: 4200, heightPercent: 68 },
    { month: "Feb", amount: 4850, heightPercent: 78 },
  ];

  const categories = [
    { name: "Fuel (Petrol 95)", amount: 3100, percent: 64, icon: Fuel, color: colors.primary },
    { name: "Service & Upkeep", amount: 1050, percent: 22, icon: Wrench, color: colors.accentEmerald },
    { name: "Fastag & Tolls", amount: 500, percent: 10, icon: CreditCard, color: colors.accentAmber },
    { name: "Parking & Cleaning", amount: 200, percent: 4, icon: Car, color: colors.accentPurple },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={neuStyles.circle} onPress={() => router.back()}>
            <ChevronLeft size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.screenTitle}>Expenses & Fuel</Text>
            <Text style={styles.screenSubtitle}>Financial Cost Management</Text>
          </View>
          <TouchableOpacity
            style={neuStyles.circle}
            onPress={() => Alert.alert("Add Expense", "Opening quick expense logger...")}
          >
            <Plus size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Current Month Overview Card (Screen 6 Reference: ₹ 4,850) */}
        <View style={[neuStyles.card, styles.overviewCard]}>
          <View style={styles.overviewHeader}>
            <Text style={styles.overviewLabel}>CURRENT MONTH TOTAL</Text>
            <View style={styles.trendPill}>
              <TrendingUp size={12} color={colors.accentEmerald} />
              <Text style={styles.trendText}>-8% vs last month</Text>
            </View>
          </View>
          <Text style={styles.totalAmount}>₹ 4,850</Text>
          <Text style={styles.totalSub}>Calculated for Honda City ZX • Sep 2026</Text>
        </View>

        {/* 6-Month Neumorphic Bar Chart */}
        <View style={[neuStyles.card, styles.chartCard]}>
          <Text style={styles.chartTitle}>6-MONTH EXPENSE TREND</Text>
          <View style={styles.barsRow}>
            {monthlyHistory.map((item, idx) => (
              <View key={idx} style={styles.barColumn}>
                <View style={[neuStyles.inset, styles.barWell]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${item.heightPercent}%`,
                        backgroundColor: idx === 5 ? colors.primary : colors.surfaceLight,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barMonth, idx === 5 && { color: colors.primary, fontWeight: "900" }]}>
                  {item.month}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Category Breakdown List */}
        <Text style={styles.sectionTitle}>CATEGORY BREAKDOWN</Text>
        <View style={styles.categoriesContainer}>
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <View key={idx} style={[neuStyles.card, styles.catCard]}>
                <View style={styles.catHeader}>
                  <View style={styles.catLeft}>
                    <View style={[neuStyles.circle, { width: 38, height: 38 }]}>
                      <Icon size={18} color={cat.color} />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.catName}>{cat.name}</Text>
                      <Text style={styles.catPercent}>{cat.percent}% of monthly budget</Text>
                    </View>
                  </View>
                  <Text style={styles.catAmount}>₹ {cat.amount.toLocaleString()}</Text>
                </View>

                {/* Progress Bar */}
                <View style={[neuStyles.inset, styles.progressBarBg]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${cat.percent}%`, backgroundColor: cat.color },
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
  overviewCard: {
    padding: 20,
    marginBottom: 16,
  },
  overviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overviewLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 1,
  },
  trendPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16,185,129,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    gap: 4,
  },
  trendText: {
    fontSize: 10,
    color: colors.accentEmerald,
    fontWeight: "800",
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: "900",
    color: colors.textPrimary,
    marginVertical: 4,
  },
  totalSub: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "600",
  },
  chartCard: {
    padding: 18,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 16,
  },
  barsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    paddingHorizontal: 8,
  },
  barColumn: {
    alignItems: "center",
    flex: 1,
  },
  barWell: {
    width: 22,
    height: 100,
    borderRadius: 11,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 11,
  },
  barMonth: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: "700",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 12,
  },
  categoriesContainer: {
    gap: 12,
  },
  catCard: {
    padding: 16,
  },
  catHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  catLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  catName: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  catPercent: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  catAmount: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.textPrimary,
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
