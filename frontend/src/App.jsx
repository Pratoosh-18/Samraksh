import AppProvider from "@/context/app-provider";
import AppRoutes from "@/routes/app-routes";
import Navbar from "@/components/navbar";
import { useLocation } from "react-router-dom";
import Footer from "./components/footer";

const authRoutes = ["/login", "/register"];

function App() {
  const location = useLocation();

  return (
    <AppProvider>
      {!authRoutes.includes(location.pathname) && <Navbar />}

      <div>
        <AppRoutes />
      </div>

      {!authRoutes.includes(location.pathname) && <Footer />}
    </AppProvider>
  );
}

export default App;
