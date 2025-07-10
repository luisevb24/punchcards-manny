import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Importar Bootstrap JS solo en el cliente
    if (typeof window !== 'undefined') {
      require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }
  }, []);

  return <Component {...pageProps} />;
}