
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { estadoUsuario, estadoLogin } from '../store/state';

export default function Login() {
  const [documento, Setdocumento] = useState("");
  const [password, setPassword] = useState("");
  const setIsLoggedIn = estadoLogin((state) => state.setIsLoggedIn);
  const isLogin = estadoLogin((state) => state.isLoggedIn)
  const setUsuario = estadoUsuario((state) => state.setUsuario);
  const cambioDocumento = estadoUsuario((state) => state.cambioDocumento);
  const usuario = estadoUsuario((state)=> state.id)
  //extaremos el domcuento global
  const documento_glboal = estadoUsuario((state) => state.documento)



    const [logueado, setLogueado] = useState(false)

  //se me ocurre hacer un usestatepara cuando suceda 
  // y el login sea exitoso pues hacer el otro fetch
  const getApiData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documento, password })
      });
      const json = await response.json();
      if (json.message === 'Login exitoso') {
        cambioDocumento(Number(documento));
        

        setLogueado(true);
         alert("Logueado mi prro");

         
       } else {
        alert("Usuario o contraseña incorrecta");
      }
    } catch (err) {
      setLogueado(false);
      console.error(err);
    }
 
  };
             

useEffect(() => {
   if(logueado){
 
    setIsLoggedIn(true)

  }
}, [logueado]);
 

  ///
  //
  //
  //
  //
  //
  //
  return (
    <View className="flex-1 bg-[#04020a] justify-center px-6">
      <Text
        className={
          Platform.OS === "web"
            ? "text-[#F5F5F5] text-[38px] font-bold text-center mb-12"
            : "text-[#F5F5F5] text-[32px] font-bold text-center mb-12"
        }
      >
        Bienvenido
      </Text>

      <TextInput
        value={documento}
        onChangeText={Setdocumento}
        placeholder="Correo electrónico"
        placeholderTextColor="#9e9e9e"
        className={Platform.OS == 'web' ?"text-[#F5F5F5] bg-[#2a2a2a] rounded-xl px-4 py-3 mb-4 w-1/2 mx-auto":"text-[#F5F5F5] bg-[#2a2a2a] rounded-xl px-4 py-3 mb-4" }
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        placeholderTextColor="#9e9e9e"
        secureTextEntry
        className={Platform.OS == 'web' ? "text-[#F5F5F5] bg-[#2a2a2a] rounded-xl px-4 py-3 mb-8 w-1/2 mx-auto": "text-[#F5F5F5] bg-[#2a2a2a] rounded-xl px-4 py-3 mb-8"}
      />

      <Pressable onPress={getApiData}>
        {({ pressed }) => (
          <LinearGradient
            colors={
              pressed
                ? ["#3336e6", "#3336e6", "#3336e6"]
                : ["#ea5818", "#d846ef", "#5346e6"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className={Platform.OS == 'web' ? "rounded-2xl w-1/2 mx-auto": "rounded-2xl"}
            style={{ borderRadius: 24 }}
          >
            <Text className="text-white text-center py-4 font-semibold text-lg">
              Iniciar Sesión
            </Text>
          </LinearGradient>
        )}
      </Pressable>

      <Text className="text-[#F5F5F5] text-center mt-6">
        ¿No tienes cuenta?{" "}
        <Text className="text-[#6366e6] font-semibold">Contacta a tu administración</Text>
      </Text>
    </View>
  );
}
