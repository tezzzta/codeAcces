// app/index.tsx
import { View, Text, Pressable , Platform} from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

export default function Index() {
    const router = useRouter();

    const [selectedLanguage, setSelectedLanguage] = useState(null);

  return (
    <View className='flex-1  bg-[#221D1D]'>      

      <View className="flex items-center justify-center px-4 mt-[]">
      <Text className={ Platform.OS =='web' ?'text-[#F5F5F5] text-[42px] font-semibold text-center mt-[8%]': "text-[#F5F5F5] text-[42px] font-semibold text-center mt-10"}>
        Bienvenido de vuelta, user
      </Text>
      </View>

       <View className='flex-1 items-center justify-center'>
        <View className="flex-row items-center space-x-2 bg-[#2F0000] rounded-3xl px-4 py-3">

                  {/* Botón 1 con navegación */}
                  <Link href="/about" asChild>
                    <Pressable>
                      {({ pressed }) => (
                              <View className={`px-3 py-4 rounded justify-center items-center ${pressed ? 'bg-[#720000]' : 'bg-[#2F0000]'}`}>

                          <Text className="text-white font-semibold">Nuevo Acceso</Text>
                        </View>
                      )}
                    </Pressable>
                  </Link>


                  {/* Dropdown fuera de botones */}
                  <View className="w-40">
                    <RNPickerSelect
                            onValueChange={(value) => {
                            setSelectedLanguage(value);
                            if (value === 'go') {
                              router.push('/about'); // redirige a la ruta
                            }
                          }}
                          items={[
                            { label: 'Historial de Accesos', value: 'js' },
                            { label: 'Visitantes activos', value: 'py' },
                            { label: 'Nuevo acceso', value: 'go' },
                          ]}
                          placeholder={{ label: 'Revisa Accesos', value: null }}
                      style={{
                        inputIOS: {
                          color: '#F5F5F5',
                          padding: 12,
                          backgroundColor: '#2a2a2a',
                          borderRadius: 10,
                          fontSize: 16,
                        },
                        inputAndroid: {
                          color: '#F5F5F5',
                          height:50 ,
                          padding: 12,
                          backgroundColor: '#2a2a2a',
                          borderRadius: 20,
                          fontSize: 16,
                        },
                        inputWeb: {
                          color: '#F5F5F5',
                          padding: 12,
                          backgroundColor: '#2a2a2a',
                          borderRadius: 10,
                          width: '100%',
                        },
                        viewContainer: {
                          width: '100%',
                        },
                        iconContainer: {
                          top: 16,
                          right: 10,
                        },
                      }}
                    />
                  </View>
                </View>


      
       </View>
        <View className='flex-row items-center justify-center gap-10 mb-[10%]'> 
            <Pressable>
              {({ pressed }) => (
                <Ionicons
                  name="time-outline"
                  size={30}
                  color="white"
                  className={`text-[#DADADA] ${pressed ? 'text-white bg-[#2F0000] p-2 rounded-[20px]' : ''}`}
                />
              )}
            </Pressable>

            <Link href='/person ' asChild>
            <Pressable>
              {({ pressed }) => (
                <Ionicons
                  name="person-outline"
                  size={30}
                  color="white"
                  className={`text-[#DADADA] ${pressed ? 'text-white bg-[#2F0000] p-2 rounded-[20px]' : ''}`}
                />
              )}
            </Pressable>
            </Link>
            <Link href='/about'>
            <Pressable>
              {({ pressed }) => (
                <Ionicons
                  name="add-circle-outline"
                  size={30}
                  color="white"
                  className={`text-[#DADADA] ${pressed ? 'text-white bg-[#2F0000] p-2 rounded-[20px]' : ''}`}
                />
              )}
            </Pressable>
            </Link>
        </View>

<View className='m-auto'>
           {/* <Pressable>
            {({ pressed }) => (
              <View className={`px-4 py-2 rounded ${pressed ? 'bg-black' : 'bg-blue-500'}`}>
                <Text className="text-white">Nuevo Acceso</Text>
              </View>
            )}
          </Pressable> */}

          
{/* <Ionicons name="home-outline" size={24} color="white" /> */}


          
</View>

    </View>
  );
}
