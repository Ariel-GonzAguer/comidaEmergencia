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
              const nuevoEstado = { ...state[key], [elemento.nombre]: elemento };
              state[key] = nuevoEstado;
            });
          }
        } catch (error) {
          console.error('Error al agregar el elemento:', error);
        }
      },

      eliminarElemento: async (key, nombre) => {
        try {
          const data = await eliminarElementoFB(key, nombre);
          if (data) {
            set((state) => {
              delete state[key][nombre];
            });
          }
        } catch (error) {
          console.error('Error al eliminar el elemento:', error);
        }
      },

      actualizarElemento: async (key, nombre, nuevoElemento) => {
        try {
          const data = await actualizarElementoFB(key, nombre, nuevoElemento);
          if (data) {
            set((state) => {
              const nuevoEstado = { ...state[key], [nombre]: nuevoElemento };
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