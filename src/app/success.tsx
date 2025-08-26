// app/success.tsx
import { View, Text, Pressable, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import ConfettiCannon from "react-native-confetti-cannon";
import { useRef } from "react";

export default function SuccessScreen() {
  const { totalTimeSeconds } = useLocalSearchParams();
  const totalTimeSecondsNumber = Number(totalTimeSeconds);

  const minutes = Math.floor(totalTimeSecondsNumber / 60);
  const seconds = totalTimeSecondsNumber % 60;
  const formatted = `${minutes}m ${seconds}s`;

  return (
    <LinearGradient
      colors={["#121212", "#280701"]}
      locations={[0.78, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Exercise Complete! 😤</Text>
        <Text style={styles.subtitle}>Total Time: 🎉 {formatted} 🎉</Text>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.88 }]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Back to Start</Text>
        </Pressable>

        {/* 🎉 Confetti Cannon */}
        <ConfettiCannon
          count={265}
          origin={{ x: 180, y: 0 }}
          explosionSpeed={525}
          fallSpeed={2000}
          fadeOut={true}
          autoStart={true}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#121212",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: "#f6f6f6",
    marginBottom: 40,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 24,
    color: "#f6f6f6",
    marginBottom: 40,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#307eae",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
