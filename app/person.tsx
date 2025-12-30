//necesito en la parte de cambiar  foto
//un useEffect donde vuelva a hacer fetch con la info del cliente
//actualizada (justo despues de actualizar) 
//tambien debo guardar la foto en global y que la traigan al hacer login
//Con lo anterior, necesito guardar la foto en el global (estado) para no tener que hacer fetch cada vez


import { View, Text, Image, Platform, Pressable, Modal, Alert, TextInput, ScrollView } from 'react-native';
  import { LinearGradient } from 'expo-linear-gradient';
  import { estadoUsuario } from "../store/state";
  import { useState, useEffect, use } from 'react';
  // import {API_URL} from '../components/config'
  import * as ImagePicker from "expo-image-picker"
  import { Ionicons } from '@expo/vector-icons';
  import { ActivityIndicator } from 'react-native';
  import {ParteDeAbajo} from '../components/PartedeAbajo'
  import { BottonToIndex } from '../components/BotonToIndex';
  import { includes } from 'eslint.config';
  import * as storage from '../utils/auth'

   //En las imágenes necesito buscar la manera de que al hacer cambios
  //  estos hagan fetch otra vez
    const imageSize = Platform.OS === 'web' ? 250 : 150;

  interface UploadFotoPerfilProps {
  userId: number | string;
  onUpload?: () => void;
}
  type WebFile= File;
      interface MobileFile {
      uri: string;
      name: string;
      type: string;
      } 
      
      type ArchivoSeleccionado = WebFile | MobileFile | null;

 function PickPhoto({ onSelectFile }: { onSelectFile: (file: ArchivoSeleccionado) => void }) {
  const [archivo, setArchivo] = useState<ArchivoSeleccionado>(null);

  const seleccionarFoto = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          setArchivo(file);
          onSelectFile(file);
        }
      };

      input.click();
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const file = {
        uri: result.assets[0].uri,
        name: "foto.jpg",
        type: "image/jpeg",
      };
      setArchivo(file);
      onSelectFile(file);
    }
  };

  const previewUri =
    archivo && (archivo instanceof File
      ? URL.createObjectURL(archivo)
      : archivo.uri);

  const [imageUri, setImageUri] = useState<string | null>(null);

       useEffect(() => {
              const imagenPreview = async () => {
                try {
                  const token = await storage.getToken();
                  const id = estadoUsuario.getState().id;

                  const res = await fetch(
                    `https://backend-access.vercel.app/api/imagenPerfil/${id}`,
                    {
                      method: "GET",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  if (!res.ok) {
                    console.log("Error backend:", res.status);
                    return;
                  }
                  const blob = await res.blob();
                  // 🔥 En RN se usa createObjectURL
                  const imageUrl = URL.createObjectURL(blob);
                  setImageUri(imageUrl);
                } catch (error) {
                  console.log("Error cargando imagen", error);
                }
              };

              imagenPreview();
            }, []);



  return (
     <View>
            <Text className='text-white mb-3 mx-auto font-semibold bg-black/70 px-2 py-1 rounded-md'>Cambiar foto</Text>

      <Pressable onPress={seleccionarFoto}>
    
           
            {({ pressed }) => 
                ( <View style={{ position: "relative", alignItems: "center" }}> 
                  <Image source={{ uri: previewUri ?? imageUri ?? '' }} 
                      style={{ width: imageSize, height: imageSize, borderRadius: imageSize / 2, }} 
                      /> 
                <View pointerEvents="none" 
                style={{ position: "absolute", 
                  width: imageSize, 
                  height: imageSize,
                borderRadius: imageSize / 2, backgroundColor: pressed ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)", }} /> 
                <View pointerEvents="none" 
                style={{ position: "absolute", 
                justifyContent: "center", 
                alignItems: "center",
                  bottom:60 }} > 
                  <Ionicons name="camera" size={32} color={pressed ? "#00000099" : "#E3E3E3"} 
                  style={{ marginBottom: 3, backgroundColor: pressed ? "white" : "transparent", padding: 6, borderRadius: 50, }}
                  /> 
                  <Text 
                  style={{ color: "white", fontWeight: "700", fontSize: 14, backgroundColor: "rgba(0,0,0,0.5)",
                    paddingHorizontal: 10,
                    paddingVertical: 4, 
                    borderRadius: 8, }} >
                      Cambiar foto 
                      </Text> 
                      </View> 
                      </View> )} 
 
    </Pressable>

<View className="items-center gap-3 mt-4"> 
  <Pressable onPress={seleccionarFoto}> 
    
             </Pressable> 
                </View>
     </View>
  );
}





  export default function Perfil() {
    //token... pues ya se la saben

    const token = storage.getToken()


    //DESPUES BORRO ESTO
    const [contar, setContar] = useState(0)
    const [loading, setLoading] = useState(false);

const [nuevoArchivo, setNuevoArchivo] = useState<ArchivoSeleccionado>(null);

    const userId = estadoUsuario((state)=> state.id)

    const [modalVisible, setModalVisible] = useState(false);

    const {
      nickname,
      id,
      contacto,
      ubicacion,
      documento,
      fechaCreacion,
    } = estadoUsuario((state) => state); 
    const [numero, setNumero] = useState(contacto)

    const imageSize = Platform.OS === 'web' ? 250 : 150;

    // Si todavía no cargó (ejemplo: id = 0 porque no hay usuario)
    if (!id) {
      return <Text style={{ color: "white", textAlign: "center", marginTop: 50 }}>Cargando...</Text>;
    }

    //acá una funcion para hacer fetch
    //validar que el numero sea válido o que haya un archivo para subir 
    //la del archivo ya está en subirarchivo, pero hay que hacer lo posible que se suba sin importar si el otro 
    //ya está 
 const guardado = async () => {
  const idString = id.toString();

  const numeroValido = numero && numero.toString().length >= 8;

  if (nuevoArchivo) {
    const formData = new FormData();
    formData.append("userId", idString);

    if (Platform.OS === "web" && nuevoArchivo instanceof File) {
      formData.append("file", nuevoArchivo);
    } 
    else if ("uri" in nuevoArchivo) {
      formData.append("file", {
        uri: nuevoArchivo.uri,
        name: nuevoArchivo.name,
        type: nuevoArchivo.type,
      } as any);
    }
    

    
    try { 
      console.log("Foto perfil subiendo...")
      const nojoda = await fetch(`https://backend-access.vercel.app/api/fotoPerfil/`, {
        method: "POST",
        headers: {"Content-type": "application/json", "authorization":"Bearer" + " " + await token },        
        body: formData
      });
      console.log("Foto perfil subida")
      console.log("STATUS:", nojoda.status);

      const text = await nojoda.json();
      console.log("📦 Respuesta cruda del servidor:", text);
      alert(" Foto actualizada");
    } catch (err) {
      alert("❌ Error al subir foto");
      console.log(err);
    }
  }

  if (numero !== contacto && numeroValido) {
    try {
      console.log("vamos mi negro")
      const resultado = await fetch(`https://backend-access.vercel.app/api/changeContacto`, {
        method: "POST",
        credentials: "include",
        headers: {"Content-type": "application/json", "authorization":"Bearer" + " " + await token },
        body: JSON.stringify({ id: id,  contacto: numero }),
      });

      const json = await resultado.json();
      console.log("Respuesta actualizar contacto:", json);
      alert("✅ Contacto actualizado");
      
    } catch (err) {
      alert("❌ Error actualizando contacto");
      console.log(err);
    }
  }

  setModalVisible(false);
  setContar(contar + 1); 
};

  const [imagen, setImagen] = useState<string | ArrayBuffer | null>(null);


useEffect(() => {
  const cargarImagen = async () => {
    setLoading(true);
    console.log("Tokennn", token)
    try {
      const res = await fetch(`https://backend-access.vercel.app/api/imagenPerfil/${id}` , {
        method: "GET",
        headers: { "authorization":"Bearer" + " " + await token },        
      } );
      const blob = await res.blob();
      console.log("BLOBBB", blob)
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagen(reader.result);
      };
      reader.readAsDataURL(blob);

    } catch (error) {
      console.log("Error cargando imagen", error);
    } finally {
      setLoading(false);
    }
  };

  cargarImagen();
}, [id, contar]);

    return (
      <View className="flex-1 bg-[#04020a]   w-full">
        <ScrollView>
                {Platform.OS !== 'web' && (
              <View className="pt-6 bg-zinc-900">
                <View className="px-4 pt-2 bg-zinc-950">
                  <BottonToIndex />
                </View>
              </View>
            )}

        <Text className={Platform.OS == 'web' ?"text-white text-4xl font-semibold text-center mb-4 mt-5":"text-white text-4xl font-semibold text-center mb-1 mt-5"}>
          {nickname}
        </Text>

       
        <View className="items-center mb-6">
          
          {
            loading?(
               <View>
                <ActivityIndicator size="large" />
              <Text className='text-white font-semibold'> cargando...</Text>
                </View>
            ):(
              <Image
          
            source={{
             uri: imagen ? imagen.toString() : '',
            }}
            style={{
              width: imageSize,
              height: imageSize,
              borderRadius: imageSize / 2,
            }}
          />
            )
          }
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
  
        <Modal
          animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
                <View className='flex-1 justify-center items-center bg-black/70 gap-4'>

                {/* el boton de guardar mi negro */}
                    <PickPhoto onSelectFile={setNuevoArchivo} />

                              {/* Necesito cambiar aca como una input con label para cambiar */}
                              {/* <Info label="Cambiar contacto: " value={contacto?.toString()} /> */}

                <Text className='text-white'>Cambiar contacto</Text>
                 <TextInput
                          placeholder={"Ingresa el nuevo numero"}
                          style={{
                            borderWidth: 1,
                            borderColor: "#ccc",
                            padding: 10,
                            borderRadius: 8,
                          }}
                          className='text-white'
                        keyboardType="numeric"
                            value={numero === 0 ? "" : numero.toString()} // <-- si es 0 muestra vacío
                            onChangeText={(value) => {
                              // Si está vacío, "resetea" a 0
                              if (value === "") {
                                setNumero(0);
                                return;
                              }
                              const numeric = Number(value);
                              if (!isNaN(numeric)) {
                                setNumero(numeric);
                              }
                            }}            
                          /> 
                      {/* Aca debemos cambiar el nombre */}

                            <Pressable onPress={guardado}>
                            {({pressed})=>(
                              <Text className={pressed?'text-white font-semibold bg-purple-400 p-2 rounded':'text-white font-semibold bg-purple-600 p-2 rounded'}>
                                        Guardar
                              </Text>
                            )}
                               </Pressable>
                   <Pressable onPress={()=>setModalVisible(false)}>
                  {/* cambiarlo por guardar y que acá se guarde de una vez en el backend, además de agregar un overload*/}
                                         <Text className='text-white font-semibold bg-purple-600 p-2 rounded'> Cerrar</Text>
                </Pressable>
                </View>
                  </Modal>


        <View className="flex justify-center items-center pb-10 mt-10">
          <Pressable onPress={()=> setModalVisible(true)}>
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
    </View>
  )} 
      </ScrollView>

                     {Platform.OS !== "web" && (
                       <View>
                          <LinearGradient
                          colors={['#fff', 'rgba(0,0,0,0)']}
                          start={{ x: 0, y: 1 }}
                          end={{ x: 0, y: 0.3 }}
                          className="flex-row items-center px-8 py-2 mb-1"
                          style={{  opacity: 0.15}}
                        />
                            <ParteDeAbajo />
                       </View>
                        )}
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
