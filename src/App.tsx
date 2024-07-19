import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Updater from "./components/Updater";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <Updater />
    </>
  );
}

export default App;
