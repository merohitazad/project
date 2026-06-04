import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import CreatePost, { createPostAction } from "./components/CreatePost.jsx";
import PostLists from "./components/PostLists.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <PostLists />, loader: LoadingSpinner },
      {
        path: "create-post",
        element: <CreatePost />,
        action: createPostAction,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
