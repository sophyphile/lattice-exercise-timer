import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LatticeLogo from "../../assets/lattice_logo_h_white.svg";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#121212",
        }}
        edges={["top", "left", "right"]}
      >
        <Stack
          screenOptions={{
            headerShown: true,
            headerShadowVisible: false,
            headerTitle: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <LatticeLogo
                  style={{
                    width: 200,
                    height: 40,
                    marginRight: 8,
                  }}
                />
              </View>
            ),
            headerStyle: {
              backgroundColor: "#121212",
            },
            headerTintColor: "#f5d329",
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen
            name="index"
            options={{ title: "Config", headerLeft: () => null }}
          />
          <Stack.Screen
            name="timer"
            options={{
              title: "Timer",
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="success"
            options={{
              title: "Exercise Complete",
              headerBackVisible: false,
            }}
          />
        </Stack>
      </SafeAreaView>
    </>
  );
}
