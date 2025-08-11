// toast
import { toast } from 'sonner';

// store
import useStore from '../../../stores/useStore';

/**
 * Objeto que contiene estrategias para mostrar diferentes tipos de notificaciones toast.
 *
 * @namespace toastStrategiesObject
 *
 * @property {Function} success - Muestra una notificación toast de éxito.
 * @param {Object} params
 * @param {string} params.mensaje - El mensaje a mostrar en el toast.
 *
 * @property {Function} error - Muestra una notificación toast de error.
 * @param {Object} params
 * @param {string} params.mensaje - El mensaje a mostrar en el toast.
 *
 * @property {Function} eliminar - Muestra un toast con confirmación de eliminación y acciones.
 * @param {Object} params
 * @param {string} params.key - La clave que identifica el tipo de elemento a eliminar.
 * @param {string|number} params.id - El ID del elemento a eliminar.
 * @param {string} [params.mensaje='¿Desea eliminar este elemento permanentemente?'] - El mensaje de confirmación.
 *
 * @property {Function} default - Muestra una notificación toast por defecto.
 * @param {Object} params
 * @param {string} params.mensaje - El mensaje a mostrar en el toast.
 */
const toastStrategiesObject = {
  success: ({ mensaje }) => {
    toast.success(mensaje, {
      duration: 3000,
      style: {
        backgroundColor: 'green',
        color: 'white',
      },
    });
  },

  error: ({ mensaje }) => {
    toast.error(mensaje, {
      duration: 3000,
      style: {
        backgroundColor: 'red',
        color: 'black',
      },
    });
  },

  eliminar: ({ key, id, mensaje = '¿Desea eliminar este elemento permanentemente?' }) => {
    toast(mensaje, {
      duration: 3000,
      action: {
        label: 'Eliminar',
        style: {
          backgroundColor: 'red',
          color: 'white',
        },
        onClick: async () => {
          try {
            const resultPromise = new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve(useStore.getState().eliminarElemento(key, id));
                reject('Error al eliminar el elemento');
              }, 2000);
            });
            toast.promise(resultPromise, {
              loading: 'Eliminando...',
              success: 'Elemento eliminado correctamente',
              error: 'Error al eliminar el elemento',
            });
          } catch (error) {
            toast.error('Error al eliminar el elemento');
            console.error('Error al eliminar el elemento:', error);
          }
        },
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => {
          toast('Eliminación cancelada', {
            style: {
              backgroundColor: 'white',
              color: 'black',
            },
          });
        },
      },
      style: {
        backgroundColor: 'white',
        color: 'black',
      },
    });
  },

  default: ({ mensaje }) => {
    toast(mensaje, {
      duration: 3000,
      style: {
        backgroundColor: 'white',
        color: 'black',
      },
    });
  },
};

export default toastStrategiesObject;
