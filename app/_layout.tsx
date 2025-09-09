import { Stack } from 'expo-router';
import '../global.css';
import { estadoLogin } from 'store/state';

export default function Layout() {
  const loggIn = estadoLogin((state) => state.isLoggedIn);

  return (
    <Stack>
      <Stack.Protected guard={loggIn}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!loggIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}