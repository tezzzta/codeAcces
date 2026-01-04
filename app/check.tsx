import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { API_URL } from "components/config";
import { LinearGradient } from "expo-linear-gradient";
import {ParteDeAbajo} from '../components/PartedeAbajo'
import {BottonToIndex} from "../components/BotonToIndex";
import { ResultadoPersona } from "../components/ResultadoPersona";
import * as storage from '../utils/auth';


type TipoBusqueda = "usuarios" | "invitados";
type CampoBusqueda =
  | "documento"
  | "nombre"
  | "apellido"
  | "contacto"
  | "ubicacion";

export default function BuscarPersonas() {
  const [tipo, setTipo] = useState<TipoBusqueda>("usuarios");
  const [campo, setCampo] = useState<CampoBusqueda>("documento");
  const [valor, setValor] = useState("");
  const [resultados, setResultados] = useState<any[]>([]);
 
  const ejecutarBusqueda = async () => {
  const token = await storage.getToken();

  if (!token) {
    Alert.alert("Error", "No hay token");
    return;
  }

  const result = await fetch(
    "https://backend-access.vercel.app/adi/users/check",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tipo, campo, valor }),
    }
  );

  const data = await result.json();
  setResultados(data.data || []);
};


  return (
    <View className="h-full w-full bg-[#0B0A16]">
         {Platform.OS !== 'web' && (
      <View className="pt-6 bg-zinc-900">
        <View className="px-4 pt-2 bg-zinc-950">
          <BottonToIndex />
        </View>
      </View>
    )}
 <ScrollView  
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}>
  
     <View
      className="
        bg-[#0B0A16]
        p-5
        rounded-2xl
        mx-[10%]
        md:mx-[20%]
        lg:mx-[25%]
        my-6
        border
        border-white/10
      "
    >
       <Text className="text-white text-xl font-bold mb-4 text-center">
        Buscar personas
      </Text>

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
          campo === "documento" || campo === "contacto"
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
            style={{borderRadius: 16}}
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

   <View className="mt-6 mx-[10%]
        md:mx-[20%]
        lg:mx-[25%]
        ">
        {resultados.length === 0 ? (
          <Text className="text-gray-400 text-center">
            No hay resultados
          </Text>
        ) : (
          resultados.map((item, index) => (
            <ResultadoPersona key={index} item={item} />
          ))
        )}
      </View>
 </ScrollView>

 {Platform.OS !== 'web' && (
    <View 
    className='bg-[#04020A]'
     style={{
      position: "absolute",
      bottom: 0,
      width: "100%",
      zIndex: 999,
      elevation: 20,  
    }}
    >
      <LinearGradient
        colors={['#fff', 'rgba(0,0,0,0)']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0.1 }}
        style={{  opacity: 0.15}}
        className="flex-row items-center px-8 py-2 mb-1"
      />
      <ParteDeAbajo />
    </View>
  )}
        </View>
  );
}
