import { Stack } from 'expo-router';
import {useEffect} from 'react'
import '../global.css';
import { estadoLogin, estadoUsuario } from 'store/state';
import {API_URL} from '../components/config'
//NOTA: Al desplegar en web necesito eliminar 
export default function Layout() {
  const loggIn = estadoLogin((state) => state.isLoggedIn);
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
               credentials: "include",
               headers: { "Content-Type": "application/json" },
               body:  JSON.stringify({ documento })
              }
             
           );
           const datos = await resultado.json();
            const res = datos.data
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
            <Stack.Screen name="showqr/[id]/[hash]" options={{ headerShown: false }} />

    </Stack>
  );
}