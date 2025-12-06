import React, { useState } from "react";
import { 
  View, 
  Text, 
  Pressable, 
  FlatList, 
  Platform, 
  TouchableOpacity, 
  Modal, 
  Image 
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useAccesosStore, estadoUsuario } from "store/state";
import type { Acceso } from "../store/type";

import CustomDatePicker from "../components/DatePicker";
import { API_URL } from "../components/config";
import { ParteDeAbajo } from "../components/PartedeAbajo";
import { BottonToIndex } from "../components/BotonToIndex";

export default function HistorialAccesos() {

  // --- Estado general ---
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const user_id = estadoUsuario((state) => state.id);
  const accesos = useAccesosStore((state) => state.accesos);
  const setAccesos = useAccesosStore((state) => state.setAccesos);

  // --- Fetch de historial ---
  const threFetch = async () => {
    if (!selectedDate) {
      alert("papi, te falta la fecha");
      return;
    }

    try {
      const resultado = await fetch(
        "https://backend-access.vercel.app/api/access/allFilter",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user_id,
            fecha: selectedDate?.toISOString().split("T")[0],
          }),
        }
      );

      const json = await resultado.json();

      if (Array.isArray(json)) setAccesos(json);
      else if (json?.data) setAccesos(json.data);
    } catch (err) {}
  };

  // --- Componente de item ---
  const renderItem = ({ item }: { item: Acceso }) => {
    const isExpanded = expanded === String(item.id);

    return (
      <View className="
        bg-[#0B0A16] 
        p-5 
        rounded-2xl 
        mb-5 
        w-11/12 
        mx-auto
        shadow-lg 
        shadow-black/20 
        border 
        border-white/5
      ">
        <Text className="text-white font-bold text-xl">{item.motivo}</Text>

        <Text className="text-gray-300 text-sm mt-1 font-semibold">
          {item.acceso}
        </Text>

        <Text className="text-gray-300 text-sm mt-1">
          Expira: {item.credenciales?.expiracion ?? "Sin fecha"}
        </Text>

        {/* Botón QR */}
        <TouchableOpacity
          className="
            bg-indigo-600 
            px-4 
            py-2 
            rounded-lg 
            mt-3 
            w-[120px]
          "
          onPress={() => setVisible(true)}
        >
          <Text className="text-white text-center font-semibold">Mostrar QR</Text>
        </TouchableOpacity>

        <Text className="text-gray-300 text-sm mt-2">
          Código: {item.credenciales?.codigo}
        </Text>

        {/* Expander */}
        <Pressable
          className="
            bg-[#1A1A2E] 
            py-2 
            px-3 
            rounded-lg 
            mt-3 
            self-start
          "
          onPress={() =>
            setExpanded(isExpanded ? null : String(item.id))
          }
        >
          <Text className="text-white font-bold">
            {isExpanded ? "Ver menos" : "Ver más"}
          </Text>
        </Pressable>

        {/* Contenido expandido */}
        {isExpanded && (
          <View className="mt-3">

            <Text className="text-gray-300 text-sm">
              Estado:{" "}
              <Text
                className={
                  item.activo ? "text-green-500" : "text-red-500"
                }
              >
                {item.activo ? "Activo" : "Inactivo"}
              </Text>
            </Text>

            {item.credenciales?.invitados?.length > 0 &&
              item.credenciales.expiracion && (
                <View className="mt-3">
                  <Text className="text-gray-300 font-bold">
                    Acompañantes:
                  </Text>

                  {item.credenciales.invitados.map((ac, idx) => (
                    <View key={idx} className="mt-1">
                      <Text className="text-gray-300 text-sm leading-5">
                        <Text className="font-bold">Nombre:</Text> {ac.inv_name} -{" "}
                        <Text className="font-bold">DNI:</Text> {ac.documento} -{" "}
                        <Text className="font-bold">TEL:</Text> {ac.contacto}
                        {item.responsable_id === ac.id && (
                          <Text className="text-red-500 ml-2 font-semibold">
                            Responsable
                          </Text>
                        )}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
          </View>
        )}

        {/* Modal QR */}
        <Modal
          transparent
          animationType="fade"
          visible={visible}
          onRequestClose={() => setVisible(false)}
        >
          <View className="flex-1 bg-black/70 justify-center items-center px-6">
            <View className="bg-neutral-800 p-4 rounded-xl items-center border border-white/10">
              {item.credenciales?.qr_url ? (
                <Image
                  source={{ uri: item.credenciales.qr_url }}
                  style={{ width: 250, height: 250 }}
                  className="rounded-lg"
                />
              ) : (
                <Text className="text-white">No hay QR disponible</Text>
              )}
            </View>

            <TouchableOpacity
              className="bg-red-600 mt-10 px-6 py-3 rounded-xl"
              onPress={() => setVisible(false)}
            >
              <Text className="text-white font-bold">Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#04020A]">
         

       <View className="mt-10 mx-auto w-full">
        <View className=" px-4 ">
                  <BottonToIndex />

        </View>
       </View>

       <Text
        className="
          text-white 
          mx-auto 
          my-5 
          text-2xl
          font-semibold
          mt-20
        "
      >
        Historial de accesos
      </Text>

       {Platform.OS === "web" ? (
        <View className="gap-4 items-center mb-6">
          <Text className="text-white text-center font-semibold">
            Elige una fecha límite para obtener el historial
          </Text>

          <CustomDatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            mode="date"
          />

          <Pressable onPress={threFetch}>
            {({ pressed }) => (
              <LinearGradient
                colors={
                  pressed
                    ? ["#383AE6", "#383AE6"]
                    : ["#EA5818", "#D846EF", "#5346E6"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-2xl px-6 py-2"
              >
                <Text className="text-white font-semibold text-center">
                  Buscar
                </Text>
              </LinearGradient>
            )}
          </Pressable>
        </View>
      ) : (
        <View className="mb-6">
          <Text className="text-white text-center mb-2 font-semibold mt-10">
            Selected date: {selectedDate?.toLocaleDateString()}
          </Text>

          <CustomDatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            mode="date"
          />

        <View className="mx-auto mt-2"
        >
         <Pressable onPress={threFetch} className="p-2">
                    {({ pressed }) => (
                      <LinearGradient
                        colors={
                          pressed
                            ? ["#383AE6", "#383AE6"]
                            : ["#EA5818", "#D846EF", "#5346E6"]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="rounded-2xl px-6 py-3"
                        style={{ borderRadius: 10 }}
                      >
                        <Text className="text-white font-semibold text-center">
                          Buscar
                        </Text>
                      </LinearGradient>
                       )}
          </Pressable>
           </View>
        </View>
        
      )}

      <FlatList
        data={accesos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

       {Platform.OS !== "web" && (
        <View
          className="bg-[#04020A]"
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            zIndex: 999,
            elevation: 20,
          }}
        >
          <LinearGradient
            colors={["#fff", "rgba(0,0,0,0)"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0.2 }}
            className="flex-row items-center px-8 py-1"
          />

          <ParteDeAbajo />
        </View>
      )}
    </View>
  );
}
