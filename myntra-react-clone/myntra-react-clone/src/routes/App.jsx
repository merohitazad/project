import { useSelector } from "react-redux";
import FetchItems from "../components/FetchItems";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../index.css";
import { Outlet } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  
  const fetchStatus = useSelector((store) => store.fetchStatus);

  return (
    <>
      <Header />
      <FetchItems/>
      {fetchStatus.currentlyFetching ? <LoadingSpinner/> : <Outlet/>}
      <Footer />
    </>
  );
}

export default App;
