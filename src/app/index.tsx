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
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

const configSchema = zod.object({
  sets: zod
    .string()
    .min(1, { message: "Set count is required" })
    .regex(/^\d+$/, { message: "Set count must be a number" })
    .transform(Number)
    .refine((n: number) => n > 0 && n <= 99, {
      message: "Set count must be between 1 and 99",
    }),
  reps: zod
    .string()
    .min(1, { message: "Rep count is required" })
    .regex(/^\d+$/, { message: "Rep count must be a number" })
    .transform(Number)
    .refine((n: number) => n > 0 && n <= 99, {
      message: "Rep count must be between 1 and 99",
    }),
  interSetRest: zod
    .string()
    .min(1, { message: "Inter-set rest is required" })
    .regex(/^\d+$/, { message: "Inter-set rest must be a number" })
    .transform(Number)
    .refine((n: number) => n >= 0 && n <= 1800, {
      message: "Inter-set rest must be between 0 and 1800",
    }),
  interRepRest: zod
    .string()
    .min(1, { message: "Inter-rep rest is required" })
    .regex(/^\d+$/, { message: "Inter-rep rest must be a number" })
    .transform(Number)
    .refine((n: number) => n >= 0 && n <= 60, {
      message: "Inter-rep rest must be between 0 and 60",
    }),
  repWorkTime: zod
    .string()
    .min(1, { message: "Rep work time is required" })
    .regex(/^\d+$/, { message: "Rep work time must be a number" })
    .transform(Number)
    .refine((n: number) => n > 0 && n <= 600, {
      message: "Rep work time must be between 1 and 600",
    }),
});

export default function ConfigScreen() {
  const PLACEHOLDERS = {
    sets: "3",
    reps: "5",
    interSetRest: "60",
    interRepRest: "5",
    repWorkTime: "10",
  };
  const INPUT_FIELDS = [
    { label: "Set count", name: "sets", placeholder: PLACEHOLDERS.sets },
    { label: "Rep count", name: "reps", placeholder: PLACEHOLDERS.reps },
    {
      label: "Inter-set Rest (secs)",
      name: "interSetRest",
      placeholder: PLACEHOLDERS.interSetRest,
    },
    {
      label: "Inter-rep Rest (secs)",
      name: "interRepRest",
      placeholder: PLACEHOLDERS.interRepRest,
    },
    {
      label: "Rep Work Time (secs)",
      name: "repWorkTime",
      placeholder: PLACEHOLDERS.repWorkTime,
    },
  ];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(configSchema),
    mode: "onTouched",
    defaultValues: {
      sets: "",
      reps: "",
      interSetRest: "",
      interRepRest: "",
      repWorkTime: "",
    },
  });

  const onSubmit = (data: zod.infer<typeof configSchema>) => {
    router.push({
      pathname: "/timer",
      params: {
        sets: data.sets.toString(),
        reps: data.reps.toString(),
        interSetRest: data.interSetRest.toString(),
        interRepRest: data.interRepRest.toString(),
        repWorkTime: data.repWorkTime.toString(),
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
            {INPUT_FIELDS.map(({ label, name, placeholder }) => (
              <Controller
                key={name}
                control={control}
                name={name as keyof zod.infer<typeof configSchema>}
                render={({
                  field: { value, onChange, onBlur },
                  fieldState: { error },
                }) => (
                  <>
                    <Text style={styles.label}>{label}</Text>
                    <TextInput
                      style={[styles.input, error && { marginBottom: 8 }]}
                      keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder={placeholder}
                      placeholderTextColor="#888"
                    />
                    {error && <Text style={styles.error}>{error.message}</Text>}
                  </>
                )}
              />
            ))}

            <Pressable
              style={({ pressed }) => [
                styles.startButton,
                pressed && { opacity: 0.88 },
              ]}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.startButtonText}>Start</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.resetButton,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => reset()}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
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
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
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
  error: {
    color: "#f00",
    fontSize: 14,
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
    fontSize: 18,
  },
  resetButton: {
    backgroundColor: "#f6f6f6",
    paddingVertical: 14,
    borderRadius: 8,
    opacity: 0.9,
    marginTop: 16,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#307eae",
    fontWeight: "bold",
    fontSize: 18,
  },
});
