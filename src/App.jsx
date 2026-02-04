import { RouterProvider } from "react-router-dom";
import { CartContextProvider } from "./cart/CartContext.jsx";
import { AuthProvider } from "./auth/AuthContext";
import router from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <CartContextProvider>
        <RouterProvider router={router} />
      </CartContextProvider>
    </AuthProvider>
  );
}

export default App;
