import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  Image
} from "react-native";
import type { Credencial } from "../store/type";
import * as storage from '../utils/auth';
import {estadoUsuario} from '../store/state'
import { LinearGradient } from "expo-linear-gradient";
import { CameraView, Camera } from "expo-camera";
import { ParteDeAbajo } from "../components/PartedeAbajo";
import {BottonToIndex} from "../components/BotonToIndex";

export default function EscanearQR() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [codigoManual, setCodigoManual] = useState(false);
  const [qrData, setQrData] = useState<string>("");
  const [loadingLogin, setLoadingLogin] = useState(false);

  const user_id = estadoUsuario((state) => state.id);
  type RegAcceso = {
    id: number;
    motivo: string;
    acceso: string;
    activo: boolean;
    responsable_id: number;
  }

  type TipadoCredencial = Credencial & {
    // backend returns an array of access records
    registro_accesos?: RegAcceso[];
  }

  // EN CONSTRUCCIÓN
  const [accesoParcial, setAccesoParcial] = useState<TipadoCredencial | null>(null);
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
 
    })();
        // console.log("Validemosss",accesoParcial);

  }, []);

  const fetchValidacion = async (code?: string) => {
  const token = await storage.getToken();
  const qr = code ?? qrData;
  if (qr === "") return;
  setLoadingLogin(true);
  try {
    // console.log("Enviando fetch con qrData", qr, "***");
    const resultado = await fetch('https://backend-access.vercel.app/adi/access/find', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 
                Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ qr_code: qr })
    });
      setLoadingLogin(false);

    const json = (await resultado.json()) as TipadoCredencial;
     setAccesoParcial(json)
   } catch (err) {
    // console.error('Fetch error:', err);
    Alert.alert('Error', 'No se pudo validar el acceso');
  }
  setLoadingLogin(false);
};


  const changeAdmin = async () => {
  console.log("Validando acceso...");
  const access_id = accesoParcial?.registro_accesos?.[0]?.id;

  if (!access_id) {
    Alert.alert("Error", "No se encontró un registro de acceso para validar");
    return;
  }
  if (!user_id) {
    Alert.alert("Error", "Usuario no identificado");
    return;
  }
  const token = await storage.getToken();

  try {
    const response = await fetch(
      "https://backend-access.vercel.app/adi/access/confirm",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
         },
        body: JSON.stringify({ user_id: user_id, access_id: access_id }),
      }
    );

    const json = await response.json();
    console.log("Response text:", json);
     
    // console.log("Body:", json.access.message, "YYYY", json.message);

    if (!response.ok) {
       if (json.details === "La credencial está expirada") {
      Alert.alert("Error", "La credencial expiró");
      return;
    }
      Alert.alert("Error", json.message || `Error del servidor (${response.status})`);
      return;
    }

    if (json.access.message === "Este acceso ya fue validado") {
      Alert.alert("Atención", "Este acceso ya fue validado");
      return;
    }
    Alert.alert("Éxito", "Acceso validado correctamente");
  } catch (error) {
    console.error("Fetch error:", error);
    Alert.alert("Error", "No se pudo validar el acceso");
  }
};
  
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;

    setScanned(true);
    setQrData(data);
    
    if(data !== null && data !== undefined){
          fetchValidacion(data);
    }
    // console.log("QR escaneado:", data);
    //aca necesito hacer un fetch con el código para enviar la solicitud de acceso exitoso al backend 
  };

  if (hasPermission === null) {
    return (
      <View className="flex-1 bg-[#0B0A16] items-center justify-center">
        <Text className="text-white">Solicitando permiso de cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 bg-[#0B0A16] items-center justify-center px-6">
        <Text className="text-white text-center mb-4">
          No se pudo acceder a la cámara
        </Text>
        <Text className="text-gray-400 text-center">
          Habilita los permisos desde la configuración del dispositivo
        </Text>
      </View>
    );
  }

  const reg = accesoParcial?.registro_accesos?.[0];

  const showAccesoModal = 
  accesoParcial !== null &&
  // reg !== undefined &&
  Array.isArray(accesoParcial.invitados);
  
  return (
    <View className="flex-1 bg-[#0B0A16]">
       <ScrollView>
        <View
        className="
          bg-[#0B0A16]
          p-5
          rounded-2xl
          mx-[8%]
          my-2
          flex-1
          mt-[5%]
          
          mb-[30%]
        "
      >
                         <BottonToIndex/>
        <Text className="text-white text-xl font-bold mb-4 text-center">
          Validar Código de Acceso
        </Text>
<Modal animationType="fade" transparent visible={loadingLogin}>
        <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.6)]">
          <View className="bg-[#1A1A1A] px-8 py-6 rounded-2xl items-center">
            <ActivityIndicator size="large" color="#8b5cf6" />
            <Text className="text-white mt-4 text-lg font-semibold">
              Validando código...
            </Text> 
          </View>
        </View>
      </Modal>

         
           {showAccesoModal &&(
             <Modal
          transparent
          animationType="slide"
          visible={!!accesoParcial}
          onRequestClose={() => setAccesoParcial(null)}
        >
  <View className="flex-1 bg-black/70 justify-center items-center px-4">
    <View className="bg-[#0B0A16] w-full rounded-2xl p-5 border border-white/10">

      {/* TÍTULO */}
      <Text className="text-white text-2xl font-bold mb-2">
        Detalle del acceso
      </Text>

      {/* MOTIVO */}
      <Text className="text-gray-300">
        <Text className="font-bold">Motivo:</Text>{" "}
        {reg?.motivo}
      </Text>

      {/* ACCESO */}
      <Text className="text-gray-300 mt-1">
        <Text className="font-bold">Acceso:</Text>{" "}
        {reg?.acceso}
      </Text>

      {/* ESTADO */}
      <Text className="text-gray-300 mt-1">
        <Text className="font-bold">Estado:</Text>{" "}
        <Text
          className={
            reg?.activo ? "text-green-500" : "text-red-500"
          }
        >
          {reg?.activo ? "Activo" : "Inactivo"}
        </Text>
      </Text>

      {/* FECHAS */}
      <Text className="text-gray-300 mt-1">
        <Text className="font-bold text-white">Expira:</Text>{" "}
        {accesoParcial?.expiracion ?? "Sin fecha"}
      </Text>

      {/* CÓDIGO */}
      <Text className="text-gray-300 mt-1">
        <Text className="font-bold text-white">Código:</Text>{" "}
        {accesoParcial?.codigo}
      </Text>

      {/* QR */}
      {accesoParcial?.qr_url && (
        <Image
          source={{ uri: accesoParcial.qr_url }}
          style={{ width: 200, height: 200 }}
          className="mx-auto mt-4 rounded-xl"
        />
      )}

      {/* INVITADOS */}
      {accesoParcial?.invitados && accesoParcial.invitados.length > 0 && (
         <View className="mt-4">
          <Text className="text-white font-bold mb-2">
            Acompañantes
          </Text>

          {accesoParcial.invitados.map((ac, idx) => (
            <View key={idx} className="mb-1">
              <Text className="text-gray-300 text-sm">
                <Text className="font-bold text-white">Nombre:</Text> {ac.inv_name}{" "}
                <Text className="font-bold text-white">DNI:</Text> {ac.documento}{" "}
                <Text className="font-bold text-white">TEL:</Text> {ac.contacto}
                {reg?.responsable_id === ac.id && (
                  <Text className="text-red-500 font-bold">
                    {" "}Responsable
                  </Text>
                )}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* BOTÓN CERRAR */}
      <TouchableOpacity
      className="bg-green-500 rounded-md py-2"
      onPress={()=> changeAdmin()}
      >
         <Text className="text-white mx-auto">Validar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-red-600 mt-6 py-3 rounded-xl"
        onPress={() => setAccesoParcial(null)}
      >
        <Text className="text-white text-center font-bold">
          Cerrar
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
           )}
      

            <View className="flex-row justify-center mb-5">
                     <Pressable onPress={() => setCodigoManual(false)} className="flex-1 mr-1">
                      {({ pressed }) => (
                        <LinearGradient
                          colors={
                            (pressed || !codigoManual)
                              ? ["#EA5818", "#D846EF", "#5346E6"]
                              : ["#2D2D2D", "#2D2D2D"]
                          }
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{ borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}
                          className="py-3 px-6"
                        >
                          <Text className="text-white font-bold text-center text-lg">QR</Text>
                        </LinearGradient>
                      )}
                    </Pressable>

                    <Pressable onPress={() => setCodigoManual(true)} className="flex-1 ml-1">
                      {({ pressed }) => (
                        <LinearGradient
                          colors={
                            (pressed || codigoManual)
                              ? ["#EA5818", "#D846EF", "#5346E6"]
                              : ["#2D2D2D", "#2D2D2D"]
                          }
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{ borderTopRightRadius: 12, borderBottomRightRadius: 12 }}
                          className="py-3 px-6"
                        >
                          <Text className="text-white font-bold text-center text-lg">Manual</Text>
                        </LinearGradient>
                      )}
                    </Pressable>
                  </View>
 
       { !codigoManual ?(<View className="w-full aspect-square rounded-2xl overflow-hidden mb-6 bg-black">
          <CameraView
            style={{ flex: 1 }}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            className="rounded-2xl overflow-hidden"
          />
         </View>):( <View>
          <TextInput value={qrData} className="bg-white mb-5" onChangeText={(data) => setQrData(data)}></TextInput>


          <Pressable
            onPress={() => {
              fetchValidacion();
            }}
          >
            {({ pressed }) => (
              <LinearGradient
                colors={
                  pressed
                    ? ["#383AE6", "#383AE6"]
                    : ["#EA5818", "#D846EF", "#5346E6"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 14 }}
                className="rounded-2xl py-3 mx-auto px-9"
              >
                <Text className="text-white font-bold text-center text-lg" >
                  Verificar
                </Text>
              </LinearGradient>
            )}
          </Pressable>
         </View>)}

        {/* Resultado */}
        {qrData && (
          <View className="mb-4">
            <Text className="text-gray-300 text-center mb-1">
              Código detectado:
            </Text>
            <Text className="text-white text-center font-semibold">
              {qrData}
            </Text>
          </View>
        )}

        {/* Botón reset */}
        {scanned && (
          <Pressable
            onPress={() => {
              setScanned(false);
              setQrData("");
            }}
          >
            {({ pressed }) => (
              <LinearGradient
                colors={
                  pressed
                    ? ["#383AE6", "#383AE6"]
                    : ["#EA5818", "#D846EF", "#5346E6"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 14 }}
                className="rounded-2xl py-3 mx-auto px-9"
              >
                <Text className="text-white font-bold text-center text-lg">
                  Escanear otro código
                </Text>
              </LinearGradient>
            )}
          </Pressable>
        )}

         
        
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
