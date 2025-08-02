// componentes
import AgregarButton from "../componentes/AgregarButton";

// error-bundary
import { ErrorBoundary } from "react-error-boundary";

// data
import { keysArray } from "../servicios/firebaseService";

// store
import useStore from "../stores/useStore";

export default function Home() {
  const { alimentos } = useStore();


  return (
    <section className="flex flex-col items-center justify-center h-full">
      <ErrorBoundary
        fallback={<div>Something went wrong</div>}
        onError={(error, info) => {
          console.error("ErrorBoundary caught an error:", error, info);
        }}
      >
        <section className="flex items-center justify-center w-full mt-4 flex-wrap m-[0_auto]">
          {keysArray.map((key) => {
            return <AgregarButton key={key} tipo={key} />;
          })}
        </section>
        {/* <p>Total calorías: {caloriasTotales}</p> */}
      </ErrorBoundary>
    </section>
  );
}
