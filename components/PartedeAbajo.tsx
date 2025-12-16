//Revisar por qué no se ejecuta la sombra en android
//aplicar en todas las secciones y que el 
// icono donde nos encontremos cambie segun la vista

import { View, Pressable, Text } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { Link, usePathname } from 'expo-router';

export const ParteDeAbajo = () => {

  const pathname = usePathname();

  return (

    
    <View>
      <View className="flex-row items-center justify-center gap-10 mb-[11%]">

        {/* HISTORY */}
        <Link href="/history" asChild>
          <Pressable>
            {({ pressed }) => {
              const active = pathname === "/history";

              return (
                <View
                  className={`
                    mb-1 rounded-xl 
                    ${pressed ? "bg-white/5 p-1" : ""}
                    ${active ? "bg-[#A855F7]/20 p-1" : ""}
                  `}
                >
                  <Ionicons
                    name="time-outline"
                    size={26}
                    color={active ? "#A855F7" : "#A0A0A0"}
                  />

                  <Text
                    className={`
                      mx-auto text-[12px] font-semibold
                      ${active ? "text-[#A855F7]" : "text-[#8e8ea0]"}
                    `}
                  >
                    Latest
                  </Text>
                </View>
              );
            }}
          </Pressable>
        </Link>

        {/* ABOUT — MISMA PALETA QUE HISTORY */}
        <Link href="/about" asChild>
          <Pressable>
            {({ pressed }) => {
              const active = pathname === "/about";

              return (
                <View
                  className={`
                    mb-1 rounded-xl
                    ${pressed ? "bg-white/5 p-1" : ""}
                    ${active ? "bg-[#A855F7]/20 p-1" : ""}
                  `}
                >
                  <Ionicons
                    name="add"
                    size={26}
                    color={active ? "#A855F7" : "#A0A0A0"}
                  />

                  <Text
                    className={`
                      mx-auto text-[12px] font-semibold
                      ${active ? "text-[#A855F7]" : "text-[#8e8ea0]"}
                    `}
                  >
                    New
                  </Text>
                </View>
              );
            }}
          </Pressable>
        </Link>

        {/* PERSON — MISMA PALETA QUE HISTORY */}
        <Link href="/person" asChild>
          <Pressable>
            {({ pressed }) => {
              const active = pathname === "/person";

              return (
                <View
                  className={`
                    mb-1 rounded-xl
                    ${pressed ? "bg-white/5 p-1" : ""}
                    ${active ? "bg-[#A855F7]/20 p-1" : ""}
                  `}
                >
                  <Ionicons
                    name="person-outline"
                    size={26}
                    color={active ? "#A855F7" : "#A0A0A0"}
                  />

                  <Text
                    className={`
                      mx-auto text-[12px] font-semibold
                      ${active ? "text-[#A855F7]" : "text-[#8e8ea0]"}
                    `}
                  >
                    Profile
                  </Text>
                </View>
              );
            }}
          </Pressable>
        </Link>

      </View>
    </View>
  )
}
