import { Stack } from 'expo-router';
import { Platform, Text } from 'react-native';
import {useEffect} from 'react'
import '../global.css';
import Navbar from '../components/Navbar'
import Footer from 'components/Footer';
import { estadoLogin, estadoUsuario } from 'store/state';
import {API_URL} from '../components/config'
import * as storage from '../utils/auth';
import { isAdminStore } from 'store/Admin';


 
//NOTA: Al desplegar en web necesito eliminar 
export default function Layout() {

  const adminR = isAdminStore((state) => state.isAdmin)
    const setIsAdmin = isAdminStore((state) => state.setIsAdmin)

    const token = storage.getToken();
  const loggIn = estadoLogin((state) => state.isLoggedIn);
  const setIsLoggedIn = estadoLogin((state) => state.setIsLoggedIn);
  const  people = estadoUsuario.getState()
  const setUsuario = estadoUsuario((state)=> state.setUsuario)
  
  const documento = people.documento

 

  //necesito encontrar un lugar para este useEffect pero por el momento lo pondré acá
   useEffect(() => {
     if (loggIn) {
       const fetchEstado = async () => {
          try {
      // const resultado = await fetch(`${API_URL}/api/access/checkUser`, {
           const resultado = await fetch( `https://backend-access.vercel.app/api/access/checkUser`,{
               method: "POST",
               headers: { "Content-Type": "application/json", "Authorization":"Bearer" + " " + await token },
               body:  JSON.stringify({ documento   })
              }
             
           );
           const datos = await resultado.json();
            const res = datos.data
            console.log("Datos del usuario:", res);
           if (datos?.data) {
             setUsuario(res);
             try{
              }catch{}
           }
         } catch (err) {
          }
       };
       fetchEstado();
      }
   }, [loggIn]);


   
  return (

     <>
           {Platform.OS === 'web'&& <Navbar/>}

     <Stack>
       <Stack.Protected guard={loggIn}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={loggIn}>
        <Stack.Screen name="about" options={{ headerShown: false }} />
      </Stack.Protected>
      {/*  validar las rutas, y poner o quitar la mayuscula del inicio*/}
      <Stack.Protected guard={loggIn}>
        <Stack.Screen name="Activated" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={loggIn}>
        <Stack.Screen name="person" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={loggIn}>
        <Stack.Screen name="history" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!loggIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={loggIn}>
        <Stack.Screen name="check" options={{ headerShown: false }} />
      </Stack.Protected>
      
       <Stack.Protected guard={loggIn}>
        <Stack.Screen name="usuarioCrear" options={{ headerShown: false }} />
      </Stack.Protected>
            <Stack.Screen name="showqr/[id]/[hash]" options={{ headerShown: false }} />
     </Stack>

     
      {Platform.OS === 'web'&& <Footer/>}

     </>
  );
}