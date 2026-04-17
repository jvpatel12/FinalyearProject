import { RouterProvider } from "react-router-dom";
import { CartContextProvider } from "./cart/CartContext.jsx";
import { AuthProvider } from "./auth/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ComparisonProvider } from "./context/ComparisonContext";
import { ChatContextProvider } from "./chat/ChatContext";
import ChatWidget from "./chat/ChatWidget";
import { Toaster } from 'react-hot-toast';
import router from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <CartContextProvider>
        <WishlistProvider>
          <ComparisonProvider>
            <ChatContextProvider>
              <Toaster position="top-right" reverseOrder={false} />
              <RouterProvider router={router} />
              <ChatWidget />
            </ChatContextProvider>
          </ComparisonProvider>
        </WishlistProvider>
      </CartContextProvider>
    </AuthProvider>
  );
}

export default App;
