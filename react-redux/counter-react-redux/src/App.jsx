import Header from "./components/Header";
import DisplayCounter from "./components/DisplayCounter";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "./components/Container";
import Controls from "./components/Controls";
import { useSelector } from "react-redux";
import PrivacyMessage from "./components/PrivacyMessage";

function App() {
  const privacy = useSelector(store => store.privacy);
  return (
    <center style={{margin: "100px"}}>
      <Container>
      <Header></Header>
      {privacy ? <PrivacyMessage/> : <DisplayCounter/>}
      <Controls></Controls>
      </Container>
    </center>
  );
}

export default App;
