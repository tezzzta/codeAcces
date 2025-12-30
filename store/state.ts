import { create } from "zustand";
import { Acceso, Invitado } from "./type";

interface Usuario {
     id: number;
  fechaCreacion: string;   // ISO string de fecha, debo cambiarlo
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

//Necesito cambiar esto para que id sea un puto string
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



//Estado para crear un acceso

//nota, debo verificar la propiedad id y ver como hago que esta se cree sola en el backend
function crearInvitado( nombre : string, apellido: string, documento: string, contacto: string, expiracion: string) { 
  return {
    created_at: new Date().toISOString(),
    inv_name: nombre,
    inv_lastname: apellido,
    documento,
    estado: true,
    contacto,
    expiracion: expiracion

  }
}

interface elInvitado {
  

    created_at: string;
    inv_name: string;
    inv_lastname: string;
    documento: string;
    estado: boolean;
    //esta propiedad pasarla al estate general
    contacto: string;

}

interface ArrayInvitados{
    invitados: elInvitado[];
  agregarInvitado: (nombre : string, apellido: string, documento: string, contacto: string, expiracion: string) => void;
}

export const  invitadosState  = create<ArrayInvitados>((set)=> ({
  invitados: [],
  agregarInvitado: ( nombre : string, apellido: string, documento: string, contacto: string, expiracion: string) => set((state)=> ({invitados: [...state.invitados, crearInvitado(nombre, apellido, documento, contacto, expiracion)]}))

  }));

interface enviarAccesos {
  acceso: {
      acceso_exitoso: boolean;
      activo: boolean;
      user_id: number;
      acceso: string;
      credential_id: number;
      responsable_id: string;
      expiracion: Date | null;
      invitados: elInvitado[];
      motivo: string;
  }
  setinvitados: (invitados: elInvitado[]) => void;
  setMotivo: (motivo: string) => void;
  setUsuario: (user_id: number) => void;
  setResponsable: (responsable_id: string) => void;
  setFecha: (expiracion: Date | null) => void;
}
export const enviarAcceso =  create<enviarAccesos>((set)=>({
  acceso: {
    acceso_exitoso: false,
    activo: false,
    user_id: 0,
    //debo tener acceso? validar, sino borrar
    acceso: "",
    credential_id: 0,
    responsable_id: " ",      
    expiracion: new Date(),
    invitados: [],
      motivo: ""
  },
  setinvitados: (invitados) => set( (state) => ({acceso:{ ...state.acceso, invitados}})),
  setMotivo: (motivo) => set((state) => ({acceso:{ ...state.acceso, motivo}})),
  setUsuario: (user_id) => set((state) => ({acceso:{ ...state.acceso, user_id}})),
  setResponsable: (responsable_id) => set((state) => ({acceso:{ ...state.acceso, responsable_id}})),
  setFecha : (expiracion) => set((state) => ({acceso:{ ...state.acceso, expiracion}}))
}));

