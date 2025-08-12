import { View, Text, Pressable, Platform } from 'react-native';
import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';



export default function Index() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  return (
    <View className="flex-1 bg-[#04020a]">
      <View className="flex items-center justify-center px-4 mt-10">
        <Text
          className={
            Platform.OS === 'web'
              ? 'text-[#F5F5F5] text-[42px] font-semibold text-center mt-[8%]'
              : 'text-[#F5F5F5] text-[42px] font-semibold text-center mt-10'
          }
        >
          Bienvenido de vuelta, user
        </Text>
      </View>

      <View className="flex-1 items-center justify-center">
        <LinearGradient
          colors={['#ea5818', '#d846ef', '#5346e6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className={
            Platform.OS === 'web'
              ? 'flex-row items-center space-x-2 rounded-3xl px-8 py-3'
              : 'flex-row items-center space-x-2 rounded-3xl px-4 py-3 gap-2'
          }
          style={{ borderRadius: 24 }}
        >
          <Link href="/about" asChild>
            <Pressable>
              {({ pressed }) => (
                <LinearGradient
                  colors={
                    pressed
                      ? ['#3336e6', '#3336e6', '#3336e6']
                      : ['#6366e6', '#6366e6', '#6366e6']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className={
                    Platform.OS === 'web'
                      ? 'flex-row items-center space-x-2 rounded-3xl px-4 py-3'
                      : 'flex-row items-center space-x-2 rounded-3xl px-4 py-3'
                  }
                  style={{ borderRadius: 16 }}
                >
                  <Text className="text-white font-semibold">Nuevo Acceso</Text>
                </LinearGradient>
              )}
            </Pressable>
          </Link>

          <View className="w-40">
            <RNPickerSelect
              onValueChange={(value) => {
                setSelectedLanguage(value);
                if (value === 'go') {
                  router.push('/about');
                }
                if(value=== 'js'){
                  router.push('/history')

                }
                if(value==='py'){
                  router.push('/Activated')
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
                  height: 50,
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
        </LinearGradient>
      </View>

      <View className="flex-row items-center justify-center gap-10 mb-[10%]">
        <Link href="/history" asChild>
          <Pressable>
            {({ pressed }) => (
              <Ionicons
                name="time-outline"
                size={30}
                color={pressed ? 'white' : '#DADADA'}
                style={pressed ? { backgroundColor: '#6366e6', padding: 2, borderRadius: 20 } : {}}
              />
            )}
          </Pressable>
        </Link>

        <Link href="/person" asChild>
          <Pressable>
            {({ pressed }) => (
              <Ionicons
                name="person-outline"
                size={30}
                color={pressed ? 'white' : '#DADADA'}
                style={pressed ? { backgroundColor: '#6366e6', padding: 2, borderRadius: 20 } : {}}
              />
            )}
          </Pressable>
        </Link>

        <Link href="/about" asChild>
          <Pressable>
            {({ pressed }) => (
              <Ionicons
                name="add-circle-outline"
                size={30}
                color={pressed ? 'white' : '#DADADA'}
                style={pressed ? { backgroundColor: '#6366e6', padding: 2, borderRadius: 20 } : {}}
              />
            )}
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
