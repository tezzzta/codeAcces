import React, { useState } from "react";
import { View, Text, Pressable, FlatList, Platform } from "react-native";
import { useAccesosStore } from "store/state";
import type { Acceso } from "../store/type";



 // Esto es temporal: luego se conecta a la BD
 

export default function HistorialAccesos() {
  const accesos = useAccesosStore((state) => state.accesos)

  const [expanded, setExpanded] = useState<string | null>(null);

  const renderItem = ({ item }: { item: Acceso }) => {
    const isExpanded = expanded === String(item.id);

    return (
      <View className="bg-[#0a0814] p-4 rounded-xl mb-3 w-3/4 mx-auto">
        
        <Text className="text-white font-bold  text-2xl">{item.motivo}</Text>
        <Text className="text-gray-300 text-sm mt-1 font-semibold">{item.acceso}</Text>
        <Text className="text-gray-300 text-sm mt-1"> Expira: {item.credenciales.expiracion}</Text>
        <Text className="text-gray-300 text-sm mt-1" > QR:  <Text className="text-blue-600 underline">{item.credenciales.invitado_id}</Text></Text>
        <Text className="text-gray-300 text-sm mt-1"> Código: {item.credenciales.expiracion}</Text>
{/* 
        {Platform.OS === "web" ? (
          TENGO QUE REVISAR ESTA SECCION Y TRAER LA INFO DEL RESPONSABLE
          <Text className="text-gray-300 text-sm mt-1">
            Responsable: {item.id} - {item.credenciales.invitado_id}
          </Text>
        ) : (
          <Text className="text-gray-300 text-sm mt-1">
            Responsable: {item.credenciales.id}
          </Text>
        )} */}
        

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
            {/* <Text className="text-gray-300 text-sm">Contacto: {item.contacto}</Text>
            <Text className="text-gray-300 text-sm">Hora Apertura: {item.fecha}</Text>
            <Text className="text-gray-300 text-sm">Hora Cierre: {item.fecha}</Text>
            <Text className="text-gray-300 text-sm">Documento: {item.documento}</Text> */}

            <Text className="text-gray-300 text-sm">
              Estado:{" "}
              <Text className={item.activo === true ? "text-green-500" : "text-red-500"}>
                {item.activo ? "Activo" : "Inactivo"}
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
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#04020a]">
        <Text className="text-white mx-auto my-5 text-[24px] font-semibold"> Historial de accesos</Text>
      <FlatList
        data={accesos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}
