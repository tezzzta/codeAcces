import { create } from "zustand";

interface Admin {
    isAdmin: boolean;
    setIsAdmin: (isorno: boolean)=> void;
}

export const isAdminStore = create<Admin>((set) => ({
    isAdmin: false,
    setIsAdmin: (isOrNo)=> set({isAdmin: isOrNo})

}));
