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
import { LinearGradient } from "expo-linear-gradient";
import { ParteDeAbajo } from "../components/PartedeAbajo";
import { BottonToIndex } from "components/BotonToIndex";


export default function usuarioCrear() {
  const [nombre, setNombre] = useState("");
   const [documento, setDocumento] = useState("");
  const [celular, setCelular] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [password, setPassword] = useState("");

  const crearUsuario = async () => {
    console.log("Iniciando creación de usuario");
  if (
    !nombre ||
    !documento ||
    !celular ||
    !ubicacion || 
    !password
  ) {
    alert("Completa todos los campos");
    return;
  }

  console.log("Creando usuario con datos:", {
    nickname: nombre,
    documento,
    contacto: celular,
    ubicacion,
    password
  });
  try {
    const fecha = new Date();
    const resultado = await fetch(
      "https://backend-access.vercel.app/adi/users",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: nombre,
          documento,
          contacto: celular,
          fechaCreacion: fecha,
          ubicacion,
          password
        }),
      }
    );

    const datos = await resultado.json();
    if(!datos){
      Alert.alert("Error al crear usuario");
    return;
    }
    Alert.alert("Usuario creado con éxito");
    console.log("Respuesta backend:", datos);
  } catch (error) {
    console.error("Error creando usuario:", error);
    Alert.alert("Error al crear usuario");
  }
};


  return (
    <View className="flex-1 bg-[#0B0A16]">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        
        {Platform.OS !== 'web' && (
              <View className="pt-6 bg-zinc-900">
                <View className="px-4 pt-2 bg-zinc-950">
                  <BottonToIndex />
                </View>
              </View>
            )}        
            
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
            Nombre y apellidos
          </Text>
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre completo"
            placeholderTextColor="#9CA3AF"
            className="bg-[#1A1A2E] text-white px-4 py-3 rounded-xl mb-4"
          />

          {/* Apellido */}
          {/* <Text className="text-gray-300 mb-2 font-semibold">
            Apellido
          </Text>
          <TextInput
            value={apellido}
            onChangeText={setApellido}
            placeholder="Apellido"
            placeholderTextColor="#9CA3AF"
            className="bg-[#1A1A2E] text-white px-4 py-3 rounded-xl mb-4"
          /> */}

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
        <Text className="text-gray-300 mb-2 font-semibold">
            Password
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry   //ACA VEREMOS PA QUE FUNCIONA
            className="bg-[#1A1A2E] text-white px-4 py-3 rounded-xl mb-6"
          />
         

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
                style={{ borderRadius: 14 }}
              >
                <Text className="text-white font-bold text-center text-lg">
                  Crear usuario
                </Text>
              </LinearGradient>
            )}
          </Pressable>
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
