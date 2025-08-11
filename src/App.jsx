import { useEffect } from 'react';
import { auth } from './firebase/firebaseConfig';
import useAuthStore from './stores/useAuthStore';
import MichiRouter from './componentes/MichiRouter';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const { setUser, user } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      if (!currentUser) {
        setUser(null);
      } else {
        // Solo actualizamos si tenemos un email válido
        // Preservamos la empresa existente si ya está almacenada
        if (currentUser.email) {
          setUser({
            email: currentUser.email,
          });
        }
      }
    });

    return () => unsubscribe(); // Limpia el listener al desmontar el componente
  }, [setUser, user?.empresa]); // Include user.empresa to preserve it
  return <MichiRouter />;
}
