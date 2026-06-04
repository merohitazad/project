import { createContext, useEffect, useReducer, useState } from "react";

const DEFAULT_CONTEXT = {
  postListArray: [],
  fetching: true,
  addPost: () => {},
  deletePost: () => {},
};

export const PostListContext = createContext(DEFAULT_CONTEXT);

const postListReducer = (postListArray, action) => {
  if (action.type === "DELETE_POST") {
    return postListArray.filter((post) => post.id !== action.payload);
  } else if (action.type === "ADD_POST") {
    return [action.payload, ...postListArray];
  } else if (action.type === "ADD_INITIAL_POSTS") {
    return action.payload;
  }
  return postListArray;
};

const PostListProvider = ({ children }) => {
  const [postListArray, dispatchPostListArray] = useReducer(
    postListReducer,
    [],
  );

  const addInitialPosts = (postList) => {
    dispatchPostListArray({ type: "ADD_INITIAL_POSTS", payload: postList });
  };

  const addPost = (post) => {
    dispatchPostListArray({ type: "ADD_POST", payload: post });
  };

  const deletePost = (id) => {
    dispatchPostListArray({ type: "DELETE_POST", payload: id });
  };

  const [fetching, setFetching] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (fetching) {
      fetch("https://dummyjson.com/posts", { signal })
        .then((res) => res.json())
        .then((object) => object.posts)
        .then((newPostsArray) => {
          addInitialPosts(newPostsArray);
          setFetching(false);
        });
    }
    return () => controller.abort();
  }, []);

  return (
    <PostListContext.Provider
      value={{ postListArray, fetching, addPost, deletePost }}
    >
      {children}
    </PostListContext.Provider>
  );
};

export default PostListProvider;
