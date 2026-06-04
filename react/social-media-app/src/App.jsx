import { useContext, useState } from "react";
import CreatePost from "./components/CreatePost";
import Header from "./components/Header";
import PostLists from "./components/PostLists";
import SideBar from "./components/SideBar";
import PostListProvider, { PostListContext } from "./store/PostList-Store";

function App() {
  const [selectedTab, setSelectedTab] = useState("Home");

  return (
    <PostListProvider>
      <Header></Header>
      <div className="content">
        <SideBar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        ></SideBar>
        {selectedTab === "Home" ? <PostLists/> : <CreatePost />}
      </div>
    </PostListProvider>
  );
}

export default App;
