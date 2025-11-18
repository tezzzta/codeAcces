import { View, Text, TextInput, Pressable, ScrollView, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { enviarAcceso, estadoUsuario } from '../store/state';
import CustomDatePicker from '../components/DatePicker'

  import * as Clipboard from 'expo-clipboard';

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
          headers: { "Content-Type": "application/json" },
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
    <ScrollView className="flex-1 bg-[#04020a] px-4 pt-10">
      <Text className="text-[#F5F5F5] text-3xl font-semibold text-center mb-6 mt-5">
        Nuevo acceso
      </Text>

      {/* Motivo */}
      <Text className={`${isWeb ? 'mb-2 mx-auto' : 'mb-2 mx-auto'} text-white text-lg font-semibold`}>
        Motivo de la visita
      </Text>
      <TextInput
        placeholder="Ej. Entrega de documentos"
        placeholderTextColor="#888"
        value={acceso.motivo}
        onChangeText={setMotivo}
        className={`bg-[#1a1a2e] text-white p-3 rounded mb-6 ${isWeb ? 'w-[50%] mx-auto' : ''}`}
      />

      {/* Fecha, DEBO VER COMO HAGO PARA QUE ELIJA LA FECHA CON INTERFAZ */}
      <Text className={`${isWeb ? 'mb-2 mx-auto' : 'mb-1 mx-auto'} text-white text-lg font-semibold`}>
        Selecciona fecha
      </Text>
    
      {/*Aca para cambiar la input de fecha  */}
      <CustomDatePicker
            value={acceso.expiracion}
            onChange={setFecha}
            mode="date"
            
        />

      {/* <TextInput
        placeholder="Fecha de visita (YYYY-MM-DD)"
        placeholderTextColor="#888"
        value={acceso.expiracion}
        onChangeText={setFecha}
        className={`bg-[#1a1a2e] text-white p-3 rounded mb-2 ${isWeb ? 'w-[50%] mx-auto' : ''}`}
      /> */}
      {!isValidDate(acceso.expiracion) && (
        <Text className="text-red-500 mb-4  mx-auto text-center">Error en fecha (formato: YYYY-MM-DD)  {"\n"} o valida espacios</Text>
      )}

      <Pressable onPress={addGuest} className="flex-row items-center mb-4 mx-auto mt-4">
        <Ionicons name="add-circle-outline" size={isWeb ? 30 : 44} color="#fff" />
        {isWeb && <Text className="text-white font-semibold ml-2">Agregar invitado</Text>}
      </Pressable>

      {guests.map((guest, index) => (
        <View key={index} className="mb-6 p-4 rounded bg-[#0a0814] space-y-2">
          <Text className="text-white font-semibold mb-2">Invitado #{index + 1}</Text>

          <TextInput
            placeholder="Nombre"
            placeholderTextColor="#aaa"
            value={guest.inv_name}
            onChangeText={(text) => updateGuest(index, 'inv_name', text)}
            className="bg-[#1a1a2e] text-white p-2 rounded my-1"
          />

          <TextInput
            placeholder="Apellido"
            placeholderTextColor="#aaa"
            value={guest.inv_lastname}
            onChangeText={(text) => updateGuest(index, 'inv_lastname', text)}
            className="bg-[#1a1a2e] text-white p-2 rounded my-1"
          />

          <TextInput
            placeholder="Documento"
            placeholderTextColor="#aaa"
            value={guest.documento}
            onChangeText={(text) => updateGuest(index, 'documento', text)}
            className="bg-[#1a1a2e] text-white p-2 rounded my-1"
          />
          {errors[index]?.documento && (
            <Text className="text-red-500">{errors[index].documento}</Text>
          )}

            {/* Aca hay que validar que sea un numero válido, y en las demas poner un máximo de carácteres */}
          <TextInput
            placeholder="Contacto"
            placeholderTextColor="#aaa"
            value={guest.contacto}
            onChangeText={(text) => updateGuest(index, 'contacto', text)}
            className="bg-[#1a1a2e] text-white p-2 rounded my-1"
          />

           <Pressable onPress={() => setResponsable(guest.documento)}>
            <Text
              className={`mx-auto py-1 font-semibold px-10 rounded ${
                guest.documento === acceso.responsable_id ? 'bg-green-500' :'text-white bg-[#35358f]'
              }`}
            >
              Responsable
            </Text>
          </Pressable>
        </View>
      ))}

       <View className="flex justify-center items-center pb-10 mt-10">
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
              className="flex-row items-center space-x-2 rounded-3xl px-8 py-3"
              style={{ borderRadius: 20 }}
            >
              <Text className="text-white text-2xl font-bold">
                {loading ? "Creando..." : "Crear"}
              </Text>
            </LinearGradient>
          )}
        </Pressable>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/70">
          <View className={`${isWeb ? 'bg-[#272797] rounded-xl p-6 w-4/5':'bg-[#fff] rounded-xl p-6 w-4/5' }`}>
            <Text className="text-lg font-bold mb-4 text-center text-white">✅ Acceso creado</Text>
            <Text className="text-gray-300 mb-4 text-center font-semibold">
              Este es el link de acceso:
            </Text>
              <Text className="text-blue-400 underline text-center break-words mb-6">
              {accessLink}
            </Text>
           <Copipaste text={accessLink}/>

 
            <Pressable
              onPress={() => setModalVisible(false)}
              className="py-2 px-6 rounded-xl mx-auto"
            >
               {({pressed})=>(
                <LinearGradient 
              colors={
                 
                   pressed
                  ? ['#3336e6', '#3336e6']
                  : ['#ea5818', '#d846ef', '#5346e6']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="flex-row items-center space-x-2 rounded-3xl px-5 py-3"
              style={{ borderRadius: 20 }}  
              >

                <Text className='text-white font-semibold'>Cerrar</Text>
              </LinearGradient>
               )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
