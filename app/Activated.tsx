import React, { useState } from "react";
import { View, Text, Pressable, FlatList, Platform } from "react-native";
import { useAccesosStore, estadoUsuario } from '../store/state'
 import { Acceso} from '../store/type'
import {API_URL} from '../components/config'
import { LinearGradient } from "expo-linear-gradient";
import RNPickerSelect from 'react-native-picker-select';
import { useRouter } from "expo-router";

export default function UsuariosActivos() {
  const accesoss = useAccesosStore((state) => state.accesos)
  const [expanded, setExpanded] = useState<string | " ">(" ");
 
  const [selectedValue, setSelectedValue] = useState(null);

  //estos son las constantes y estados para el fecth y traer los users activos

    const user_id = estadoUsuario((state) => state.id)
    const[activo, setActivo] = useState(true)
     const setAccesos = useAccesosStore((state) => state.setAccesos)

   const router = useRouter();

      //
      //
     //con este haremos fetch 
    const threFetch = async() => {
         console.log("PRRRRRR",user_id)
    
        try{
          // const resultado = await fetch(`${API_URL}/api/access/allByUser`, {
    
         const resultado = await fetch('https://backend-access.vercel.app/api/access/allByUser',{
            method: "POST",
            credentials: "include",
            headers: {"Content-type": "application/json"},
            body:JSON.stringify({
              user_id: user_id,
              state: activo
            })
          }
        );
        const json = await resultado.json()
    
        if(Array.isArray(json)){
          setAccesos(json)
          console.log("Accesos cargados:", json);
        } 
        
        //NOTA, DEBO BORRAR TODOS LOS CONSOLE. 
        else if (json?.data) {
        setAccesos(json.data);
        console.log("Accesos cargados (con data):", json.data);
        } else {
        console.log("Respuesta sin datos reconocidos");
        } 
      }catch(err){
           console.log("error mi negro")
            console.error("Error en threFetch:", err);    
      }
     }
    
 let cambio;
if (activo) {
  cambio = "Accesos Exitosos";
} else {
  cambio = "Inactivo";
}

  const renderItem = ({ item }: { item: Acceso }) => {
    const isExpanded = expanded === String(item.id);

  
    return (
      <View className="bg-[#0a0814] p-4 rounded-xl mb-3">
        
        <View className="flex-row justify-between items-center">
          <Text className="text-white font-bold text-base">{item.motivo}</Text>


         
            
                   {item.acceso_exitoso === true?( 
                <View
                className="px-2 py-1 rounded-full bg-green-500/20"
                >
              <Text className="text-green-400">
                Activo
              </Text>
            </View>
              ):(
              <View
                className="px-2 py-1 rounded-full bg-red-500/20"
                > <Text className="text-red-400">
                Failed
              </Text>
              </View>
                 )}
    
        </View>
        {Platform.OS === "web" ? (
           item.credenciales.invitados.map((ac, index)=>(
            <View>
              {ac.id == item.responsable_id ?(
           <View>
            <Text className="text-white font-bold text-base">{ac.inv_name} {ac.inv_lastname}</Text>
            <Text className="text-gray-300 text-sm mt-1">
              Documento: {ac.documento}
            </Text>
            </View>):(null)}
            </View>
           ))
        )
        //tengo que revisar esto porque no deberia ser null
        : null}

        <Pressable
          onPress={() => setExpanded(isExpanded ? " " : String(item.id))}
          className="bg-[#1a1a2e] py-2 px-3 rounded-lg mt-2 self-start"
        >
          <Text className="text-white font-bold">
            {isExpanded ? "Ver menos" : "Ver más"}
          </Text>
        </Pressable>

        {isExpanded && (
          <View className="mt-2">
            <Text className="text-gray-300 text-sm">Fecha: {item.credenciales.expiracion}</Text>
            <Text className="text-gray-300 text-sm">Contacto: {item.acceso}</Text>


            <Text className="text-gray-300 text-sm">
              Estado:{" "}
              <Text className={item.acceso_exitoso === true ? "text-green-500" : "text-red-500"}>
                {item.acceso.toUpperCase()}
              </Text>
            </Text>

            {item.credenciales.invitados.length > 0 && (
              <View className="mt-2">
                <Text className="text-gray-300 font-bold">Acompañantes:</Text>
                {item.credenciales.invitados.map((ac, index) => (
                  <View key={index} className="mt-1">
                    {Platform.OS === "web" ? (
                      <Text className="text-gray-300 text-sm">
                         <Text className="font-bold">Nombre: </Text> {ac.inv_name} - <Text className="font-bold">DNI:</Text> {ac.documento} - <Text className="font-bold">TEL:</Text> {ac.contacto}
                      </Text>
                    ) : (
                      <Text className="text-gray-300 text-sm">{ac.inv_name}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#04020a]">
      <Text className="text-white mx-auto my-5 text-[24px] font-semibold">
        Usuarios Activos
      </Text>

       <View className="gap-4">
  
      <Text className="text-white mx-auto font-semibold"> Busca accesos exitosos y fallidos del último mes</Text>

          {/*  */}
          {/*  */}
          {/* Haremos un seleccionable, entre active e inactive */}
        <View className="w-40 mx-auto ">
            <RNPickerSelect
              onValueChange={(value) => {
                //EN ESTOS MISMOS IF, CREO QUE PUEDO HACER FETCH
           
                if(value=== 'js'){
                 setSelectedValue(value)
                 setActivo(true)
                       }
                if(value==='py'){
                setSelectedValue(value)
                  setActivo(false)
              }
              }}
              items={[
                { label: 'Accesos Exitosos', value: 'js' },
                { label: 'Accesos Fallidos', value: 'py' },

              ]}
              placeholder={{ label:  cambio.toString(), value: " " }}
              style={{
                inputIOS: {
                  color: 
                  selectedValue ==="js"
                  ? "#4CAF50"
                  : selectedValue === "py"
                  ? "#ff2c2c"
                  : "#F5F5F5",
                  padding: 12,
                  backgroundColor: '#2a2a2a',
                  borderRadius: 10,
                  fontSize: 16,
                },
                inputAndroid: {
                  color: 
                  selectedValue ==="js"
                  ? "#4CAF50"
                  : selectedValue === "py"
                  ? "#ff2c2c"
                  : "#F5F5F5",
                      height: 50,
                  padding: 12,
                  backgroundColor: '#2a2a2a',
                  borderRadius: 20,
                  fontSize: 16,
                },
                inputWeb: {
                  color: 
                  selectedValue ==="js"
                  ? "#4CAF50"
                  : selectedValue === "py"
                  ? "#ff2c2c"
                  : "#F5F5F5",
                  padding: 12,
                  backgroundColor: '#2a2a2a',
                  borderRadius: 10,
                  width: '100%',
                  fontWeight: "bold"
                },
                viewContainer: {
                  width: '100%',
                },
                iconContainer: {
                  top: 16,
                  right: 10,
                },
              }}
            />

          </View>
                  <Pressable onPress={threFetch}>
        {({pressed}) => 
        <LinearGradient
        colors={pressed
                ?["#3336e6", "#3336e6", "#3336e6"]
                : ["#ea5818", "#d846ef", "#5346e6"]
              }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className={Platform.OS == 'web' ? "rounded-2xl w-[100px] mx-auto": "rounded-2xl"}
        >
          <Text className="text-white font-semibold mx-auto my-2"> Buscar</Text>
          </LinearGradient>}
      </Pressable>
       </View>
      <FlatList
        data={accesoss}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}
