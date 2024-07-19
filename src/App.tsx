import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Updater from "./components/Updater";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <Updater />
      <Footer />
    </>
  );
}

export default App;
