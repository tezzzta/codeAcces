import { View, Text, Image, Platform, StyleSheet, Pressable } from 'react-native';

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
    <View className="flex-1 bg-[#221D1D] p-6 ">
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

      <View className={Platform.OS == 'web' ?"bg-[#2A2A2A] rounded-xl p-4 space-y-2 mx-[20%]":"bg-[#2A2A2A] rounded-xl p-4 space-y-2"}>
        <Text className='text-[22px] text-white m-auto mb-4'> Información de la cuenta </Text>
        <Info label="Contacto" value={people.contacto.toString()} />
        <Info label="Ubicación" value={people.ubicacion} />
        <Info label="Documento" value={people.documento.toString()} />
        <Info
          label="Fecha de creación"
          value={people.fecha_creacion.toLocaleDateString()}
        />
      </View>
          <View className='mx-auto my-[40px]'>
<Pressable >
          {({ pressed }) => (
            <Text
              className={
                pressed
                  ? 'text-5xl text-white bg-[#720000] py-3 px-6 rounded-2xl'
                  : 'text-5xl text-white bg-[#2F0000] py-3 px-6 rounded-2xl'
              }
            >
              Settings 
            </Text>
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
