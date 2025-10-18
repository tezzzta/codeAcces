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
         console.log("primer console",loggIn)
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
           console.log(datos)
           const res = datos.data
           if (datos?.data) {
             setUsuario(res);
             try{
                console.log("Respuesta mi perro",res)
             }catch{}
           }
         } catch (err) {
           console.error("Error en fetchEstado:", err);
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
      <Stack.Protected guard={!loggIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}