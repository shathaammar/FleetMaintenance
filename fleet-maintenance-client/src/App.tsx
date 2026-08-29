import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AppRoutes } from "./routes/AppRoutes";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            color: "#f8fafc",
            background: "#10243a",
            border: "1px solid #1e3348",
          },
        }}
      />
    </AuthProvider>
  </BrowserRouter>
);
}

export default App;