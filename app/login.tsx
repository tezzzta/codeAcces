
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Platform, Modal, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { estadoUsuario, estadoLogin } from '../store/state';
import {isAdminStore} from '../store/Admin'
// import {API_URL} from '../components/config'
import * as storage from '../utils/auth';

function ElLogin() {

  //Para guardar el admin mientras

  const admin = isAdminStore((state) => state.isAdmin)
  const setIsAdmin = isAdminStore((state) => state.setIsAdmin)

  const save =  storage.saveToken;
  const get   =  storage.getToken;
  const del   =  storage.deleteToken;

  const [loadingLogin, setLoadingLogin] = useState(false);

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
  
  const getApiData = async () => {
    try {
      // const response = await fetch(`${API_URL}/api/login`, {
      //Acá podemos cambiar para pruebas y ya despliegue
      setLoadingLogin(true)

      const response = await fetch("https://backend-access.vercel.app/apii/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documento, password })
      });

      const json = await response.json();
      

      if(json.message === 'Login exitoso') {
                setIsAdmin(json.admini)
        cambioDocumento(Number(documento));
        

        setLogueado(true);
        setLoadingLogin(false)
        save(json.token)

        console.log("Token guardado:", json.token);

       } else {
        alert("Usuario o contraseña incorrecta");
               setLoadingLogin(false)

      }
    } catch (err) {
      setLogueado(false);
      setLoadingLogin(false)
     }
  };
             

useEffect(() => {
   if(logueado){
 
    setIsLoggedIn(true)
   }
}, [logueado]);
 

  
  return (
    <View className={Platform.OS == 'web' ? "flex-1 bg-[#04020a] justify-center px-6": "flex-1 justify-center px-6"}>
      <Modal animationType="fade" transparent visible={loadingLogin}>
        <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.6)]">
          <View className="bg-[#1A1A1A] px-8 py-6 rounded-2xl items-center">
            <ActivityIndicator size="large" color="#8b5cf6" />
            <Text className="text-white mt-4 text-lg font-semibold">
              Iniciando sesión...
            </Text>
          </View>
        </View>
      </Modal>
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
        placeholder="ID de la cuenta"
        placeholderTextColor="#9e9e9e"
        className={Platform.OS == 'web' ?"text-[#F5F5F5] bg-[#2a2a2a] rounded-xl px-4 py-3 mb-4 w-3/4 mx-auto md:w-1/2":"text-[#F5F5F5] bg-[#2a2a2a] rounded-xl px-4 py-3 mb-4" }
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        placeholderTextColor="#9e9e9e"
        secureTextEntry
        className={Platform.OS == 'web' ? "text-[#F5F5F5] bg-[#2a2a2a] rounded-xl px-4 py-3 mb-8 w-3/4 mx-auto md:w-1/2": "text-[#F5F5F5] bg-[#2a2a2a] rounded-xl px-4 py-3 mb-8"}
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
            className={Platform.OS == 'web' ? "rounded-2xl w-3/4 mx-auto md:w-1/2": "rounded-2xl"}
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



export default function Login() {
  return (
    <View style={{ flex: 1, backgroundColor: '#04020a' }}>
      {Platform.OS === 'web' ? (
        <View
          style={{
            flex: 1,
            paddingHorizontal: '15%',
          }}
        >
          <ElLogin />
        </View>
      ) : (
        <LinearGradient
          colors={["#04020a", "#04020a", "#23074d", "#04020a", "#04020a"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flex: 1,
            paddingVertical: 20,
            paddingHorizontal: 10,
            width: "100%",
            alignSelf: "center",
            minHeight: 300,
          }}
        >
          <ElLogin />
        </LinearGradient>
      )}
      
    </View>
  );
}

