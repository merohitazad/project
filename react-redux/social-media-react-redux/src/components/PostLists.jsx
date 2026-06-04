import { useEffect, useState } from "react";
import Post from "./Post";
import WelcomeMessage from "./WelcomeMessage";
import { useLoaderData } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { postListActions } from "../store/postListSlice";
import { fetchStatusActions } from "../store/fetchStatusSlice";

const PostLists = () => {
  const LoadingSpinner = useLoaderData();
  const dispatch = useDispatch();

  const fetchingStatus = useSelector((store) => store.fetchStatus);
  const fetching = fetchingStatus.currentlyFetching;

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (fetching) {
      fetch("https://dummyjson.com/posts", { signal })
        .then((res) => res.json())
        .then((object) => object.posts)
        .then((newPostsArray) => {
          dispatch(postListActions.addInitialPosts(newPostsArray));
          dispatch(fetchStatusActions.markFetchingFinished());
        });
    }
    return () => controller.abort();
  }, [fetching]);

  const postList = useSelector((store) => store.postList);

  if (fetching) {
    return LoadingSpinner;
  } else if (!fetching && postList.length === 0) {
    return <WelcomeMessage />;
  } else
    return (
      <div className="post-list">
        {postList.map((post) => (
          <Post key={post.id} post={post}></Post>
        ))}
      </div>
    );
};

export default PostLists;
