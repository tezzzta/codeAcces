import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {ParteDeAbajo} from '../components/PartedeAbajo'


type TipoBusqueda = "usuarios" | "invitados";
type CampoBusqueda =
  | "documento"
  | "nombre"
  | "apellido"
  | "celular"
  | "ubicacion";

export default function BuscarPersonas() {
  const [tipo, setTipo] = useState<TipoBusqueda>("usuarios");
  const [campo, setCampo] = useState<CampoBusqueda>("documento");
  const [valor, setValor] = useState("");

  const ejecutarBusqueda = () => {
    if (!valor.trim()) {
      alert("Ingresa un valor para buscar");
      return;
    }

    // 🔥 Aquí conectas con tu fetch
    console.log({
      tipo,
      campo,
      valor,
    });
  };

  return (
    <View className="h-full w-full bg-[#0B0A16]">
         <View
      className="
        bg-[#0B0A16]
        p-5
        rounded-2xl
        mx-[10%]
        my-6
        border
        border-white/10
      "
    >
      <Text className="text-white text-xl font-bold mb-4 text-center">
        Buscar personas
      </Text>

      {/* Tipo de persona */}
      <Text className="text-gray-300 mb-2 font-semibold">
        ¿Qué deseas buscar?
      </Text>

      <View className="flex-row gap-3 mb-4">
        {["usuarios", "invitados"].map((t) => (
          <Pressable
            key={t}
            onPress={() => setTipo(t as TipoBusqueda)}
            className={`
              flex-1
              py-3
              rounded-xl
              ${tipo === t ? "bg-indigo-600" : "bg-[#1A1A2E]"}
            `}
          >
            <Text className="text-white text-center font-semibold capitalize">
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Campo de búsqueda */}
      <Text className="text-gray-300 mb-2 font-semibold">
        Buscar por
      </Text>

      <View className="flex-row flex-wrap gap-2 mb-4">
        {[
          "documento",
          "nombre",
          "apellido",
          "celular",
          ...(tipo === "usuarios" ? ["ubicacion"] : []),
        ].map((c) => (
          <Pressable
            key={c}
            onPress={() => setCampo(c as CampoBusqueda)}
            className={`
              px-4
              py-2
              rounded-lg
              ${
                campo === c
                  ? "bg-purple-600"
                  : "bg-[#1A1A2E]"
              }
            `}
          >
            <Text className="text-white font-semibold capitalize">
              {c}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Input */}
      <Text className="text-gray-300 mb-2 font-semibold">
        Valor de búsqueda
      </Text>

      <TextInput
        value={valor}
        onChangeText={setValor}
        placeholder="Escribe aquí..."
        placeholderTextColor="#9CA3AF"
        className="
          bg-[#1A1A2E]
          text-white
          px-4
          py-3
          rounded-xl
          mb-6
        "
        keyboardType={
          campo === "documento" || campo === "celular"
            ? "numeric"
            : "default"
        }
      />

      {/* Botón buscar */}
      <Pressable onPress={ejecutarBusqueda}>
        {({ pressed }) => (
          <LinearGradient
            colors={
              pressed
                ? ["#383AE6", "#383AE6"]
                : ["#EA5818", "#D846EF", "#5346E6"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-2xl py-3 mx-auto px-9"
          >
            <Text className="text-white font-bold text-center text-lg">
              Buscar
            </Text>
          </LinearGradient>
        )}
      </Pressable>
    </View>
    {Platform.OS !== 'web' &&  <View><ParteDeAbajo/></View>}
    </View>
  );
}
