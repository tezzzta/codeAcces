import { View, Text, TextInput, Pressable, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface Guest {
  nombre: string;
  apellido: string;
  documento: string;
  desde: string;
  hasta: string;
}

interface ValidationError {
  documento?: string;
  desde?: string;
  hasta?: string;
}

export default function AccessForm() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const addGuest = (): void => {
    setGuests((prev) => [
      ...prev,
      { nombre: '', apellido: '', documento: '', desde: '', hasta: '' },
    ]);
    setErrors((prev) => [...prev, {}]); // agregar error vacío para ese invitado
  };

  const updateGuest = (index: number, field: keyof Guest, value: string): void => {
    const updatedGuests = [...guests];
    updatedGuests[index] = { ...updatedGuests[index], [field]: value };
    setGuests(updatedGuests);
  };

  const isValidDate = (date: string): boolean => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  };

  const handleSubmit = () => {
    const newErrors: ValidationError[] = [];

    guests.forEach((guest) => {
      const guestErrors: ValidationError = {};

      if (guest.documento.trim().length < 4) {
        guestErrors.documento = 'Documento inválido (mínimo 4 caracteres)';
      }

      if (!isValidDate(guest.desde)) {
        guestErrors.desde = 'Fecha inválida (YYYY-MM-DD)';
      }

      if (!isValidDate(guest.hasta)) {
        guestErrors.hasta = 'Fecha inválida (YYYY-MM-DD)';
      }

      newErrors.push(guestErrors);
    });

    setErrors(newErrors);

    const hasErrors = newErrors.some((e) => Object.keys(e).length > 0);
    if (hasErrors) return;

    // Aquí podrías enviar los datos a una API, guardar, etc.
    alert('Formulario válido. Invitaciones creadas.');
  };

  return (
    <ScrollView className="flex-1 bg-[#221D1D] px-4 pt-10">
      <Text className="text-[#F5F5F5] text-3xl font-semibold text-center mb-6" >
        Nuevo acceso
      </Text>

      {/* Campo motivo */}
      <Text className={Platform.OS == 'web'? "text-white text-lg mb-2 mx-auto font-semibold": "text-white text-lg mb-1"}>Motivo de la visita</Text>
      <TextInput
        placeholder="Ej. Entrega de documentos"
        placeholderTextColor="#888"
        className={Platform.OS == 'web'? "bg-[#2a2a2a] text-white p-3 rounded mb-6 w-[50%] mx-auto": "bg-[#2a2a2a] text-white p-3 rounded mb-6"}
      />

      {/* Botón Agregar invitado */}
      <Pressable onPress={addGuest} className={Platform.OS == 'web' ?"flex-row items-center space-x-2 mb-4  mx-auto":"flex-row items-center space-x-2 mb-4 mx-auto"}>
        {Platform.OS === 'web' ? (
          <>
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
            <Text className="text-white font-semibold" >Agregar invitado</Text>
          </>
        ) : (
          <Ionicons name="add-circle-outline" size={32} color="#fff" />
        )}
      </Pressable>

      {/* Campos por invitado */}
      {guests.map((guest, index) => (
        <View key={index} className="mb-6 p-4 rounded bg-[#2a2a2a] space-y-2">
          <Text className="text-white font-semibold mb-2">
            Invitado #{index + 1}
          </Text>

          <TextInput
            placeholder="Nombre"
            placeholderTextColor="#aaa"
            value={guest.nombre}
            onChangeText={(text) => updateGuest(index, 'nombre', text)}
            className="bg-[#3a3a3a] text-white p-2 rounded my-1"
          />

          <TextInput
            placeholder="Apellido"
            placeholderTextColor="#aaa"
            value={guest.apellido}
            onChangeText={(text) => updateGuest(index, 'apellido', text)}
            className="bg-[#3a3a3a] text-white p-2 rounded my-1"
          />

          <TextInput
            placeholder="Documento"
            placeholderTextColor="#aaa"
            value={guest.documento}
            onChangeText={(text) => updateGuest(index, 'documento', text)}
            className="bg-[#3a3a3a] text-white p-2 rounded my-1"
          />
          {errors[index]?.documento && (
            <Text className="text-red-500">{errors[index].documento}</Text>
          )}

          <TextInput
            placeholder="Fecha válida desde (YYYY-MM-DD)"
            placeholderTextColor="#aaa"
            value={guest.desde}
            onChangeText={(text) => updateGuest(index, 'desde', text)}
            className="bg-[#3a3a3a] text-white p-2 rounded my-1"
          />
          {errors[index]?.desde && (
            <Text className="text-red-500">{errors[index].desde}</Text>
          )}

          <TextInput
            placeholder="Fecha de expiración (YYYY-MM-DD)"
            placeholderTextColor="#aaa"
            value={guest.hasta}
            onChangeText={(text) => updateGuest(index, 'hasta', text)}
            className="bg-[#3a3a3a] text-white p-2 rounded my-1"
          />
          {errors[index]?.hasta && (
            <Text className="text-red-500">{errors[index].hasta}</Text>
          )}
        </View>
      ))}

      <View className="flex justify-center items-center pb-10 mt-10">
        <Pressable onPress={handleSubmit}>
          {({ pressed }) => (
            <Text
              className={
                pressed
                  ? 'text-5xl text-white bg-[#720000] py-3 px-6 rounded-2xl'
                  : 'text-5xl text-white bg-[#2F0000] py-3 px-6 rounded-2xl'
              }
            >
              Crear
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}
  