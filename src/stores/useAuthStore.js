import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

const useAuthStore = create()(
  persist(
    immer(set => ({
      user: {
        email: null,
      },

      setUser: user =>
        set(state => {
          state.user = user;
        }),

      logOut: async () => {
        try {
          localStorage.clear();
          set(state => {
            state.user = null;
          });

          await signOut(auth);
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
          throw error; // Propagamos el error para manejarlo en el componente
        }
      },
    })),
    {
      name: 'useAuthStore', // Nombre del local storage
      version: 1, // versión del esquema de almacenamiento
      partialize: state => ({
        // solo persistir los estados que queremos
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;
