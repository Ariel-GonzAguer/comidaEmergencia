// zustand
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { getData, agregarElementoFB, eliminarElementoFB, actualizarElementoFB } from '../servicios/firebaseService';

const useStore = create()( //change the name of the store
  persist(
    immer((set) => ({
      // Estados
      alimentos: {},
      botiquin: {},
      lugares: {},
      otros: {},
      notas: {},
      recetas: {},

      // Acciones
      getFirebaseData: async () => {
        try {
          const data = await getData();
          if (data) {
            set((state) => {
              state.alimentos = data.alimentos || {};
              state.botiquin = data.botiquin || {};
              state.lugares = data.lugares || {};
              state.otros = data.otros || {};
              state.notas = data.notas || {};
              state.recetas = data.recetas || {};
            });
          }
        } catch (error) {
          console.error('Error al obtener los datos:', error);
        }
      },

      agregarElemento: async (elemento, key) => {
        try {
          const data = await agregarElementoFB(elemento, key);
          if (data) {
            set((state) => {
              // Agregar alimento al store global
              const nuevoEstado = { ...state[key], [elemento.id]: elemento };
              state[key] = nuevoEstado;
              // Si es un alimento, también agregarlo al lugar correspondiente usando el nombre
              if (key === "alimentos" && elemento.ubicacion && elemento.ubicacion.nombre) {
                const lugarNombre = elemento.ubicacion.nombre;
                if (state.lugares[lugarNombre]) {
                  // Inicializar alimentos si no existe
                  if (!state.lugares[lugarNombre].alimentos) {
                    state.lugares[lugarNombre].alimentos = {};
                  }
                  state.lugares[lugarNombre].alimentos[elemento.id] = elemento;
                }
              }
            });
          }
        } catch (error) {
          console.error('Error al agregar el elemento:', error);
        }
      },

      eliminarElemento: async (key, id) => {
        try {
          const data = await eliminarElementoFB(key, id);
          if (data) {
            set((state) => {
              delete state[key][id];
            });
          }
        } catch (error) {
          console.error('Error al eliminar el elemento:', error);
        }
      },

      actualizarElemento: async (key, id, nuevoElemento) => {
        try {
          const data = await actualizarElementoFB(key, id, nuevoElemento);
          if (data) {
            set((state) => {
              const nuevoEstado = { ...state[key], [id]: nuevoElemento };
              state[key] = nuevoEstado;
            });
          }
        } catch (error) {
          console.error('Error al actualizar el elemento:', error);
        }
      },
    })),
    {
      name: 'useStore', // Nombre de la clave en el local storage
      version: 1, // versión del esquema de almacenamiento
      partialize: (state) => ({
        alimentos: state.alimentos,
        botiquin: state.botiquin,
        lugares: state.lugares,
        otros: state.otros,
        notas: state.notas,
        recetas: state.recetas,
      }),
    }
  )
);

export default useStore;