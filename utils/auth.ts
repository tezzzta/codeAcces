import { Platform } from "react-native";
const TOKEN_KEY = "access_token";

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export async function saveToken(token: string) {
  if (Platform.OS === "web") {
    if (isBrowser()) localStorage.setItem(TOKEN_KEY, token);
    return;
  }

  const AsyncStorage = await import("@react-native-async-storage/async-storage");
  await AsyncStorage.default.setItem(TOKEN_KEY, token);
}

export async function getToken() {
  if (Platform.OS === "web") {
    if (isBrowser()) return localStorage.getItem(TOKEN_KEY);
    return null; 
  }

  const AsyncStorage = await import("@react-native-async-storage/async-storage");
  return await AsyncStorage.default.getItem(TOKEN_KEY);
}

export async function deleteToken() {
  if (Platform.OS === "web") {
    if (isBrowser()) localStorage.removeItem(TOKEN_KEY);
    return;
  }

  const AsyncStorage = await import("@react-native-async-storage/async-storage");
  await AsyncStorage.default.removeItem(TOKEN_KEY);
}
