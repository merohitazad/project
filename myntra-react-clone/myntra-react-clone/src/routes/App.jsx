import { useSelector } from "react-redux";
import FetchItems from "../components/FetchItems";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../index.css";
import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {

  return (
    <>
      <Header />
      <FetchItems/>
      <Outlet/>
      <Footer />
    </>
  );
}

export default App;
