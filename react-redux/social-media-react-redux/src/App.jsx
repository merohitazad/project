import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <div className="content">
        <SideBar />
        <Outlet></Outlet>
      </div>
    </>
  );
}

export default App;
