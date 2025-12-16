import {View, Text, Pressable, Platform} from 'react-native'
import {Link, usePathname} from 'expo-router'
import * as storage from '../utils/auth';
import { estadoLogin } from 'store/state';



export default function Navbar(){
  const setIsLoggedIn = estadoLogin((state)=> state.setIsLoggedIn)
  const loggedin = estadoLogin((state) => state.isLoggedIn)
  const get = storage.getToken()
  const logout = () => {

      storage.deleteToken();
      setIsLoggedIn(false)
    console.log(get)
}

    const path = usePathname();
    return (
    <View className="w-full h-16 bg-neutral-900 px-6 flex-row items-center justify-between shadow-md">
      {/* Título siempre visible */}
      <Link href="/" asChild>
        <Pressable>
          <Text className="text-white text-xl font-bold">Code Access</Text>
        </Pressable>
      </Link>

      <View className="flex-row space-x-6 items-center">
        {loggedin ? (
          <>
            <Link href="/" asChild>
              <Pressable>
                <Text
                  className={`text-white text-base hover:text-purple-400 ${
                    path === "/" ? "bg-purple-600 p-2 rounded" : ""
                  }`}
                >
                  Inicio
                </Text>
              </Pressable>
            </Link>

            <Link href="/about" asChild>
              <Pressable>
                <Text
                  className={`text-white text-base hover:text-purple-400 ${
                    path === "/about" ? "bg-purple-600 p-2 rounded" : ""
                  }`}
                >
                  Nuevo
                </Text>
              </Pressable>
            </Link>

            <Link href="/person" asChild>
              <Pressable>
                <Text
                  className={`text-white text-base hover:text-purple-400 ${
                    path === "/person" ? "bg-purple-600 p-2 rounded" : ""
                  }`}
                >
                  Perfil
                </Text>
              </Pressable>
            </Link>

            <Pressable
              className="bg-purple-600 px-4 py-1.5 rounded-md"
              onPress={logout}
            >
              <Text className="text-white text-base">Salir</Text>
            </Pressable>
          </>
        ) : (
          <Link href="/login" asChild>
            <Pressable className="bg-purple-600 px-4 py-1.5 rounded-md">
              <Text className="text-white text-base">Iniciar sesión</Text>
            </Pressable>
          </Link>
        )}
      </View>
    </View>
  );
};