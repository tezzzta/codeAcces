import React, { useState } from "react";
import { View, Text, Pressable, FlatList, Platform } from "react-native";
import { estadoAccesos } from "store/state";



 // Esto es temporal: luego se conecta a la BD
const historialData = [
  {
    id: "1",
    fecha: "2025-08-10",
    motivo: "Reunión",
    nombre: "Carlos Pérez",
    documento: "V-12345678",
    contacto: "+58 412 555 1234",
    horaApertura: "08:30 AM",
    horaCierre: "10:15 AM",
    estado: "accepted",
    acompanantes: [
      { nombre: "María López", documento: "V-87654321", contacto: "+58 414 555 9876" }
    ]
  },
  {
    id: "2",
    fecha: "2025-08-09",
    motivo: "Entrega",
    nombre: "Luis Fernández",
    documento: "V-22334455",
    contacto: "+58 424 555 4567",
    horaApertura: "02:00 PM",
    horaCierre: "02:30 PM",
    estado: "failed",
    acompanantes: []
  }
];

export default function HistorialAccesos() {
  const accesos = estadoAccesos((state) => state.accesos)

  const [expanded, setExpanded] = useState<string | null>(null);

  const renderItem = ({ item }: { item: typeof accesos[0] }) => {
    const isExpanded = expanded === item.id;

    return (
      <View className="bg-[#0a0814] p-4 rounded-xl mb-3">
        
        <Text className="text-white font-bold text-base">{item.fecha}</Text>
        <Text className="text-gray-300 text-sm mt-1">Motivo: {item.motivo_ingreso}</Text>
        {Platform.OS === "web" ? (
          <Text className="text-gray-300 text-sm mt-1">
            Responsable: {item.user_id} - {item.inv_documento}
          </Text>
        ) : (
          <Text className="text-gray-300 text-sm mt-1">
            Responsable: {item.inv_name}
          </Text>
        )}

        <Pressable
          onPress={() => setExpanded(isExpanded ? null : item.id)}
          className="bg-[#1a1a2e] py-2 px-3 rounded-lg mt-2 self-start"
        >
          <Text className="text-white font-bold">
            {isExpanded ? "Ver menos" : "Ver más"}
          </Text>
        </Pressable>

        {isExpanded && (
          <View className="mt-2">
            <Text className="text-gray-300 text-sm">Contacto: {item.contacto}</Text>
            <Text className="text-gray-300 text-sm">Hora Apertura: {item.fecha}</Text>
            <Text className="text-gray-300 text-sm">Hora Cierre: {item.salida}</Text>
            <Text className="text-gray-300 text-sm">Documento: {item.inv_documento}</Text>

            <Text className="text-gray-300 text-sm">
              Estado:{" "}
              <Text className={item.estado === true ? "text-green-500" : "text-red-500"}>
                {item.estado}
              </Text>
            </Text>

            {item.inv_name.length > 0 && (
              <View className="mt-2">
                <Text className="text-gray-300 font-bold">Acompañantes:</Text>
                {/* {item.inv_name.map((ac, index) => (
                  <View key={index} className="mt-1">
                    {Platform.OS === "web" ? (
                      <Text className="text-gray-300 text-sm">
                        {ac.nombre} - {ac.documento} - {ac.contacto}
                      </Text>
                    ) : (
                      <Text className="text-gray-300 text-sm">{ac.nombre} - {ac.documento} - {ac.contacto}</Text>
                    )}
                  </View>
                ))} */}
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
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}
