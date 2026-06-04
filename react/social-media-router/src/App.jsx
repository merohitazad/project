import { useContext, useState } from "react";
import CreatePost from "./components/CreatePost";
import Header from "./components/Header";
import PostLists from "./components/PostLists";
import SideBar from "./components/SideBar";
import PostListProvider, { PostListContext } from "./store/PostList-Store";
import { Outlet } from "react-router-dom";

function App() {

  return (
    <PostListProvider>
      <Header/>
      <div className="content">
        <SideBar/>
        <Outlet></Outlet>
      </div>
    </PostListProvider>
  );
}

export default App;
