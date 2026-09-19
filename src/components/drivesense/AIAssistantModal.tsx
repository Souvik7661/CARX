"use client";

import React, { useState } from "react";
import { X, Sparkles, Send, Mic, Bot, User, Car } from "lucide-react";
import { DriveSenseCar, ChatMessage } from "@/lib/drivesense-types";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: DriveSenseCar | null;
}

export default function AIAssistantModal({
  isOpen,
  onClose,
  car,
}: AIAssistantModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "assistant",
      text: car
        ? `Hi Souvik! 🚗 I'm your AI Car Assistant for your ${car.brand} ${car.model}. What can I check for you today?`
        : "Hi Souvik! 🚗 I'm your AI Car Assistant. Ask me anything about vehicle maintenance, diagnostics, or fuel efficiency!",
      timestamp: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    "Why is my mileage low?",
    "When should I change engine oil?",
    "What could cause engine noise?",
    "Show my total expenses this year",
  ];

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: promptText,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Generate context-aware response based on active car
    setTimeout(() => {
      let reply = "";
      const text = promptText.toLowerCase();

      if (text.includes("mileage")) {
        if (!car) {
          reply = "Standard mileage depends on driving habits, tyre pressure (recommended 32-35 PSI), and regular air filter changes.";
        } else if (car.fuelType === "Diesel") {
          reply = `Your ${car.brand} ${car.model} is currently averaging ${car.avgMileage}. Diesel engines maintain best economy between 1,750 - 2,200 RPM. If mileage drops, check tyre PSI, fuel filter, and MAF sensor.`;
        } else if (car.fuelType === "Electric") {
          reply = `Your ${car.brand} ${car.model} is averaging ${car.avgMileage}. Range is most impacted by ambient cabin AC temperatures and regenerative braking settings.`;
        } else {
          reply = `Your ${car.brand} ${car.model} has an average mileage of ${car.avgMileage}. Clean spark plugs and maintaining tyre pressure at 33 PSI can yield up to +1.2 km/l.`;
        }
      } else if (text.includes("oil") || text.includes("change")) {
        if (!car) {
          reply = "Synthetic engine oil is typically replaced every 10,000 km or 1 year, whichever comes first.";
        } else if (car.fuelType === "Electric") {
          reply = `Your ${car.brand} ${car.model} is 100% electric and has no engine oil! However, reduction gearbox fluid and battery coolant should be checked every 20,000 km.`;
        } else {
          reply = `For your ${car.brand} ${car.model}, synthetic 5W-30 engine oil is recommended. According to your current schedule, your next oil service is due in ${car.reminders[0]?.subtitle || "800 km"}.`;
        }
      } else if (text.includes("noise")) {
        reply = "Common causes of engine noise: ticking can indicate low oil pressure or hydraulic tappets, squealing usually points to a loose serpentine accessory belt, and grinding during braking indicates worn brake pads.";
      } else if (text.includes("expense") || text.includes("cost") || text.includes("spent")) {
        if (!car) {
          reply = "Connect your vehicle to track real-time fuel, maintenance, and insurance expenses!";
        } else {
          reply = `You have spent ₹ ${car.expenses.totalYearlySpent.toLocaleString("en-IN")} this year on your ${car.brand} ${car.model}. Fuel accounts for ${car.expenses.breakdown.fuel}% and service accounts for ${car.expenses.breakdown.service}%.`;
        }
      } else {
        reply = `Analyzing diagnostic telemetry for ${car ? car.brand + " " + car.model : "your vehicle"}... Everything is operating within expected factory tolerances with a health score of ${car ? car.healthScore + "%" : "100%"}.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: "assistant",
          text: reply,
          timestamp: "Just now",
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-[620px] rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header (Matching Screen 3) */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">AI Car Assistant</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-mono">Online</span>
              </div>
              <p className="text-[10px] text-slate-400">
                {car ? `${car.brand} ${car.model} Diagnostics Active` : "Automotive Intelligence"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? "bg-cyan-600 text-white rounded-br-none"
                      : "bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-bl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5 font-bold text-[10px]">
                    S
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-500 text-xs pl-9">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
        </div>

        {/* Suggestion Prompt Chips (Matching Screen 3) */}
        <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendPrompt(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 text-[11px] font-medium border border-slate-700/60 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(inputValue);
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question..."
              className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <div className="absolute right-1.5 flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleSendPrompt("Perform full subsystem diagnostic check")}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors"
                title="Voice Input"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="submit"
                className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          <p className="text-[10px] text-center text-slate-500 mt-2">
            ✨ Powered by advanced AI • Safe. Helpful. Automotive Focused.
          </p>
        </div>
      </div>
    </div>
  );
}
