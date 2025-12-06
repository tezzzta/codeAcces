import { View, Text, Pressable, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { Link, useRouter } from 'expo-router';
 import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { estadoUsuario, estadoLogin, useAccesosStore} from "../store/state"
import {API_URL} from '../components/config'

import {ParteDeAbajo} from '../components/PartedeAbajo'

 export default function Index() {
   const user_id = estadoUsuario((state)=> state.id)
  
   const nombre = estadoUsuario((state)=> state.nickname)
  const documento = estadoUsuario((state)=>state.documento)
  const isLogin = estadoLogin((state) => state.isLoggedIn)
  const setUsuario =  estadoUsuario((state) => state.setUsuario)

 
  

  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState(" ");


const accesos = useAccesosStore((state)=> state.accesos)
const setAccesos = useAccesosStore((state)=> state.setAccesos)

//
///
///
///
///
//
//
//
   //En este apartado haremos las funciones para hacer fetch y obenter los datos de las otras vistas
 
  const threFetch = async() => {
 
    try{
      // const resultado = await fetch(`${API_URL}/api/access/allByUser`, {

     const resultado = await fetch('https://backend-access.vercel.app/api/access/allByUser',{
        method: "POST",
        credentials: "include",
        headers: {"Content-type": "application/json"},
        body:JSON.stringify({
          user_id: user_id,
          state: true
        })
      }
    );
    const json = await resultado.json()

    if(Array.isArray(json)){
      setAccesos(json)
     } 
    
    //NOTA, DEBO BORRAR TODOS LOS CONSOLE. 
    else if (json?.data) {
    setAccesos(json.data);
     } else {
     } 
  }catch(err){
    }
 }
  ////
  ///
  //
  //
  //
  //
//
//
//

  return (
    <View className="flex-1 bg-[#04020a]"
    
    >
      <View className="flex items-center justify-center px-4 mt-10"
      >
        <Text
          className={
            Platform.OS === 'web'
              ? 'text-[#F5F5F5] text-[42px] font-semibold text-center mt-[8%]'
              : 'text-[#F5F5F5] text-[42px] font-semibold text-center mt-10'
          }
        >
          Welcome back, {nombre}
        </Text>
      </View>


    {/* aca es la parte del medio que refactorizaremos */}
      <View className= {Platform.OS ==='web'? "flex-1 items-center justify-center px-4 mb-10":"flex-1 items-center justify-center px-4"} 
      >
 
    <View
      className={
        Platform.OS === 'web'
          ? "grid grid-cols-2 gap-4 w-full px-[10%] lg:px-[25%]"
          : "flex flex-row flex-wrap justify-center gap-4"
      }

      
    >

      

      {/* Historial de Accesos */}
      <Pressable
        onPress={() => router.push('/history')}
        className="flex-1 min-w-[30%]"
      >
        {({ pressed }) => (
          <LinearGradient
            colors={
              pressed
                ? ['#dd3500', '#dd3500', '#dd3500']
                : ['#6366e6', '#6366e6', '#6366e6']
            }
            style={{borderRadius: 16}}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-2xl p-4"
          >
         <Ionicons name="time" size={38} color={pressed ? "#E3E3E3" : "#E3E3E3"} 
          style={{ marginBottom: 1, backgroundColor: pressed ? "#dd3500" : "transparent", padding: 6, borderRadius: 50, margin: 'auto' }}
            />             

            <Text className="text-white font-semibold text-center">
              Historial de Accesos
            </Text>
          </LinearGradient>
        )}
      </Pressable>

      {/* Visitantes Activos */}
      <Pressable
        onPress={() => {
          router.push('/Activated');
          if (user_id) {
            threFetch();
          }
        }}
        className="flex-1 min-w-[30%]"
      >
        {({ pressed }) => (
          <LinearGradient
            colors={
              pressed
                ? ['#dd3500', '#dd3500', '#dd3500']
                : ['#6366e6', '#6366e6', '#6366e6']
            }
            style={{borderRadius: 16}}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-2xl p-4"
          >
         <Ionicons name="checkmark" size={38} color={pressed ? "#E3E3E3" : "#E3E3E3"} 
          style={{ marginBottom: 1, backgroundColor: pressed ? "#dd3500" : "transparent", padding: 6, borderRadius: 50, margin: 'auto' }}
            />
            <Text className="text-white font-semibold text-center">
              Visitantes Activos
            </Text>
          </LinearGradient>
        )}
      </Pressable>

          {/* este sera para profile */}
      <Pressable
        onPress={() => {
          router.push('/person');
          if (user_id) {
            threFetch();
          }
        }}
        className="flex-1 min-w-[30%]"
      >
        {({ pressed }) => (
          <LinearGradient
            colors={
              pressed
                ? ['#dd3500', '#dd3500', '#dd3500']
                : ['#6366e6', '#6366e6', '#6366e6']
            }
            style={{borderRadius: 16}}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-2xl p-4"
          >
         <Ionicons name="person" size={38} color={pressed ? "#E3E3E3" : "#E3E3E3"} 
          style={{ marginBottom: 1, backgroundColor: pressed ? "#dd3500" : "transparent", padding: 6, borderRadius: 50, margin: 'auto' }}
            />            
            <Text className="text-white font-semibold text-center">
              Perfil
            </Text>
          </LinearGradient>

          
        )}
      </Pressable>
 {/* Nuevo Acceso */}
      <Pressable
        onPress={() => router.push('/about')}
        className="flex-1 min-w-[30%]"
      >
        {({ pressed }) => (
          <LinearGradient
            colors={
              pressed
                ? ['#dd3500', '#dd3500', '#dd3500']
                : ['#6366e6', '#6366e6', '#6366e6']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-2xl p-4"
            style={{borderRadius: 16}}
          >
            <Ionicons name="add" size={38} color={pressed ? "#E3E3E3" : "#E3E3E3"} 
                  style={{ marginBottom: 1, backgroundColor: pressed ? "#dd3500" : "transparent", padding: 6, borderRadius: 50, margin: 'auto' }}
                  />             
            <Text className="text-white font-semibold text-center">
              Nuevo Acceso
            </Text>
          </LinearGradient>
        )}
      </Pressable>
    </View>
 </View>


         

 {/* Parte de abajo xd  */}
        {Platform.OS !== 'web' &&  
        <View >
          <LinearGradient
              colors={['#fff', '#04020a']}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0.3 }}
              className="flex-row items-center px-8 py-3 mb-1"
              style={{  opacity: 0.15}}
              >
              </LinearGradient>      
           <ParteDeAbajo />

          </View>
          }

    </View>
  );
}
