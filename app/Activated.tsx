import React, { useState } from "react";
import { View, Text, Pressable, FlatList, Platform } from "react-native";
import { useAccesosStore } from '../store/state'
 import { Acceso} from '../store/type'

const usuariosActivosData = [
  {
    id: "1",
    nombre: "Carlos Pérez",
    documento: "V-12345678",
    contacto: "+58 412 555 1234",
    fecha: "2025-08-10",
    horaApertura: "08:30 AM",
    horaCierre: "10:15 AM",
    estado: "accepted",
    activo: true,
    acompanantes: [
      { nombre: "María López", documento: "V-87654321", contacto: "+58 414 555 9876" }
    ]
  },
  {
    id: "2",
    nombre: "Luis Fernández",
    documento: "V-22334455",
    contacto: "+58 424 555 4567",
    fecha: "2025-08-09",
    horaApertura: "02:00 PM",
    horaCierre: "02:30 PM",
    estado: "failed",
    activo: false,
    acompanantes: []
  }
];

export default function UsuariosActivos() {
  const accesoss = useAccesosStore((state) => state.accesos)
  const [expanded, setExpanded] = useState<string | " ">(" ");

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
      <FlatList
        data={accesoss}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}
