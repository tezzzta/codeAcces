import { View, Text, Image, Platform, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Persona {
  nombre: string;
  id: number;
  contacto: number;
  ubicacion: string;
  documento: number;
  fecha_creacion: Date;
}
// datos en primera instancia, debo cambiarlos desp
const people: Persona = {
  nombre: 'Alejandro',
  id: 1,
  contacto: 3001234567,
  ubicacion: 'Torre 5 - Apto 302',
  documento: 1020304050,
  fecha_creacion: new Date(),
};

export default function Perfil() {
  const imageSize = Platform.OS === 'web' ? 250 : 150;

  return (
    <View className="flex-1 bg-[#04020a] p-6 ">
      <Text className="text-white text-4xl font-semibold text-center mb-4 mt-5">
        {people.nombre}
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
        <Text className="text-white mt-2 text-lg">ID de cuenta: #{people.id}</Text>
      </View>

      <View className={Platform.OS == 'web' ?"bg-[#0a0814] rounded-xl p-4 space-y-2 mx-[20%]":"bg-[#0a0814] rounded-xl p-4 space-y-2"}>
        <Text className='text-[22px] text-white m-auto mb-4'> Información de la cuenta </Text>
        <Info label="Contacto" value={people.contacto.toString()} />
        <Info label="Ubicación" value={people.ubicacion} />
        <Info label="Documento" value={people.documento.toString()} />
        <Info
          label="Fecha de creación"
          value={people.fecha_creacion.toLocaleDateString()}
        />
      </View>
          



          <View className="flex justify-center items-center pb-10 mt-10">
                 
                         <Pressable >
          
                            {({ pressed }) => (
                                <LinearGradient
                                  colors={
                                    pressed
                                      ? ['#3336e6', '#3336e6', '#3336e6']
                                      : ['#ea5818', '#d846ef', '#5346e6']
                                  }
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 0 }}
                                  className={
                                    Platform.OS === 'web'
                                      ? 'text-5xl text-white py-3 px-6 rounded-2xl'
                                      : 'text-5xl text-white py-3 px-6 rounded-2xl'
                                  }
                                  style={{ borderRadius: 20 }}
                                >
                    
                      <Text className='text-white text-5xl'> 
                        Settings
                      </Text>
                    
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
