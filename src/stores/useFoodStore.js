// zustand
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { getData, agregarElemento, eliminarElemento } from '../servicios/firebaseService';

const useStore = create( //change the name of the store
  persist(
    immer((set) => ({
      // Estados
      recetas: {},
      alimentos: {},
      lugares: {},
      notas: {},

      // Acciones
      getFullData: async () => {
        try {
          const data = await getData();
          if (data) {
            set((state) => {
              state.recetas = data.recetas || {};
              state.alimentos = data.alimentos || {};
              state.lugares = data.lugares || {};
              state.notas = data.notas || {};
            });
          }
        } catch (error) {
          console.error('Error al obtener los datos:', error);
        }
      },



      agregarAlimento: async (alimento) => {
        set((state) => {
          state.alimentos[alimento.nombre] = alimento;
        });
      },

      agregarReceta: (receta) => {
        set((state) => {
          state.recetas[receta.nombre] = receta;
        });
      },

      agregarLugar: (lugar) => {
        set((state) => {
          state.lugares[lugar.nombre] = lugar;
        });
      },

      agregarNota: (nota) => {
        set((state) => {
          state.notas[nota.nombre] = nota;
        });
      },

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