import { View, Text, Image, Platform, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { estadoUsuario } from "../store/state";

export default function Perfil() {
  const {
    nickname,
    id,
    contacto,
    ubicacion,
    documento,
    fechaCreacion,
  } = estadoUsuario((state) => state); 

  const imageSize = Platform.OS === 'web' ? 250 : 150;

  // Si todavía no cargó (ejemplo: id = 0 porque no hay usuario)
  if (!id) {
    return <Text style={{ color: "white", textAlign: "center", marginTop: 50 }}>Cargando...</Text>;
  }

  return (
    <View className="flex-1 bg-[#04020a] p-6">
      <Text className="text-white text-4xl font-semibold text-center mb-4 mt-5">
        {nickname}
      </Text>

      <View className="items-center mb-6">
        <Image
          source={{
            uri: 'https://picsum.photos/id/870/200/300?grayscale&blur=2',
          }}
          style={{
            width: imageSize,
            height: imageSize,
            borderRadius: imageSize / 2,
          }}
        />
        <Text className="text-white mt-2 text-lg">ID de cuenta: #{id}</Text>
      </View>

      <View
        className={
          Platform.OS == 'web'
            ? "bg-[#0a0814] rounded-xl p-4 space-y-2 mx-[20%]"
            : "bg-[#0a0814] rounded-xl p-4 space-y-2"
        }
      >
        <Text className="text-[22px] text-white m-auto mb-4">
          Información de la cuenta
        </Text>
        <Info label="Contacto" value={contacto?.toString()} />
        <Info label="Ubicación" value={ubicacion} />
        <Info label="Documento" value={documento?.toString()} />
        <Info label="Fecha de creación" value={fechaCreacion} />
      </View>

      <View className="flex justify-center items-center pb-10 mt-10">
        <Pressable>
          {({ pressed }) => (
            <LinearGradient
              colors={
                pressed
                  ? ['#3336e6', '#3336e6', '#3336e6']
                  : ['#ea5818', '#d846ef', '#5346e6']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 20, paddingVertical: 12, paddingHorizontal: 20 }}
            >
              <Text className="text-white text-2xl">Settings</Text>
            </LinearGradient>
          )}
        </Pressable>
      </View>
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between border-b border-[#444] pb-2">
      <Text className="text-white font-semibold">{label}</Text>
      <Text className="text-white">{value}</Text>
    </View>
  );
}
