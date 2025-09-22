import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Acceso } from "./type";

interface Usuario {
     id: number;
  fechaCreacion: string;   // ISO string de fecha
  nickname: string;
  contacto: number;
  ubicacion: string;
  documento: number;
  isAdmin: boolean;
  estado: boolean;
  team_id: string;
     cambiarNombre: (nombre: string) => void;
    cambiarContacto: (contacto: number) => void;
    nombreCambio: string;
    contactoCambio: number;
    cambioDocumento: (documento: number) => void;
  setUsuario: (usuarioBackend: any) => void;  


}

export const estadoUsuario = create<Usuario>((set) => ({
    nickname: "",
    contacto: 0,  
    ubicacion: "",
    id: 0,
    documento: 0,
    fechaCreacion: "",
    team_id: "",
    isAdmin: false,
    estado: false,
    nombreCambio:"",
    contactoCambio:0,
    cambiarNombre: (nombre) => set({nombreCambio: nombre}),
    cambiarContacto: (contacto) => set({contactoCambio: contacto}),
    cambioDocumento: (documento) => set({documento: documento}),
   setUsuario: (usuarioBackend: any) =>
    set({
      nickname: usuarioBackend.nickname,
      contacto: usuarioBackend.contacto,
      ubicacion: usuarioBackend.ubicacion,
      id: usuarioBackend.id,
      documento: usuarioBackend.documento,
      fechaCreacion: usuarioBackend.fechaCreacion,
      team_id: usuarioBackend.team_id,
    }),

}));



//
//
//
//
// store/useAccesos.ts
type AccesosState = {
  accesos: Acceso[];
  setAccesos: (data: Acceso[]) => void;
  addAcceso: (acceso: Acceso) => void;
  updateAcceso: (id: number, data: Partial<Acceso>) => void;
  removeAcceso: (id: number) => void;
};

export const useAccesosStore = create<AccesosState>((set) => ({
  accesos: [],

  setAccesos: (data) => set({ accesos: data }),

  addAcceso: (acceso) =>
    set((state) => ({
      accesos: [...state.accesos, acceso],
    })),

  updateAcceso: (id, data) =>
    set((state) => ({
      accesos: state.accesos.map((a) =>
        a.id === id ? { ...a, ...data } : a
      ),
    })),

  removeAcceso: (id) =>
    set((state) => ({
      accesos: state.accesos.filter((a) => a.id !== id),
    })),
}));



//necesito refactorizar este apifetch

//ademas hay que dejar de almacenarlo en el localstorage
//y usar cookies
export const apiFetch = async (
  url: string,
  options: RequestInit = {},
  setIsLoggedIn?: (val: boolean) => void,
) => {
  const response = await fetch(url, {
    ...options,
    credentials: "include",  
  });

  if (response.status === 401) {
    // sesión expirada
    if (setIsLoggedIn) setIsLoggedIn(false);
    throw new Error("Sesión expirada");
  }

  let json;
  try {
    json = await response.json();
  } catch {
    throw new Error("Respuesta inválida del servidor");
  }

  if (!response.ok) {
    throw new Error(json.error || "Error en la API");
  }

  return json;
};



//acá crearemos un estado para 
//almacenar los accesos como una array de objetos

interface Accesos {
  id: string;
  created_at: string;
  user_id: string;
  inv_name: string;
  inv_lastname: string;
  inv_documento: string;
  motivo_ingreso: string;
  fecha: string;
  salida: string;
  responsable: string;
  estado  : boolean;
  contacto: string;
}

 

//este es para enviar
interface EstadoAccesos {
  accesos: Accesos[];
  setAccesos: (nuevos: Accesos[]) => void;
  agregarAcceso: (nuevo: Accesos) => void;
  limpiarAccesos: () => void;
}

export const arrayAccesos = create<EstadoAccesos>((set)=>({
  accesos: [],
  setAccesos: (nuevos) => set({accesos: nuevos}),
  agregarAcceso: (nuevo) => set((state) => ({accesos: [nuevo, ...state.accesos]})),
  limpiarAccesos: () => set({accesos: []}),


}))

//PRIMERO VOY A TRABAJAR EN TRAER LOS ACCESOS
//SUBIR EL COMMIT Y DESPUÉS TRABAJAR EN EL CHANGE DE ESTADO

//segunda interfaz para traer estados del backend
interface traerAccesos {
 accesos: Accesos[];
 setAccesos: (nuevos: Accesos[]) => void;
  
}


//ENSAYARÉ ESTE PARA SOLO TRAER LOS ACCESOS 
export const estadoAccesos = create<traerAccesos>((set)=>({
  accesos: [],
   setAccesos: (nuevos) => set({accesos: nuevos}),

}))

//acá crearemos un estado global
//donde nos ayude a ccontrolar la vista del login
//prrrr 
interface EstadoLogin {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const estadoLogin = create<EstadoLogin>((set)=>({
    isLoggedIn: false,
    setIsLoggedIn: (x) => set({isLoggedIn: x})
}))