import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageHeader } from "@/components/ui/PageHeader";
import { FarmerHeader, AiFab } from "@/components/FarmerHeader";
import { Send, Bot, User } from "lucide-react-native";

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Namaste! I am your AI Farm Assistant. Ask me anything about crops, soil, or weather.",
      sender: "bot",
    },
  ]);
  const [inputText, setInputText] = useState("");

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");

    // Simulate bot response
    setTimeout(() => {
      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: "I can help you with that. Based on your soil report, Cotton is a good choice.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FarmerHeader />
      <PageHeader
        title="AI Assistant"
        subtitle="Ask in Hindi, Marathi, or English"
      />

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContent}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageRow,
              item.sender === "user" ? styles.userRow : styles.botRow,
            ]}
          >
            {item.sender === "bot" && (
              <View style={styles.botIcon}>
                <Bot size={20} color="#fff" />
              </View>
            )}
            <View
              style={[
                styles.bubble,
                item.sender === "user" ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.sender === "user" ? styles.userText : styles.botText,
                ]}
              >
                {item.text}
              </Text>
            </View>
            {item.sender === "user" && (
              <View style={styles.userIcon}>
                <User size={20} color="#fff" />
              </View>
            )}
          </View>
        )}
      />

      <KeyboardAvoidingView
        style={styles.inputWrapper}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask a question..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#64748b",
  },
  chatContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 120,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 8,
  },
  userRow: {
    justifyContent: "flex-end",
  },
  botRow: {
    justifyContent: "flex-start",
  },
  botIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0ea5e9",
    justifyContent: "center",
    alignItems: "center",
  },
  userIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#64748b",
    justifyContent: "center",
    alignItems: "center",
  },
  bubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 16,
  },
  botBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: "#0ea5e9",
    borderBottomRightRadius: 4,
    elevation: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  botText: {
    color: "#0f172a",
  },
  userText: {
    color: "#fff",
  },
  inputWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: 72,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    alignItems: "flex-end",
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    fontSize: 14,
    maxHeight: 100,
    textAlignVertical: "top",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0ea5e9",
    justifyContent: "center",
    alignItems: "center",
  },
});
