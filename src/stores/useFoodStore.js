import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

const useStore = create( //change the name of the store
  persist(
    immer((set) => ({
      // Estados
      state1: null,
      state2: false,
      state3: 'ejemplo de tienda zustand',
      state4: [],
      state5: {
        string: 'ejemplo de tienda zustand',
        number: 42,
      },

      // Acciones
      actionA: (paramOpcional) =>
        set((state) => {
          // Código relacionado con el estado
        }),

      actionB: (paramOpcional) =>
        set((state) => {
          // Código relacionado con el estado
        }),

      fetchAction: async () => {
        set((state) => {
          // Código relacionado con el estado
        });

        try {
          const response = await fetch(
            "https://jsonplaceholder.typicode.com/users" // URL de ejemplo
          );
          const result = await response.json();
          set((state) => {
            // Código relacionado con el estado
          });
        } catch (error) {
          set((state) => {
            // Código relacionado con el estado
          });
        }
      },

      asyncAction: async (paramOpcional, paramOpcional2) =>
        setTimeout(
          () => {
            set((state) => ({
              /* Código relacionado con el estado */
            }));
          }, 1000 // Tiempo de ejecución en ms
        ),

      actionC: () =>
        set({
          /* Código relacionado con el estado */
        }),
    })),
    {
      name: 'food-store', // Nombre de la clave en el local storage
    }
  )
);

export default useStore;