import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;