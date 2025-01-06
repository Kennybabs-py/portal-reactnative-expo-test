import { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

// Portal imports
import { BackupMethods, Portal, PortalContextProvider } from "@portal-hq/core";
import Keychain from "@portal-hq/keychain";
import Storage from "@portal-hq/gdrive-storage";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [portal, setPortal] = useState<Portal | null>(null);

  useEffect(() => {
    if (!portal) {
      // Initialize backup storage providers.
      const gDriveStorage = new Storage({
        androidClientId: "YOUR_ANDROID_CLIENT_ID",
        iosClientId: "YOUR_IOS_CLIENT_ID",
      });
      // const passwordStorage = new PasswordStorage();

      // Create a Portal instance
      setPortal(
        new Portal({
          autoApprove: true, // If you want to auto-approve transactions
          apiKey: "5be3535a-0c32-4b8f-bac9-5fc00fddde7e",
          backup: {
            [BackupMethods.GoogleDrive]: gDriveStorage,
            // [BackupMethods.Password]: passwordStorage,
          },
          chainId: 1,
          gatewayConfig: {
            "eip155:1": "https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY",
          },
        })
      );
    }
  }, [portal]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PortalContextProvider value={portal as Portal}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PortalContextProvider>
  );
}
