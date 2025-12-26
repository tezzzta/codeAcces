import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ParteDeAbajo } from "../components/PartedeAbajo";
import { BottonToIndex } from "components/BotonToIndex";

type RolUsuario = "usuario" | "admin";

export default function usuarioCrear() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [celular, setCelular] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [rol, setRol] = useState<RolUsuario>("usuario");

  const crearUsuario = () => {
    if (
      !nombre ||
      !apellido ||
      !documento ||
      !celular ||
      !ubicacion
    ) {
      alert("Completa todos los campos");
      return;
    }

    // 🔥 Aquí va tu fetch
    console.log({
      nombre,
      apellido,
      documento,
      celular,
      ubicacion,
      rol,
    });
  };

  return (
    <View className="flex-1 bg-[#0B0A16]">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <BottonToIndex/>
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
            Crear usuario
          </Text>

          {/* Nombre */}
          <Text className="text-gray-300 mb-2 font-semibold">
            Nombre
          </Text>
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre"
            placeholderTextColor="#9CA3AF"
            className="bg-[#1A1A2E] text-white px-4 py-3 rounded-xl mb-4"
          />

          {/* Apellido */}
          <Text className="text-gray-300 mb-2 font-semibold">
            Apellido
          </Text>
          <TextInput
            value={apellido}
            onChangeText={setApellido}
            placeholder="Apellido"
            placeholderTextColor="#9CA3AF"
            className="bg-[#1A1A2E] text-white px-4 py-3 rounded-xl mb-4"
          />

          {/* Documento */}
          <Text className="text-gray-300 mb-2 font-semibold">
            Documento
          </Text>
          <TextInput
            value={documento}
            onChangeText={setDocumento}
            placeholder="Documento"
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
            className="bg-[#1A1A2E] text-white px-4 py-3 rounded-xl mb-4"
          />

          {/* Celular */}
          <Text className="text-gray-300 mb-2 font-semibold">
            Celular
          </Text>
          <TextInput
            value={celular}
            onChangeText={setCelular}
            placeholder="Celular"
            keyboardType="phone-pad"
            placeholderTextColor="#9CA3AF"
            className="bg-[#1A1A2E] text-white px-4 py-3 rounded-xl mb-4"
          />

          {/* Ubicación */}
          <Text className="text-gray-300 mb-2 font-semibold">
            Ubicación
          </Text>
          <TextInput
            value={ubicacion}
            onChangeText={setUbicacion}
            placeholder="Ubicación"
            placeholderTextColor="#9CA3AF"
            className="bg-[#1A1A2E] text-white px-4 py-3 rounded-xl mb-6"
          />

          {/* Rol */}
          <Text className="text-gray-300 mb-2 font-semibold">
            Rol del usuario
          </Text>
          <View className="flex-row gap-3 mb-6">
            {["usuario", "admin"].map((r) => (
              <Pressable
                key={r}
                onPress={() => setRol(r as RolUsuario)}
                className={`
                  flex-1
                  py-3
                  rounded-xl
                  ${
                    rol === r
                      ? "bg-purple-600"
                      : "bg-[#1A1A2E]"
                  }
                `}
              >
                <Text className="text-white text-center font-semibold capitalize">
                  {r}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Botón crear */}
          <Pressable onPress={crearUsuario}>
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
                  Crear usuario
                </Text>
              </LinearGradient>
            )}
          </Pressable>
        </View>
      </ScrollView>

      {/* Parte inferior fija */}
      {Platform.OS !== "web" && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            zIndex: 50,
            elevation: 20,
          }}
        >
            <LinearGradient
                          colors={['#fff', '#0B0A16']}
                          start={{ x: 0, y: 1 }}
                          end={{ x: 0, y: 0.6 }}
                          className="flex-row items-center px-8 py-3 mb-2"
                          style={{  opacity: 0.15}}
                          >
                          </LinearGradient>
          <ParteDeAbajo />
        </View>
      )}
    </View>
  );
}
