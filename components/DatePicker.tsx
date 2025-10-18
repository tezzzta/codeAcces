// CustomDatePicker.tsx
// Reusable DatePicker component for React Native + Web (TypeScript)
// Works with:
//  - Expo managed: prefer `expo-date-picker` (see notes below)
//  - Bare RN: `@react-native-community/datetimepicker` (and optional `react-native-modal-datetime-picker`)
//
// Installation notes (choose one):
// Expo managed (recommended):
//   npx expo install expo-date-picker
// Bare React Native (or if you prefer community libs)://   npm install @react-native-community/datetimepicker react-native-modal-datetime-picker
//
// Usage:
//   import CustomDatePicker from './components/CustomDatePicker';
//
//   const [date, setDate] = useState<Date | null>(null);
//   <CustomDatePicker value={date} onChange={setDate} mode="date" label="Fecha" />

import React, { useState, useCallback, useRef  } from 'react';
import { Platform, View, Text, Pressable, Modal, StyleSheet } from 'react-native';

type PickerMode = 'date' | 'time' | 'datetime';

type Props = {
  value: Date | null;
  onChange: (d: Date | null) => void;
  mode?: PickerMode;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

// Small helper to format date for display
function formatDate(d: Date | null, mode: PickerMode) {
  if (!d) return '';
  if (mode === 'time') return d.toLocaleTimeString();
  if (mode === 'date') return d.toLocaleDateString();
  return d.toLocaleString();
}

export default function CustomDatePicker({
  value,
  onChange,
  mode = 'date',
  label,
  placeholder = 'Seleccionar',
  disabled = false,
}: Props) {
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Platform-specific picker rendering
  const open = useCallback(() => {
    if (disabled) return;
    // On web we can rely on a native input; for RN we open an internal modal and try to render a native picker
    setVisible(true);
  }, [disabled]);

  const close = useCallback(() => setVisible(false), []);

  // Try to dynamically require community/native pickers. This avoids pack-time crash if not installed.
  let NativeDateTimePicker: any = null;
 
    try {
      // fallback to community picker
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      NativeDateTimePicker = require('@react-native-community/datetimepicker').default;
    } catch (err) {
      NativeDateTimePicker = null;
    }
  

  // Handler when native picker returns a date
const handleNativeChange = (_event: any, selected?: Date | number | undefined) => {
  const newDate = selected == null
    ? null
    : (selected instanceof Date ? selected : new Date(selected));

  if (newDate) {
    const day = String(newDate.getDate()).padStart(2, '0');
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const year = newDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    const final = new Date(formattedDate)
    onChange(final);
  } else {
    onChange(null);
  }

  close();
};


  // For web fallback: use an <input type="date"> rendered inside a small web-only wrapper
  if (Platform.OS === 'web') {
    return (
      <View className='mx-auto'>
        {label ? <Text className='text-black'>{label}</Text> : null}
        

            <Pressable   onPress={() => inputRef.current?.showPicker()}> 
            <input
          ref={inputRef}
          aria-label={label ?? 'date-picker'}
          type={mode === 'time' ? 'time' : 'date'}
          value={value ? (mode === 'time' ? value.toTimeString().slice(0,5) : value.toISOString().slice(0,10)) : ''}
          onChange={(e: any) => {
            const v = e.target.value;
            if (!v) return onChange(null);
            if (mode === 'time') {
              // set today's date with the selected time
              const [hh, mm] = v.split(':').map(Number);
              const d = new Date();
              d.setHours(hh, mm, 0, 0);
              return onChange(d);
            }
            const [year, month, day] = v.split('-').map(Number);
            const localDate = new Date(year, month - 1, day);
            onChange(localDate);
          }}
          disabled={disabled}
          style={{ padding: '8px 6rem',  borderRadius: 6 , }}
          
          className='bg-[#4400ff] text-white font-semibold hover:bg-[#3901d3]'
        />

            </Pressable>
        
      </View>
    );
  }

  // Native: if native picker is available, render a Pressable that opens a modal containing the native picker
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <Pressable style={[styles.input, disabled && styles.disabled]} onPress={open} disabled={disabled}  >
        <Text style={value ? styles.valueText : styles.placeholderText}>
          {value ? formatDate(value, mode) : placeholder}
        </Text>
      </Pressable>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
        <View style={styles.modalOverlay}>

          <View style={styles.modalContent}>
            
            {!NativeDateTimePicker ? (
              <View style={{ padding: 16 }}>
                <Text style={{ marginBottom: 8 }}>No se encontró un DatePicker nativo</Text>
                <Text style={{ marginBottom: 12 }}>Instala una dependencia compatible:</Text>
                <Text style={{ fontSize: 12 }}>
                  • Expo managed: <Text style={{ fontWeight: '700' }}>npx expo install expo-date-picker</Text>
                </Text>
                <Text style={{ fontSize: 12 }}>• Bare RN: <Text style={{ fontWeight: '700' }}>npm install @react-native-community/datetimepicker</Text></Text>
                <Pressable onPress={close} style={styles.button}><Text style={styles.buttonText}>Cerrar</Text></Pressable>
              </View>
            ) : (
              <View>
                
                {/* Some implementations expect a `value` prop and an `onChange` with signature (event, date) */}
                {/* We pass `value ?? new Date()` to show a default. */}
                {/* @ts-ignore - dynamic require typing */}
                

                {/* Este es el modal inutil para android */}
                <NativeDateTimePicker
                  value={value ?? new Date()}
                  mode={mode === 'datetime' ? 'date' : mode}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleNativeChange}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 8 }}>
                  <Pressable onPress={() => { onChange(null); close(); }} style={[styles.button, { marginRight: 8 }]}>
                    <Text style={styles.buttonText}>Clear</Text>
                  </Pressable>
                  <Pressable onPress={close} style={styles.button}><Text style={styles.buttonText}>Done</Text></Pressable>
                </View>
              </View>
            )}

          </View>
        </View>
      </Modal>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8,   alignSelf: 'center'  },
  label: { marginBottom: 6, fontSize: 14, color: '#333' },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  
    backgroundColor: '#4400ff',
  },
  
  placeholderText: { color: '#ddd', fontWeight: '600' },
  valueText: { color: '#fff', fontWeight: '600' },
  disabled: { opacity: 0.6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  button: { paddingVertical: 8, paddingHorizontal: 30, borderRadius: 8, backgroundColor: '#007AFF' },
  buttonText: { color: '#fff' },
});
