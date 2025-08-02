// toast
import { toast } from 'sonner';

// store
import useStore from '../../stores/useStore';

const eliminarElemento = useStore.getState().eliminarElemento;

const mostrarToastStrategy = {
  success: (mensaje) => {
    toast.success(mensaje, {
      duration: 3000,
      style: {
        backgroundColor: 'green',
        color: 'white',
      },
    });
  },
  error: (mensaje) => {
    toast.error(mensaje, {
      duration: 3000,
      style: {
        backgroundColor: 'red',
        color: 'black',
      },
    });
  },
  eliminar: (id) => {
    toast('¿Desea eliminar este elemento permanentemente?', {
      duration: 3000,
      action: {
        label: 'Eliminar',
        style: {
          backgroundColor: 'red',
          color: 'white',
        },
        onClick: async () => {
          try {
            await eliminarElemento('alimentos', id);
            toast.success('Elemento eliminado correctamente');
          } catch (error) {
            toast.error('Error al eliminar el elemento');
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
  default: (mensaje) => {
    toast(mensaje, {
      duration: 3000,
      style: {
        backgroundColor: 'white',
        color: 'black',
      },
    });
  },
};

export default mostrarToastStrategy;