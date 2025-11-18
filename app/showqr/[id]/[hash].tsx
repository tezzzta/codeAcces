import { View, Text, ScrollView, Image, Platform, Pressable, ActivityIndicator } from "react-native"
import {API_URL} from '../../../components/config'
import { useEffect, useState } from "react";
import {useLocalSearchParams } from "expo-router"

export default function ShowQR() {
  if (Platform.OS !== "web") {
    return null; 
  }
  const [activo, setActivo] = useState(false);
  const [qr, setQr] = useState('');
  const [loading, setLoading] = useState(true);
  const {id, hash} = useLocalSearchParams()

  useEffect(() => {
    const getQR = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://backend-access.vercel.app/api/qrcode/${id}/${hash}`);
        const data = await res.json();  
        const { photo } = data;
        setQr(photo);
      } catch (error) {
        console.log("Error cargando QR", error);
      } finally {
        setLoading(false);
      }
    };
    getQR();
  }, []);

  return (
    <ScrollView className="flex-1 bg-[#04020a] px-4 pt-10 items-center justify-center">
      <View className="flex-1 items-center justify-center w-full">
        
        <View className="w-full flex-1 items-center justify-center bg-gray-400 p-3 rounded-lg">

           {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <Image
              source={{ uri: qr }}
              style={{ width: 250, height: 250 }}
              className="rounded-lg"
            />
          )}

        </View>

        <Pressable onPress={() => setActivo(!activo)}> 
          {activo ?(
            <Text className="text-white p-2 bg-red-800 mt-3 rounded-lg">Ocultar Código</Text>
          ) : (
            <Text className="text-white p-2 bg-[#360074] mt-3 rounded-lg font-semibold">Mostrar Código</Text>
          )}
        </Pressable>

        {activo && !loading && ( // 👈 Solo muestra el hash si no está cargando
          <Text className="text-white mb-4 text-3xl mt-5 font-semibold">{hash}</Text>
        )}

      </View>
    </ScrollView>
  )
}
