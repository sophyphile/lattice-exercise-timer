import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function ConfigScreen() {
  const DEFAULTS = {
    sets: "3",
    reps: "5",
    interSetRest: "60",
    interRepRest: "5",
    repWorkTime: "10",
  };

  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [interSetRest, setInterSetRest] = useState("");
  const [interRepRest, setInterRepRest] = useState("");
  const [repWorkTime, setRepWorkTime] = useState("");

  const handleStart = () => {
    router.push({
      pathname: "/timer",
      params: {
        sets: sets || DEFAULTS.sets,
        reps: reps || DEFAULTS.reps,
        interSetRest: interSetRest || DEFAULTS.interSetRest,
        interRepRest: interRepRest || DEFAULTS.interRepRest,
        repWorkTime: repWorkTime || DEFAULTS.repWorkTime,
      },
    });
  };

  return (
    <LinearGradient
      colors={["#121212", "rgb(36, 60, 75)"]}
      locations={[0.69, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.container}>
            <Text style={styles.label}>Set count</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={sets}
              onChangeText={setSets}
              placeholder={DEFAULTS.sets}
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Rep count</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={reps}
              onChangeText={setReps}
              placeholder={DEFAULTS.reps}
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Inter-set Rest (secs)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={interSetRest}
              onChangeText={setInterSetRest}
              placeholder={DEFAULTS.interSetRest}
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Inter-rep Rest (secs)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={interRepRest}
              onChangeText={setInterRepRest}
              placeholder={DEFAULTS.interRepRest}
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Rep Work Time (secs)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={repWorkTime}
              onChangeText={setRepWorkTime}
              placeholder={DEFAULTS.repWorkTime}
              placeholderTextColor="#888"
            />

            <Pressable style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>Start</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    padding: 40,
    // backgroundColor: "#121212",
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: "#f6f6f6",
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    padding: 10,
    color: "#f6f6f6",
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: "#307eae",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  startButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
