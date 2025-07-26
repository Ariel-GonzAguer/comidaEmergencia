// zustand
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

// firestore
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
const documento = "comidaEmergenciaCasa"; // nombre del documento en Firestore

const useStore = create( //change the name of the store
  persist(
    immer((set) => ({
      // Estados
      recetas: [],
      alimentos: [],
      lugares: [],
      notas: [],

      // Acciones
      agregarAlimento: async (alimento) => {
        // obtener el documento de la base de datos
        const docRef = doc(db, "emergenciaDataTotal", documento);
        const docSnap = await getDoc(docRef);

         if (!docSnap.exists()) {
            console.error("El documento de la empresa no existe");
            return false;
          }

          const alimentos = docSnap.data().alimentos || [];

        set((state) => {
          state.alimentos.push(alimento);
        });
      },

      agregarReceta: (receta) => {
        set((state) => {
          state.recetas.push(receta);
        });
      },

      agregarLugar: (lugar) => {
        set((state) => {
          state.lugares.push(lugar);
        });
      },

      agregarNota: (nota) => {
        set((state) => {
          state.notas.push(nota);
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