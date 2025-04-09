import AppRoutes from "@/routes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AppRoutes />
    </>
  );
}

export default App;
