import { View, Text, Pressable, Linking } from "react-native";

export default function Footer() {
  return (
    <View className="w-full bg-neutral-900 py-6 px-6 items-center border-t border-neutral-700">
      
       <Text className="text-neutral-300 text-base mb-3">
        © {new Date().getFullYear()} Code Access — Todos los derechos reservados
      </Text>

       <View className="flex-row space-x-6">
        <Pressable onPress={() => Linking.openURL("https://example.com/terminos")}>
          <Text className="text-neutral-400 hover:text-purple-400">
            Términos
          </Text>
        </Pressable>

        <Pressable onPress={() => Linking.openURL("https://example.com/privacidad")}>
          <Text className="text-neutral-400 hover:text-purple-400">
            Privacidad
          </Text>
        </Pressable>

        <Pressable onPress={() => Linking.openURL("mailto:contacto@example.com")}>
          <Text className="text-neutral-400 hover:text-purple-400">
            Contacto
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
