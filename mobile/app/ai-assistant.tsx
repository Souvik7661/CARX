import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors } from "../src/theme/colors";
import { neuStyles } from "../src/theme/neumorphic";
import {
  ChevronLeft,
  Bot,
  Send,
  Mic,
  Sparkles,
  User,
} from "lucide-react-native";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

export default function AIAssistantScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "assistant",
      text: "Hello Souvik! I'm your DriveSense AI. I've analyzed your Honda City's latest OBD-II CAN-bus logs. Everything looks solid at 92% health. What can I help you inspect today?",
      timestamp: "10:14 AM",
    },
  ]);
  const [inputText, setInputText] = useState("");

  const suggestedChips = [
    "Why is my engine running hot?",
    "What does DTC P0420 mean?",
    "30,000 km service cost estimate",
    "Check battery voltage status",
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    setTimeout(() => {
      let reply = "I have reviewed your vehicle's telemetry. The engine coolant temp is steady at 89°C and alternator output is 14.1V, which is within manufacturer specs.";
      if (query.toLowerCase().includes("cost")) {
        reply = "For your Honda City's 30,000 km service, estimated OEM costs are ₹ 4,200 to ₹ 5,600 including engine oil (0W-20), oil filter, air filter, and brake caliper greasing.";
      } else if (query.toLowerCase().includes("p0420")) {
        reply = "DTC P0420 indicates Catalyst System Efficiency Below Threshold (Bank 1). In 80% of cases, it is caused by an aging downstream O2 sensor rather than the catalytic converter itself.";
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={neuStyles.circle} onPress={() => router.back()}>
            <ChevronLeft size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.screenTitle}>DriveSense AI</Text>
            <Text style={styles.screenSubtitle}>Automotive Diagnostics Copilot</Text>
          </View>
          <View style={[neuStyles.circle, { width: 40, height: 40 }]}>
            <Bot size={20} color={colors.primary} />
          </View>
        </View>

        {/* Suggested Chips Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {suggestedChips.map((chip, idx) => (
            <TouchableOpacity
              key={idx}
              style={[neuStyles.pill, styles.chipPill]}
              onPress={() => handleSend(chip)}
            >
              <Sparkles size={12} color={colors.primary} style={{ marginRight: 6 }} />
              <Text style={styles.chipText}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Chat Messages */}
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={{ padding: 16, gap: 14 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((m) => (
            <View
              key={m.id}
              style={[
                styles.messageBubbleWrapper,
                m.sender === "user" ? styles.userBubbleWrapper : styles.botBubbleWrapper,
              ]}
            >
              <View
                style={[
                  neuStyles.card,
                  styles.messageBubble,
                  m.sender === "user" ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    m.sender === "user" ? styles.userText : styles.botText,
                  ]}
                >
                  {m.text}
                </Text>
                <Text style={styles.timeText}>{m.timestamp}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <View style={[neuStyles.inset, styles.inputWrapper]}>
            <TextInput
              style={styles.input}
              placeholder="Ask about mileage, fault codes, service..."
              placeholderTextColor={colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSend()}
            />
            <TouchableOpacity style={styles.micBtn}>
              <Mic size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[neuStyles.buttonPrimary, styles.sendBtn]}
            onPress={() => handleSend()}
          >
            <Send size={18} color={colors.textDark} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
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
  chipsContainer: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 8,
  },
  chipPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  messagesContainer: {
    flex: 1,
  },
  messageBubbleWrapper: {
    flexDirection: "row",
    width: "100%",
  },
  userBubbleWrapper: {
    justifyContent: "flex-end",
  },
  botBubbleWrapper: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "82%",
    padding: 14,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
  },
  botBubble: {
    backgroundColor: colors.surface,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 19,
  },
  userText: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  botText: {
    color: colors.textSecondary,
  },
  timeText: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 6,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 10,
    backgroundColor: colors.surfaceSunken,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 48,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
  },
  micBtn: {
    padding: 4,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
});
