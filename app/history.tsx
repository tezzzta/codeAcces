import React, { useState, ComponentType, useEffect, useRef } from "react";
import { View, Text, Pressable, FlatList, Platform, TouchableOpacity, Modal, Image, StyleSheet, Button } from "react-native";
import { useAccesosStore, estadoUsuario } from "store/state";
import type { Acceso } from "../store/type";
import {API_URL} from '../components/config'
import {LinearGradient} from 'expo-linear-gradient'
//de la libreria de un user de reddit
import CustomDatePicker from '../components/DatePicker'

export default function HistorialAccesos() {
  const threFetch = async() => {
      if(!selectedDate){
      alert("papi, te falta la fecha")
        return;
     }
    try{
      // const resultado = await fetch(`${API_URL}/api/access/allFilter`, {

     const resultado = await fetch('https://backend-access.vercel.app/api/access/allFilter',{
        method: "POST",
        credentials: "include",
        headers: {"Content-type": "application/json"},
        body:JSON.stringify({
          user_id: user_id,
          fecha: selectedDate?.toISOString().split("T")[0]

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


  //Estos son para la opcion de fechas
    const [selectedDate, setSelectedDate] = useState<Date | null >(null);
    	// const datePicker = useRef<DatePickerHandle>(null);

      //user id traido del estado
   const user_id = estadoUsuario((state)=> state.id)

    //
    const [visible, setVisible] = useState(false);

     // array para renderizar los accesos
  const accesos = useAccesosStore((state) => state.accesos)

  const [expanded, setExpanded] = useState<string | null>(null);
  const setAccesos = useAccesosStore((state)=> state.setAccesos)

  const renderItem = ({ item }: { item: Acceso }) => {
    const isExpanded = expanded === String(item.id);

     
     
    return (
      <View className="bg-[#0a0814] p-4 rounded-xl mb-3 w-3/4 mx-auto">
        

        <Text className="text-white font-bold  text-2xl">{item.motivo}</Text>
        <Text className="text-gray-300 text-sm mt-1 font-semibold">{item.acceso}</Text>
        <Text className="text-gray-300 text-sm mt-1">
          Expira: {item.credenciales?.expiracion ?? "Sin fecha"}
        </Text>
      
      {Platform.OS === "web"? 
        
      (<TouchableOpacity className="bg-[#4F46E5] w-[100px] py-1 px-2 rounded-md my-1" onPress={() => setVisible(true)}>
        <Text className="text-[#fff]">Mostrar QR</Text>
      </TouchableOpacity>):
      (<TouchableOpacity className="bg-[#4F46E5] w-[100px] rounded-md my-1" onPress={() => setVisible(true)}>
        <Text className="text-[#fff]">Mostrar QR</Text>
      </TouchableOpacity>)
      }
      
              <Text className="text-gray-300 text-sm mt-1"> Código: {item.credenciales?.codigo}</Text>

        
        <Pressable
          onPress={() => setExpanded(isExpanded ? null : String(item.id))}
          className="bg-[#1a1a2e] py-2 px-3 rounded-lg mt-2 self-start"
        >
          <Text className="text-white font-bold">
            {isExpanded ? "Ver menos" : "Ver más"}
          </Text>
        </Pressable>


          {/* acá lo que saldrá al abrir */}
        {isExpanded && (
          <View className="mt-2">
     

            <Text className="text-gray-300 text-sm">
              Estado:{" "}
              <Text className={item.activo === true ? "text-green-500" : "text-red-500"}>
                {item.activo ? "Activo" : "Inactivo"}
              </Text>
            </Text>

            {item.credenciales?.invitados?.length > 0 && item.credenciales?.expiracion != null && (
            <View className="mt-2">
                  <Text className="text-gray-300 font-bold">Acompañantes:</Text>

                  {item.credenciales.invitados.map((ac, index) => (
                    <View key={index} className="mt-1">
                      {Platform.OS === "web" ? (
                        <Text className="text-gray-300 text-sm">
                         <Text className="font-bold">Nombre: </Text> {ac.inv_name} - <Text className="font-bold">DNI:</Text> {ac.documento} - <Text className="font-bold">TEL:</Text> {ac.contacto}
                         {item.responsable_id === ac.id? (<Text className="text-red-600 bg-[#0a0814] font-semibold mx-2"> Responsable </Text>):( <></>)}

                        </Text>
                      ) : (
                        <Text className="text-gray-300 text-sm">
                         <Text className="font-bold">Nombre: </Text> {ac.inv_name} - <Text className="font-bold">DNI:</Text> {ac.documento} - <Text className="font-bold">TEL:</Text> {ac.contacto} 
                        </Text>
                        )}
                    </View>
                  ))}
                </View>
              )}
          </View>
        )}



         <Modal
        transparent={true}
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)} // para cerrar en Android con botón atrás
        
      >

        <View className= "flex-1 w-full bg-[#000000B3] justify-center items-center ">
          <View className="bg-gray-400 items-center rounded-lg p-2">
         {item.credenciales?.qr_url ? (
            <Image
              source={{ uri: item.credenciales.qr_url }}
              style={{ width: 250, height: 250 }}
              className="rounded-lg"
            />
          ) : (
            <Text>No hay código QR disponible</Text>
          )}

           
          </View>
         <TouchableOpacity className="bg-[#ef4444] mt-20 py-2 px-3 rounded-md" onPress={() => setVisible(false)}>
              <Text className="text-white font-bold">Cerrar</Text>
            </TouchableOpacity>
        </View>
      </Modal>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#04020a]">
        <Text className={Platform.OS === 'web'?"text-white mx-auto my-5 text-[24px] font-semibold":"text-white mx-auto my-5 mt-[25%] text-[24px] font-semibold"}>
           Historial de accesos
        </Text>



      {/*  */}
      {/*  */}
      {/*  */}
       {Platform.OS === 'web' ? (

    <View>
          
			<View className="gap-4">
		<Text className="text-white font-semibold mx-auto"> Elige una fecha límite para obtener el historial de accesos</Text>
					<CustomDatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            mode="date"
        />

        <Pressable onPress={threFetch}>
        {({pressed}) => (
          <LinearGradient colors={
                        pressed
                          ? ["#3336e6", "#3336e6", "#3336e6"]
                          : ["#ea5818", "#d846ef", "#5346e6"]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className={Platform.OS == 'web' ? "rounded-2xl   mx-auto  w-[100px]": "rounded-2xl mt-2"}
                      style={{ borderRadius: 24 }}
          >
          <Text className="text-white mx-auto my-2"> Buscar </Text>


          </LinearGradient>
        ) }

        </Pressable>
 			</View>
    </View>
      ):(
    <View>

      {/* este es el de la aplicacion android */}
                <Text className="text-white mx-auto mb-2 font-semibold mt-10"> Selected date: {selectedDate?.toLocaleDateString()}</Text>

			
				<CustomDatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            mode="date"
        />
			</View>
)}
 

      <FlatList
        data={accesos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}
