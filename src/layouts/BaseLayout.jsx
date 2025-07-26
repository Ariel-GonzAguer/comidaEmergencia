import { Toaster } from "sonner";

export default function BaseLayout({ children }) {
  return (
    <section className="container bg-background text-text font-primary min-h-screen flex flex-col items-center justify-center">
      <Toaster />
      {children}
    </section>
  );
}
