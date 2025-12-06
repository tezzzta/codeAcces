


import { View, Pressable, Text, Platform } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { Link, usePathname } from 'expo-router';



export const BottonToIndex = () =>{

    if(Platform.OS == 'web'){
        return null
    }
    return(
        <View className="items-start">
           
           <Link href={'/'} asChild>
           <Pressable className="mb-4 items-start justify-center">
                     
                         {({pressed})=>( 
                            <Text className={`text-white text-[16px] font-semibold   p-4 rounded-lg ${pressed ? "bg-[#dd3500]":"bg-[#9370DB]"}`}>  <Ionicons
                    name="arrow-back"
                    size={16}
                    color={"#fff"}
                        /> Inicio </Text>
                         )}
            </Pressable>
           </Link>
        </View>
    )
}