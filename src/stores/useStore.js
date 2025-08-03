// zustand
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { getData, agregarElementoFB, eliminarElementoFB, actualizarElementoFB } from '../servicios/firebaseService';

/**
 * Store de Zustand para gestionar datos de alimentos y suministros de emergencia, con persistencia e integración de immer.
 *
 * @typedef {Object} StoreState
 * @property {Object} alimentos - Alimentos, indexados por ID.
 * @property {Object} botiquin - Elementos del botiquín, indexados por ID.
 * @property {Object} lugares - Lugares, indexados por ID.
 * @property {Object} otros - Otros elementos, indexados por ID.
 * @property {Object} notas - Notas, indexadas por ID.
 * @property {Object} recetas - Recetas, indexadas por ID.
 * @property {function(): Promise<void>} getFirebaseData - Obtiene todos los datos de Firebase y actualiza el store.
 * @property {function(Object, string): Promise<void>} agregarElemento - Agrega un elemento a la clave indicada y actualiza lugares relacionados si es necesario.
 * @property {function(string, string): Promise<void>} eliminarElemento - Elimina un elemento por clave e ID, actualizando lugares relacionados si corresponde.
 * @property {function(string, string, Object): Promise<void>} actualizarElemento - Actualiza un elemento por clave e ID, gestionando cambios de ubicación para alimentos.
 *
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<StoreState>>}
 *
 * @example
 * const alimentos = useStore(state => state.alimentos);
 * await useStore.getState().agregarElemento(nuevoAlimento, 'alimentos');
 */
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
          console.log('Datos obtenidos con éxito');
        } catch (error) {
          console.error('Error al obtener los datos:', error);
        }
      },

      agregarElemento: async (elemento, key) => {
        try {
          const data = await agregarElementoFB(elemento, key);
          if (data) {
            // 1. Actualizar estado local: key
            set((state) => {
              state[key] = { ...state[key], [elemento.id]: elemento };
            });
            // 2. Si es un alimento, actualizar estado local del lugar
            let lugarActualizado;
            if (key === "alimentos" && elemento.ubicacion && elemento.ubicacion.id) {
              const lugarId = elemento.ubicacion.id;
              const storeState = useStore.getState();
              const lugarActual = storeState.lugares[lugarId];
              if (lugarActual) {
                set((state) => {
                  if (!state.lugares[lugarId].alimentos) state.lugares[lugarId].alimentos = {};
                  state.lugares[lugarId].alimentos[elemento.id] = elemento;
                });
                // Serializar todos los alimentos a objetos planos
                const alimentosPlanos = {};
                const alimentosOriginales = { ...(lugarActual.alimentos || {}), [elemento.id]: elemento };
                Object.entries(alimentosOriginales).forEach(([id, alimento]) => {
                  alimentosPlanos[id] = JSON.parse(JSON.stringify(alimento));
                });
                lugarActualizado = {
                  ...lugarActual,
                  alimentos: alimentosPlanos
                };
              }
            }
            // 3. Actualizar en Firestore el lugar si hubo actualización local
            if (lugarActualizado) {
              await actualizarElementoFB("lugares", lugarActualizado.id, JSON.parse(JSON.stringify(lugarActualizado)));
            }
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
            // Si es un alimento, eliminarlo también del lugar correspondiente
            if (key === "alimentos") {
              // Buscar el lugar que contiene este alimento
              const storeState = useStore.getState();
              const lugares = storeState.lugares;
              let lugarIdEncontrado = null;
              for (const [lugarId, lugar] of Object.entries(lugares)) {
                if (lugar.alimentos && lugar.alimentos[id]) {
                  lugarIdEncontrado = lugarId;
                  break;
                }
              }
              if (lugarIdEncontrado) {
                // Eliminar del estado local
                set((state) => {
                  if (state.lugares[lugarIdEncontrado].alimentos) {
                    delete state.lugares[lugarIdEncontrado].alimentos[id];
                  }
                });
                // Serializar alimentos planos
                const lugarActual = useStore.getState().lugares[lugarIdEncontrado];
                const alimentosPlanos = {};
                Object.entries(lugarActual.alimentos || {}).forEach(([aid, alimento]) => {
                  alimentosPlanos[aid] = JSON.parse(JSON.stringify(alimento));
                });
                const lugarActualizado = {
                  ...lugarActual,
                  alimentos: alimentosPlanos
                };
                await actualizarElementoFB("lugares", lugarActualizado.id, JSON.parse(JSON.stringify(lugarActualizado)));
              }
            }
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
            // Si es un alimento y cambia de ubicación, moverlo entre lugares
            if (key === "alimentos" && nuevoElemento.ubicacion && nuevoElemento.ubicacion.id) {
              const storeState = useStore.getState();
              // Buscar el lugar anterior
              let lugarAnteriorId = null;
              for (const [lugarId, lugar] of Object.entries(storeState.lugares)) {
                if (lugar.alimentos && lugar.alimentos[id]) {
                  lugarAnteriorId = lugarId;
                  break;
                }
              }
              const lugarNuevoId = nuevoElemento.ubicacion.id;
              // Si cambió de lugar
              if (lugarAnteriorId && lugarAnteriorId !== lugarNuevoId) {
                // Eliminar del lugar anterior
                set((state) => {
                  if (state.lugares[lugarAnteriorId].alimentos) {
                    delete state.lugares[lugarAnteriorId].alimentos[id];
                  }
                });
                // Serializar y actualizar lugar anterior en Firestore
                const lugarAnterior = useStore.getState().lugares[lugarAnteriorId];
                const alimentosPlanosAnt = {};
                Object.entries(lugarAnterior.alimentos || {}).forEach(([aid, alimento]) => {
                  alimentosPlanosAnt[aid] = JSON.parse(JSON.stringify(alimento));
                });
                const lugarAnteriorActualizado = {
                  ...lugarAnterior,
                  alimentos: alimentosPlanosAnt
                };
                await actualizarElementoFB("lugares", lugarAnteriorActualizado.id, JSON.parse(JSON.stringify(lugarAnteriorActualizado)));
                // Agregar al nuevo lugar
                set((state) => {
                  if (!state.lugares[lugarNuevoId].alimentos) state.lugares[lugarNuevoId].alimentos = {};
                  state.lugares[lugarNuevoId].alimentos[id] = nuevoElemento;
                });
                // Serializar y actualizar lugar nuevo en Firestore
                const lugarNuevo = useStore.getState().lugares[lugarNuevoId];
                const alimentosPlanosNuevo = {};
                Object.entries(lugarNuevo.alimentos || {}).forEach(([aid, alimento]) => {
                  alimentosPlanosNuevo[aid] = JSON.parse(JSON.stringify(alimento));
                });
                const lugarNuevoActualizado = {
                  ...lugarNuevo,
                  alimentos: alimentosPlanosNuevo
                };
                await actualizarElementoFB("lugares", lugarNuevoActualizado.id, JSON.parse(JSON.stringify(lugarNuevoActualizado)));
              } else if (lugarAnteriorId && lugarAnteriorId === lugarNuevoId) {
                // Solo actualizar el alimento en el mismo lugar
                set((state) => {
                  state.lugares[lugarNuevoId].alimentos[id] = nuevoElemento;
                });
                const lugarNuevo = useStore.getState().lugares[lugarNuevoId];
                const alimentosPlanosNuevo = {};
                Object.entries(lugarNuevo.alimentos || {}).forEach(([aid, alimento]) => {
                  alimentosPlanosNuevo[aid] = JSON.parse(JSON.stringify(alimento));
                });
                const lugarNuevoActualizado = {
                  ...lugarNuevo,
                  alimentos: alimentosPlanosNuevo
                };
                await actualizarElementoFB("lugares", lugarNuevoActualizado.id, JSON.parse(JSON.stringify(lugarNuevoActualizado)));
              }
            }
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