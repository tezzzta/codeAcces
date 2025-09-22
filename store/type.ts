// types.ts
export type Invitado =
  | {
      id: number;
      created_at: string;
      inv_name: string;
      inv_lastname: string;
      documento: number;
      estado: boolean;
      contacto: number;
    };

export type Credencial = {
  id: number;
  codigo: string;
  qr_url: string;
  invitados: Invitado[];
  expiracion: string;
  invitado_id: number;
};

export type Acceso = {
  id: number;
  acceso_exitoso: boolean;
  activo: boolean;
  user_id: number;
  acceso: string;
  credential_id: number;
  responsable_id: number;
  credenciales: Credencial;
  motivo: string;
};
