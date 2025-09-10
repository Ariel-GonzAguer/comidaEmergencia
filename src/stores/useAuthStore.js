import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

const useAuthStore = create()(
  persist(
    immer(set => ({
      user: undefined,
      isLoading: false,

      setUser: user =>
        set(state => {
          state.user = user;
          state.isLoading = false; // Cuando se establece el usuario, ya no está cargando
        }),

      setLoading: isLoading =>
        set(state => {
          state.isLoading = isLoading;
        }),

      logOut: async () => {
        try {
          set(state => {
            state.isLoading = true;
          });

          localStorage.clear();

          set(state => {
            state.user = undefined;
            state.isLoading = false;
          });

          await signOut(auth);
        } catch (error) {
          set(state => {
            state.isLoading = false;
          });
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
        // No persistir isLoading, siempre debe empezar en false
      }),
    }
  )
);

export default useAuthStore;
