import { ConfigContext, ExpoConfig } from "@expo/config";

const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
  name: "promptable-react-native",
  slug: "promptable-react-native",
  scheme: "expo",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#1F104A",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "your.bundle.identifier",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#1F104A",
    },
  },
  extra: {
    eas: {
      projectId: "15dadfa1-690e-4e72-8c11-8d19965492ac",
    },
  },
  plugins: ["./expo-plugins/with-modify-gradle.js"],
});

export default defineConfig;
