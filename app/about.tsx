import { View, Text, TextInput, Pressable, ScrollView, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { enviarAcceso, estadoUsuario } from '../store/state';
import CustomDatePicker from '../components/DatePicker'
import {ParteDeAbajo} from '../components/PartedeAbajo'
import * as Clipboard from 'expo-clipboard';
import {BottonToIndex} from '../components/BotonToIndex'
import * as storage from '../utils/auth';

type texxto ={
  text: string;
}

  function Copipaste({ text }: texxto) {
  const [copied, setCopied] = useState(false);

  const copiar = async () => {
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Pressable
      onPress={copiar}
      className="  rounded-lg px-4 py-2 mx-auto"
    >
      <Ionicons name='copy' size={20} color="gray" className=' '>
          <Text className="text-white font-semibold Saint-serif">
        {copied ? "✅ Copied!" : " Copy"}
      </Text>
      </Ionicons>
     
    </Pressable>
  );
}


interface Guest {
  inv_name: string;
  inv_lastname: string;
  documento: string;
  created_at: string;
  contacto: string;
  estado: boolean;
}

interface ValidationError {
  documento?: string;
  expiracion?: string;
}


//No soy de comentarios, pero en el desarrollo me perdi. 
// Por lo cual documentaré

export default function AccessForm() {

  //token es el negro de southpark
  const token = storage.getToken()

  //variable user_id  traida del estado 
  const user_id = estadoUsuario((state) => state.id);
  //setfecha cambia la fecha del estado
  const setFecha = enviarAcceso((state) => state.setFecha);
  //cambiar el motivo
  const setMotivo = enviarAcceso((state) => state.setMotivo);
  //cambiar el usuario 
  const setUsuario = enviarAcceso((state) => state.setUsuario);
  //acceso traido del state
  const acceso = enviarAcceso((state) => state.acceso);
  //cambiamos los invitados, es importante esta funcion
  const setinvitados = enviarAcceso((state) => state.setinvitados);
  //cambiamos el responsable, la persona encargada del acceso
  const setResponsable = enviarAcceso((state) => state.setResponsable);


//guest es una variable  local para guardar en el estado global
  const [guests, setGuests] = useState<Guest[]>([]);
  // aca manejamos los errores depende del error que vuelva
  const [errors, setErrors] = useState<ValidationError[]>([]);
  //presionado para manejar el fetch y el modal
  const [press, setPress] = useState(false);


    //Esto lo creo chat para el modal del link creado
  const [modalVisible, setModalVisible] = useState(false);
  const [accessLink, setAccessLink] = useState("");
  const [loading, setLoading] = useState(false);

  const isWeb = Platform.OS === 'web';

  //un use state para el estado de fecha
  const [selectedDate, setSelectedDate] = useState<Date | null >(null);


  const addGuest = (): void => {
    setGuests((prev) => [
      ...prev,
      {
        inv_name: '',
        inv_lastname: '',
        documento: '',
        contacto: '',
        created_at: new Date().toISOString(),
        estado: false,
      },
    ]);
    setErrors((prev) => [...prev, {}]);
  };

  const updateGuest = (index: number, field: keyof Guest, value: string): void => {
    const updatedGuests = [...guests];
    updatedGuests[index] = { ...updatedGuests[index], [field]: value };
    setGuests(updatedGuests);
  };

     const isValidDate = (date: Date | null): boolean => {
      return date instanceof Date && !isNaN(date.getTime());
    };


  const handleSubmit = async () => {
    setPress(true)
      const newErrors: ValidationError[] = [];

    guests.forEach((guest) => {
      const guestErrors: ValidationError = {};

      if (guest.documento.trim().length < 4) {
        guestErrors.documento = 'Documento inválido';
      }

      if (!isValidDate(acceso.expiracion)) {
        guestErrors.expiracion = 'Fecha inválida (YYYY-MM-DD)';
      }

      newErrors.push(guestErrors);
    });

    setErrors(newErrors);

    const hasErrors = newErrors.some((e) => Object.keys(e).length > 0);
    if (hasErrors) return;
    setLoading(true);
      try{
         //no olvidar 
        // const response = await fetch("http://localhost:3000/api/access", {
         const response = await fetch('https://backend-access.vercel.app/api/access',{

          method: "POST",
               headers: { "Content-Type": "application/json", "Authorization":"Bearer" + " " + await token },
              body: JSON.stringify({
              motivo: acceso.motivo,
              expiracion: acceso.expiracion,
              responsable: acceso.responsable_id,
              usuario: acceso.user_id,
              invitados: acceso.invitados
      }),
        });
    if (!response.ok) throw new Error("Error al enviar datos");

    const data = await response.json();
    const {credencial, codigo} = data;
 
    setAccessLink(data.link || "http://localhost:3000/acceso/" + credencial + "/" + codigo);
     setModalVisible(true);

     //puedo quitar este aleter y este console.log



      }catch(error){
          //obvio todos los consoles debo borrarlos
           alert("❌ Ocurrió un error al enviar los datos");

      } finally{
         setLoading(false);
      }
    setPress(true) 

    //este alert tambien puedo quitarlo
 
  };

  useEffect(() => {
    if (user_id) setUsuario(user_id);
    setinvitados(guests)
    if (press) {
      setPress(false);
     }
  }, [press, guests, user_id]);

  return (
   <View className="flex-1 bg-[#04020a]">
     {Platform.OS !== 'web' && (
              <View className="pt-6 bg-zinc-900">
                <View className="px-4 pt-2 bg-zinc-950">
                  <BottonToIndex />
                </View>
              </View>
            )}
     <ScrollView className="flex-1 bg-[#04020A] px-4 pt-1">

        
  {/* Título */}
  <Text className="text-[#F5F5F5] text-3xl font-bold text-center mb-8 mt-5 tracking-wide">
    Nuevo acceso
  </Text>

  {/* Motivo */}
  <Text className="text-white text-lg font-semibold mb-2 mx-auto">
    Motivo de la visita
  </Text>

  <TextInput
    placeholder="Ej. Entrega de documentos"
    placeholderTextColor="#8A8A9A"
    value={acceso.motivo}
    onChangeText={setMotivo}
    className={`bg-[#131225] text-white p-3 rounded-xl mb-6 border border-[#2A2A40] ${isWeb ? 'w-[21rem] mx-auto' : ''}`}
  />

  {/* Fecha */}
  <Text className="text-white text-lg font-semibold mb-2 mx-auto">
    Selecciona fecha
  </Text>

  <View className={`${isWeb ? 'lg:w-[55%] mx-auto' : ''}`}>
    <CustomDatePicker 
      value={acceso.expiracion}
      onChange={setFecha}
      mode="date"
    />
  </View>

  {!isValidDate(acceso.expiracion) && (
    <Text className="text-red-500 text-center mx-auto mb-4">
      Error en fecha (formato: YYYY-MM-DD){"\n"}o valida espacios.
    </Text>
  )}

  {/* Agregar invitado */}
  <Pressable onPress={addGuest} className="flex-row items-center mb-6 mx-auto mt-3">
    <Ionicons name="add-circle-outline" size={isWeb ? 30 : 44} color="#ffffff" />
    {isWeb && <Text className="text-white font-semibold ml-3 text-lg">Agregar invitado</Text>}
  </Pressable>

  {/* Invitados */}
  {guests.map((guest, index) => (
    <View 
      key={index} 
      className= {Platform.OS ==='web' ? "bg-[#1a1a2e] p-4 rounded-xl mb-6 w-[70%] lg:w-[45%] mx-auto":"bg-[#1a1a2e] p-4 rounded-xl mb-6"}
      style={{ shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 7, elevation: 4 }}
    >
      <Text className="text-white font-semibold mb-3 text-lg">Invitado #{index + 1}</Text>

      <TextInput
        placeholder="Nombre"
        placeholderTextColor="#8A8A9A"
        value={guest.inv_name}
        onChangeText={(text) => updateGuest(index, 'inv_name', text)}
        className="bg-[#131225] text-white p-3 rounded-xl border border-[#2A2A40] mb-2"
      />

      <TextInput
        placeholder="Apellido"
        placeholderTextColor="#8A8A9A"
        value={guest.inv_lastname}
        onChangeText={(text) => updateGuest(index, 'inv_lastname', text)}
        className="bg-[#131225] text-white p-3 rounded-xl border border-[#2A2A40] mb-2"
      />

      <TextInput
        placeholder="Documento"
        placeholderTextColor="#8A8A9A"
        value={guest.documento}
        onChangeText={(text) => updateGuest(index, 'documento', text)}
        className="bg-[#131225] text-white p-3 rounded-xl border border-[#2A2A40] mb-2"
      />
      {errors[index]?.documento && (
        <Text className="text-red-500 mb-2">{errors[index].documento}</Text>
      )}

      <TextInput
        placeholder="Contacto"
        placeholderTextColor="#8A8A9A"
        value={guest.contacto}
        onChangeText={(text) => updateGuest(index, 'contacto', text)}
        className="bg-[#131225] text-white p-3 rounded-xl border border-[#2A2A40] mb-3"
      />

      <Pressable onPress={() => setResponsable(guest.documento)}>
        <Text
          className={`mx-auto py-2 px-10 text-center font-semibold rounded-xl ${
            guest.documento === acceso.responsable_id
              ? "bg-green-600 text-white"
              : "bg-[#35358F] text-white"
          }`}
        >
          Responsable
        </Text>
      </Pressable>
    </View>
  ))}

  {/* Botón Crear */}
  <View className="flex justify-center items-center pb-14 mt-8">
    <Pressable onPress={handleSubmit} disabled={loading}>
      {({ pressed }) => (
        <LinearGradient
          colors={
            loading
              ? ['#555', '#555']
              : pressed
              ? ['#3336e6', '#3336e6']
              : ['#ea5818', '#d846ef', '#5346e6']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="flex-row items-center rounded-3xl px-10 py-3 mb-[48%]"
          style={{ borderRadius: 22 }}
        >
          <Text className="text-white text-2xl font-bold">
            {loading ? "Creando..." : "Crear"}
          </Text>
        </LinearGradient>
      )}
    </Pressable>
  </View>

  {/* Modal */}
  <Modal
    visible={modalVisible}
    transparent
    animationType="fade"
    onRequestClose={() => setModalVisible(false)}
  >
    <View className="flex-1 justify-center items-center bg-black/70">
      <View 
        className={`${isWeb 
          ? 'bg-[#272797]' 
          : 'bg-[#ffffff]'
        } rounded-xl p-6 w-4/5`}>
        
        <Text className="text-xl font-bold mb-3 text-center text-white">✅ Acceso creado</Text>

        <Text className="text-gray-300 mb-3 text-center">
          Este es el link de acceso:
        </Text>

        <Text className="text-blue-400 underline text-center break-words mb-5">
          {accessLink}
        </Text>

        <Copipaste text={accessLink} />

        <Pressable onPress={() => setModalVisible(false)} className="mx-auto mt-4">
          {({ pressed }) => (
            <LinearGradient
              colors={
                pressed
                  ? ['#3336e6', '#3336e6']
                  : ['#ea5818', '#d846ef', '#5346e6']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="px-6 py-3 rounded-3xl"
            >
              <Text className="text-white font-semibold text-center">Cerrar</Text>
            </LinearGradient>
          )}
        </Pressable>

      </View>
    </View>
  </Modal>

 

</ScrollView>



{/* acuerdate que poninendo un flex-1 puedo hacer el scrollview dentro */}
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
