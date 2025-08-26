# Lattice Exercise Timer ⏱️

This is a React Native app (built with Expo + TypeScript + Expo Router) designed to help users configure and run custom interval timers with smooth visuals, haptics, and logic tailored for exercise routines like Lattice Training's training plans or custom work/rest sets.

## 🧠 Features

- Configurable sets, reps, work time, inter-rep rest, and inter-set rest.
- Visual timer with pulsating animations and progress ring.
- Timeline indicator of all steps.
- Auto-pauses when app is out of focus.
- Haptic feedback on transitions.
- Confetti celebration on completion 🎉

---

## 🗂️ Folder Structure

```text
├── assets/                        # Static assets (images, audio, etc.)
├── src/
│   ├── app/                       # Screens/routes defined by expo-router
│   │   ├── _layout.tsx            # Layout wrapper for all routes
│   │   ├── +not-found.tsx         # Custom 404 screen
│   │   ├── index.tsx              # Home screen (input form)
│   │   ├── success.tsx            # Final screen after workout finishes
│   │   ├── timer.tsx              # Timer screen and logic
│   ├── components/                # Reusable visual components
│   │   ├── timer-progress.tsx
│   │   ├── timer-timeline.tsx
│   ├── types/                     # Shared TypeScript type definitions
│   │   ├── session-config.types.ts
│   │   ├── timer-progress.types.ts
│   │   ├── timer-step.types.ts
│   │   ├── timer-timeline.types.ts
│   ├── utils/                     # Pure functions (logic/calculations)
│   │   ├── calculate-total-time.ts
│   │   ├── celebrate-with-haptics.ts
│   │   ├── format-time.ts
│   │   ├── generate-timer-steps.ts
├── app.json                       # Main Expo configuration
├── declarations.d.ts              # Global module/type declarations
├── babel.config.js                # Babel compiler settings
├── metro.config.js                # Metro bundler config (for assets, SVGs)
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies, scripts, metadata
├── package-lock.json              # Locked dependency versions (auto-generated)
```

---

## 🕹️ Timer Logic

The timer breaks the session into discrete **steps** using a utility called `generateTimerSteps`. Steps include:

- `"work"` (per rep)
- `"inter-rep-rest"` (between reps, if reps > 1)
- `"inter-set-rest"` (between sets, if sets > 1)

Rather than relying on `setInterval`, this app uses timestamp-based animation frame logic for more accurate and smooth countdowns, especially under varying frame rates or background app conditions.

- The timer uses `Date.now()` to track elapsed time between frames.
- `requestAnimationFrame()` ensures consistent timing and better battery efficiency than setInterval, particularly during animation-heavy UIs.
- Each timer step is started by recording a startTimestamp and calculating elapsed time in every animation frame.
- `secondsLeft` is derived from the original step duration minus the elapsed time, ensuring perfect countdown accuracy even if the app stutters.
- Haptics are triggered precisely at step transitions, not tied to animation frame jitter.

```ts
const elapsed = (Date.now() - startTimestamp) / 1000;
const newSecondsLeft = Math.max(stepDuration - elapsed, 0);
```

### ⏸️ **App Pause Logic**

The timer pauses automatically when the app is backgrounded or inactive using `AppState` listeners.

- On app blur: the timer pauses and stores a `pausedAt` timestamp.
- On app focus: it resumes and adjusts the `startTimestamp` forward by the time the app was paused.

This ensures that timers stay accurate regardless of whether the app is backgrounded or brought back to focus later.

---

## 🧪 Form Validation with Zod

We use `zod` for elegant, declarative validation.

### 🧾 Basic Schema

- All fields (`sets`, `reps`, `repWorkTime`, etc.) are initially strings for form compatibility.
- A combination of `.regex()`, `.transform(Number)` and `.refine(...)` are used to validate numeric input and enforce acceptable ranges.

### ⚠️ Conditional Validation (via `.superRefine()`)

We use `.superRefine()` to enforce:

- **`interSetRest` is required if `sets > 1`**
- **`interRepRest` is required if `reps > 1`**

```ts
if (sets > 1 && !interSetRest) {
  ctx.addIssue({ path: ["interSetRest"], message: "Required if sets > 1" });
}
```

We also allow the `interSetRest` and `interRepRest` values to be **empty** if not required, by using `.optional()` with validation logic in `.superRefine`.

---

## ✅ OnTouched Logic

To avoid overwhelming the user with immediate validation errors, we track `touched` state per field. Errors only display once the user has interacted with the field (e.g., onBlur), not on first render.

---

## 💥 Haptic Feedback Choices

Haptics add tactile richness to the app. We used a combination of `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)` and `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)` for step transitions.

We use a **burst** of haptics to celebrate success, defined in `celebrate-with-haptics.ts`:

```js
for (let i = 0; i < bursts; i++) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise((res) => setTimeout(res, interval));
}
```

This creates a party-popper-like celebratory pattern, syncing nicely with the final confetti animation 🎊

---

## 🎨 SVG and Animation

We use `react-native-svg` to draw a circular progress ring that fills as the current step elapses. This is overlaid with a **step label** (e.g. "WORK") styled for clarity and intensity.

To match the aesthetics of the Lattice Training brand, we also replaced the default navigation title with a custom logo header:

- We import the logo as an SVG and render it directly into the header.
- This is done by overriding the default `<HeaderTitle />` in the layout file.
- This makes the app feel bespoke and closely aligned with the Lattice visual identity.

---

## 🧠 Miscellaneous Design Decisions

- **Types split into `.types.ts` files**: Helps avoid naming collisions with components.
- **Use of `@` aliases**: `@/components/...` improves readability vs relative paths.
- **Expo Router**: Pages are file-based, and route parameters (like config) are passed via params and parsed with `useLocalSearchParams`.

---

## 🔧 Setup

1. Clone the repo
2. Install deps:

```bash
npm install
```

3. Run the app:

```bash
npx expo start
```

---

## 🧪 Dev Notes

- Config schema lives in `index.tsx` via Zod
- Timer logic lives in `timer.tsx`
- `timer-progress.tsx` and `timer-timeline.tsx` handle visuals
- Haptics via `expo-haptics`

---

## 📌 Future Features

- Accessibility improvements
- Sound on transitions and exercise completion
- Saving sessions
- Dark mode toggle
- Different training templates

---

## 👨‍💻 Author

Made with love by **Sami**.
