import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function ResultadoPersona({ item }: { item: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View className="bg-[#1A1A2E] rounded-xl p-4 mb-3 border border-white/10">
      
      {/* HEADER */}
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row justify-between items-center"
      >
        <View>
          <Text className="text-white font-bold text-base">
            {item.nombre} {item.apellido}
          </Text>

          <Text className="text-gray-400 text-sm">
            Documento: {item.documento}
          </Text>
        </View>

        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={22}
          color="#9CA3AF"
        />
      </Pressable>

       {isExpanded && (
        <View className="mt-3">
          {item.celular && (
            <Text className="text-gray-300 text-sm">
              <Text className="font-bold">Celular:</Text> {item.celular}
            </Text>
          )}

          {item.ubicacion && (
            <Text className="text-gray-300 text-sm mt-1">
              <Text className="font-bold">Ubicación:</Text> {item.ubicacion}
            </Text>
          )}

          {item.activo !== undefined && (
            <Text className="text-gray-300 text-sm mt-1">
              Estado:{" "}
              <Text
                className={item.activo ? "text-green-500" : "text-red-500"}
              >
                {item.activo ? "Activo" : "Inactivo"}
              </Text>
            </Text>
          )}

          {/* INVITADOS (si existen) */}
          {item.invitados?.length > 0 && (
            <View className="mt-3">
              <Text className="text-gray-300 font-bold">
                Acompañantes:
              </Text>

              {item.invitados.map((inv: any, idx: number) => (
                <Text
                  key={idx}
                  className="text-gray-300 text-sm mt-1"
                >
                  • {inv.nombre} — DNI: {inv.documento}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
